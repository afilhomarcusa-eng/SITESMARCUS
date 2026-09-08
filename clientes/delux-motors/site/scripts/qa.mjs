/**
 * Portão de QA.
 *
 * Roda contra o build de produção, num navegador de verdade, e falha alto.
 * Tudo que dá para afirmar em código está afirmado aqui, porque checklist que
 * uma pessoa lê uma vez para de funcionar no primeiro dia em que algo muda.
 *
 *   npm run qa
 *
 * As telas saem em qa/, e elas são para olhar, não só para colecionar.
 */

import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.QA_BASE ?? "http://127.0.0.1:3310";

/**
 * A gerência é protegida por senha, conferida no servidor por proxy.ts. O QA
 * precisa da credencial para chegar lá, e precisa também conferir que sem ela
 * ninguém entra.
 */
const SENHA_ADMIN = process.env.ADMIN_SENHA ?? "";
const CREDENCIAL = { username: "delux", password: SENHA_ADMIN };
const SAIDA = path.resolve("qa");
const LARGURAS = [360, 390, 430, 768, 1024, 1280, 1440, 1920];

const falhas = [];
const passou = [];

function checar(condicao, titulo, detalhe = "") {
  if (condicao) passou.push(titulo);
  else falhas.push(detalhe ? `${titulo} :: ${detalhe}` : titulo);
}

/**
 * O mapa embutido é um iframe do Google e o script dele grita no console por
 * conta própria. Não é defeito deste site e não dá para consertar daqui. Erro
 * de qualquer outra origem continua reprovando.
 */
const TERCEIROS = /maps\.gstatic\.com|maps\.google|google\.com\/maps|gstatic\.com/;

async function abrir(ctx, rota) {
  const pagina = await ctx.newPage();
  const erros = [];
  const ruins = [];
  pagina.on("console", (m) => {
    if (m.type() !== "error") return;
    const origem = m.location()?.url ?? "";
    if (TERCEIROS.test(origem) || TERCEIROS.test(m.text())) return;
    erros.push(m.text());
  });
  pagina.on("pageerror", (e) => {
    if (!TERCEIROS.test(String(e))) erros.push(String(e));
  });
  pagina.on("response", (r) => {
    if (r.status() >= 400 && r.url().startsWith(BASE)) ruins.push(`${r.status()} ${r.url()}`);
  });
  await pagina.goto(BASE + rota, { waitUntil: "networkidle" });
  return { pagina, erros, ruins };
}

/** Rola a página inteira, para disparar o que é preguiçoso e o que revela. */
async function rolarTudo(pagina) {
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
  });
  await pagina.waitForTimeout(500);
  await pagina.evaluate(() => window.scrollTo(0, 0));
  await pagina.waitForTimeout(300);
}

/** Tudo que precisa abrir conversa, conferido um a um pelo próprio seletor. */
const CTAS_CONVERSA = [
  { sel: "[data-cta='cabecalho']", onde: "cabeçalho" },
  { sel: "[data-cta='heroi']", onde: "herói" },
  { sel: "[data-cta='servico-comprar']", onde: "serviço comprar" },
  { sel: "[data-cta='servico-vender']", onde: "serviço vender" },
  { sel: "[data-cta='servico-consignar']", onde: "serviço consignar" },
  { sel: "[data-cta='estoque-whatsapp']", onde: "faixa de estoque" },
  { sel: "[data-cta='final']", onde: "fecho" },
];

const SECOES = ["conteudo", "servicos", "estoque", "loja", "local", "duvidas"];

/* ------------------------------------------------------------- estruturais */

async function estruturais(navegador, manifesto) {
  for (const largura of LARGURAS) {
    const ctx = await navegador.newContext({
      viewport: { width: largura, height: 900 },
      deviceScaleFactor: 1,
    });
    const { pagina, erros, ruins } = await abrir(ctx, "/");

    await rolarTudo(pagina);

    const estouro = await pagina.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    checar(estouro <= 1, `sem estouro horizontal em ${largura}`, `sobra de ${estouro}px`);

    const h1 = await pagina.locator("h1").count();
    checar(h1 === 1, `exatamente um h1 em ${largura}`, `achei ${h1}`);

    const quebradas = await pagina.evaluate(() =>
      [...document.images]
        .filter((i) => i.loading !== "lazy" && (!i.complete || i.naturalWidth === 0))
        .map((i) => i.currentSrc || i.src),
    );
    checar(quebradas.length === 0, `imagens carregaram em ${largura}`, quebradas.join(", "));
    checar(erros.length === 0, `sem erro de console em ${largura}`, erros.slice(0, 3).join(" | "));
    checar(ruins.length === 0, `sem resposta 400+ em ${largura}`, ruins.slice(0, 3).join(" | "));

    const escondidos = await pagina.evaluate(() =>
      [...document.querySelectorAll("[data-revela], .mascara")]
        .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9)
        .map((e) => e.className),
    );
    checar(
      escondidos.length === 0,
      `nenhuma revelação presa em ${largura}`,
      escondidos.slice(0, 3).join(" | "),
    );

    // Título comido pela própria caixa. Mede o texto contra a caixa, em vez de
    // acreditar no CSS.
    const cortados = await pagina.evaluate(() =>
      [...document.querySelectorAll("h1, h2, h3, .display, .display-leve")]
        .filter((e) => {
          const s = getComputedStyle(e);
          if (s.display === "none" || s.whiteSpace === "nowrap") return false;
          return e.scrollWidth - e.clientWidth > 2;
        })
        .map((e) => `${e.tagName} "${e.textContent.trim().slice(0, 24)}" sobra ${e.scrollWidth - e.clientWidth}px`),
    );
    checar(
      cortados.length === 0,
      `nenhum título cortado em ${largura}`,
      cortados.slice(0, 4).join(" | "),
    );

    /* -------------------------------------------------- a lei da resolução */
    // Compara a caixa desenhada contra a NATIVA da origem, lida do manifesto.
    // Comparar contra o arquivo exportado deixaria passar qualquer pipeline que
    // amplia, que é exatamente o defeito que esta regra existe para pegar.
    const desenhadas = await pagina.evaluate(() =>
      [...document.images].map((i) => ({
        src: (i.currentSrc || i.src).split("/").pop().split("?")[0],
        css: Math.round(i.getBoundingClientRect().width),
      })),
    );
    for (const d of desenhadas) {
      const info = manifesto.imagens[d.src];
      if (!info || d.css === 0) continue;
      checar(
        d.css <= info.nativa.w,
        `${d.src} não é desenhada acima da nativa em ${largura}`,
        `caixa ${d.css}px contra nativa ${info.nativa.w}px`,
      );
      checar(
        info.exportada.w >= Math.min(d.css * 2, info.nativa.w),
        `${d.src} tem pixel suficiente para o slot em ${largura}`,
        `exportada ${info.exportada.w}px, caixa ${d.css}px`,
      );
    }

    const arquivos = desenhadas.map((d) => d.src);
    const repetidos = arquivos.filter((f, i) => arquivos.indexOf(f) !== i);
    checar(
      repetidos.length === 0,
      `nenhuma imagem repetida em ${largura}`,
      [...new Set(repetidos)].join(", "),
    );

    if ([390, 1440, 1920].includes(largura)) {
      await pagina.screenshot({ path: path.join(SAIDA, `home-${largura}.png`), fullPage: true });
    }
    await ctx.close();
  }
}

/* ----------------------------------------------------------------- copy */

async function copy(navegador) {
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    httpCredentials: CREDENCIAL,
  });
  for (const rota of ["/", "/estoque", "/procuro", "/admin"]) {
    const { pagina } = await abrir(ctx, rota);
    const texto = await pagina.evaluate(() => document.body.innerText);

    checar(!/[—–]/.test(texto), `sem travessão em ${rota}`, (texto.match(/.{0,30}[—–].{0,30}/) ?? [""])[0]);

    const ingles = /\b(Lorem ipsum|Your text here|Book now|Discover|Learn more|Read more|Click here|Coming soon|placeholder)\b/i;
    checar(!ingles.test(texto), `sem sobra de inglês em ${rota}`, (texto.match(ingles) ?? [""])[0]);

    const dup = texto.replace(/\s+/g, " ").match(/\b([A-Za-zÀ-ÿ]{3,})\s+\1\b/i);
    checar(!dup, `sem palavra duplicada em ${rota}`, dup ? dup[0] : "");

    const proibidas = /\b(excelência|jornada|solução completa|potencialize|descubra|referência no mercado)\b/i;
    checar(!proibidas.test(texto), `sem clichê proibido em ${rota}`, (texto.match(proibidas) ?? [""])[0]);

    await pagina.close();
  }
  await ctx.close();
}

/* ------------------------------------------------------------- conversão */

async function conversao(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const { pagina } = await abrir(ctx, "/");

  const contato = await readFile(path.resolve("lib/contato.ts"), "utf8");
  const numero = contato.match(/e164: "(\d+)"/);
  checar(!!numero, "achei o número em lib/contato.ts");

  // Celular brasileiro em formato internacional tem 13 dígitos e o assinante
  // começa com 9. Fixo tem 12. Qualquer outra forma não abre conversa.
  for (const [, n] of contato.matchAll(/e164: "(\d+)"/g)) {
    const celular = n.length === 13 && n.startsWith("55") && n[4] === "9";
    const fixo = n.length === 12 && n.startsWith("55");
    checar(celular || fixo, `número ${n} tem forma válida`, `${n.length} dígitos`);
  }

  for (const { sel, onde } of CTAS_CONVERSA) {
    const el = pagina.locator(sel).first();
    checar((await el.count()) > 0, `existe o CTA do ${onde}`);
    if ((await el.count()) === 0) continue;
    const href = await el.getAttribute("href");
    checar(
      !!href && href.includes(`wa.me/${numero[1]}`),
      `CTA do ${onde} aponta para o WhatsApp completo`,
      href ?? "sem href",
    );
    checar(
      (await el.getAttribute("target")) !== "_blank" ||
        ((await el.getAttribute("rel")) ?? "").includes("noopener"),
      `CTA do ${onde} tem rel noopener`,
    );
  }

  // Cada serviço abre a conversa com a mensagem dele, não com uma genérica.
  // Quem chega querendo vender não deveria ter que explicar do zero.
  const msgs = {};
  for (const id of ["comprar", "vender", "consignar"]) {
    const href = await pagina.locator(`[data-cta='servico-${id}']`).first().getAttribute("href");
    msgs[id] = decodeURIComponent((href ?? "").split("text=")[1] ?? "");
  }
  checar(/comprar/i.test(msgs.comprar), "a mensagem de comprar fala em comprar", msgs.comprar);
  checar(/vender/i.test(msgs.vender), "a mensagem de vender fala em vender", msgs.vender);
  checar(
    /consigna/i.test(msgs.consignar),
    "a mensagem de consignar fala em consignação",
    msgs.consignar,
  );
  checar(
    new Set(Object.values(msgs)).size === 3,
    "as três mensagens são diferentes entre si",
  );

  // Todo wa.me da página, não só os marcados.
  const numeros = await pagina.evaluate(() =>
    [...document.querySelectorAll("a[href*='wa.me']")].map(
      (a) => a.getAttribute("href").match(/wa\.me\/(\d+)/)[1],
    ),
  );
  checar(numeros.length > 0, "a home tem link de WhatsApp");
  for (const n of numeros) {
    checar(n.length === 13 && n[4] === "9", `link wa.me completo: ${n}`, `${n.length} dígitos`);
  }

  // A rota abre no Google Maps com as coordenadas da loja.
  const rota = await pagina.locator("[data-cta='rota']").first().getAttribute("href");
  checar(
    !!rota && rota.includes("-12.9775529") && rota.includes("-38.4241148"),
    "o botão de rota leva às coordenadas da loja",
    rota ?? "",
  );

  const ancoras = await pagina.evaluate(() =>
    [...document.querySelectorAll("a[href*='#']")]
      .map((a) => a.getAttribute("href"))
      .map((h) => h.slice(h.indexOf("#") + 1))
      .filter(Boolean),
  );
  for (const id of [...new Set(ancoras)]) {
    const existe = await pagina.evaluate((x) => !!document.getElementById(x), id);
    checar(existe, `a âncora #${id} existe`);
  }

  const semNoopener = await pagina.evaluate(() =>
    [...document.querySelectorAll("a[target='_blank']")]
      .filter((a) => !(a.getAttribute("rel") ?? "").includes("noopener"))
      .map((a) => a.getAttribute("href")),
  );
  checar(semNoopener.length === 0, "todo _blank tem noopener", semNoopener.join(", "));

  await pagina.close();
  await ctx.close();
}

/* --------------------------------------------------- abertura e movimento */

async function abertura(navegador) {
  // O CTA principal precisa estar cheio e clicável durante a abertura inteira.
  // Abertura que apaga a ação principal custa conversa, e ninguém pega isso no
  // olho porque dura poucos segundos.
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + "/", { waitUntil: "domcontentloaded" });

  const inicio = Date.now();
  for (const t of [120, 500, 1000, 1600, 2300, 3000]) {
    const falta = t - (Date.now() - inicio);
    if (falta > 0) await pagina.waitForTimeout(falta);

    const estado = await pagina.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const meio = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return {
        opacidade: parseFloat(s.opacity),
        visivel: s.visibility !== "hidden" && r.width > 0 && r.height > 0,
        noTopo: !!meio && (meio === el || el.contains(meio)),
      };
    }, "[data-cta='cabecalho']");

    checar(!!estado, `o CTA do cabeçalho existe em ${t}ms`);
    if (estado) {
      checar(estado.opacidade >= 0.99, `CTA cheio em ${t}ms`, `opacidade ${estado.opacidade}`);
      checar(estado.visivel, `CTA visível em ${t}ms`);
      checar(estado.noTopo, `CTA clicável, nada por cima, em ${t}ms`);
    }
    await pagina.screenshot({ path: path.join(SAIDA, `abertura-${t}ms.png`) });
  }
  await pagina.close();

  /* ------------------------------------------------------ a abertura em si */

  // Três coisas precisam ser verdade, e as três já falharam alguma vez.
  //
  // 1. A cena tem que estar PINTADA desde o começo, com a foto em opacidade
  //    cheia. É o véu que esconde. Se alguém voltar a animar a opacidade do
  //    conteúdo, o LCP passa a medir o fim da abertura, e já mediu 4,2s assim.
  //
  // 2. A abertura tem que estar acontecendo, ou seja o véu tem que estar lá
  //    cobrindo, e não a cena aberta com o céu ainda animando por trás. Foi
  //    esse o defeito relatado: dois relógios começando em momentos
  //    diferentes, o conteúdo abrindo antes.
  //
  // 3. A abertura tem que TERMINAR. Véu que não sai é uma tela preta.
  const pAb = await ctx.newPage();
  const t0 = Date.now();
  await pAb.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await pAb.waitForTimeout(450);

  const cedo = await pAb.evaluate(() => {
    const foto = document.querySelector("[data-foto-carro]");
    return {
      opacidadeFoto: foto ? parseFloat(getComputedStyle(foto).opacity) : -1,
      temVeu: !!document.querySelector("[data-abertura]"),
    };
  });
  checar(
    cedo.opacidadeFoto >= 0.99,
    "a foto do herói já está pintada aos 450ms",
    "opacidade " + cedo.opacidadeFoto,
  );
  checar(cedo.temVeu, "aos 450ms a abertura ainda está cobrindo a cena");

  await pAb
    .waitForFunction(() => !document.querySelector("[data-abertura]"), undefined, {
      timeout: 12000,
    })
    .catch(() => {});
  const duracao = Date.now() - t0;
  checar(
    duracao >= 2000 && duracao <= 6000,
    "a abertura dura entre 2 e 6 segundos e termina",
    "levou " + duracao + "ms",
  );
  await pAb.close();

  // Uma vez por sessão.
  // Uma vez por sessão.
  const p2 = await ctx.newPage();
  await p2.goto(BASE + "/", { waitUntil: "networkidle" });
  await p2.waitForTimeout(300);
  checar(
    (await p2.evaluate(() => sessionStorage.getItem("dlx:abriu"))) === "1",
    "a abertura se marca como vista na sessão",
  );
  await p2.reload({ waitUntil: "domcontentloaded" });
  await p2.waitForTimeout(200);
  checar(
    (await p2.evaluate(() => sessionStorage.getItem("dlx:abriu"))) === "1",
    "a abertura não repete ao recarregar",
  );
  // Recarregando, o conteúdo do herói tem que estar visível de imediato, sem
  // esperar abertura nenhuma.
  const h1Opac = await p2
    .locator("h1 .display")
    .first()
    .evaluate((e) => getComputedStyle(e).opacity);
  checar(
    parseFloat(h1Opac) >= 0.99,
    "na segunda visita o herói já aparece pronto",
    `opacidade ${h1Opac}`,
  );
  await p2.close();
  await ctx.close();

  // Movimento reduzido: sem abertura, conteúdo visível.
  const ctxR = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const { pagina: pr } = await abrir(ctxR, "/");
  const opacR = await pr
    .locator("h1 .display")
    .first()
    .evaluate((e) => getComputedStyle(e).opacity);
  checar(parseFloat(opacR) >= 0.99, "com movimento reduzido o h1 aparece", `opacidade ${opacR}`);
  await pr.screenshot({ path: path.join(SAIDA, "reduzido-1440.png"), fullPage: true });
  await pr.close();
  await ctxR.close();

  // Sem o pacote 3D.
  //
  // Nasceu de um defeito de verdade: o pacote do three falhou ao carregar e o
  // herói inteiro ficou invisível, para sempre, sem erro na tela. O céu tem
  // fallback em CSS, mas quem revela o conteúdo por cima dele é o callback de
  // progresso da abertura, e ele nunca acontecia.
  const ctx3d = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const p3d = await ctx3d.newPage();
  await p3d.route("**/*", (rota) => {
    const u = rota.request().url();
    // Derruba só o pedaço que carrega o three, deixando o resto do site de pé.
    if (/_next\/static\/chunks\//.test(u) && /three/i.test(u)) return rota.abort();
    return rota.continue();
  });
  // O nome do pacote muda a cada build, então derruba por peso: o chunk do
  // three é, de longe, o maior. Mais direto: nega o contexto de WebGL.
  await p3d.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (tipo, ...resto) {
      if (String(tipo).includes("webgl")) return null;
      return original.call(this, tipo, ...resto);
    };
  });
  await p3d.goto(BASE + "/", { waitUntil: "networkidle" });
  await p3d.waitForTimeout(5200);
  const heroiSem3d = await p3d.evaluate(() => {
    const h1 = document.querySelector("h1 .display");
    const cta = document.querySelector("[data-cta='heroi']");
    const foto = document.querySelector("[data-foto-carro]");
    const op = (e) => (e ? parseFloat(getComputedStyle(e).opacity) : -1);
    return {
      h1: op(h1),
      cta: op(cta?.parentElement?.parentElement ?? cta),
      foto: op(foto),
      veu: !!document.querySelector("[data-abertura]"),
    };
  });
  checar(
    heroiSem3d.h1 >= 0.99,
    "sem WebGL o título do herói aparece",
    `opacidade ${heroiSem3d.h1}`,
  );
  checar(
    heroiSem3d.foto >= 0.99,
    "sem WebGL a foto do carro aparece",
    `opacidade ${heroiSem3d.foto}`,
  );
  // O que de fato importa aqui: sem o three, a abertura ainda TERMINA. Se ela
  // dependesse dele, o véu ficaria preso e o site inteiro sumia atrás de uma
  // tela preta, sem erro nenhum na tela.
  checar(!heroiSem3d.veu, "sem WebGL a abertura termina e o véu sai");

  await p3d.screenshot({ path: path.join(SAIDA, "sem-webgl-1440.png"), fullPage: false });
  await p3d.close();
  await ctx3d.close();

  // Sem JavaScript.
  const ctxJs = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const pj = await ctxJs.newPage();
  await pj.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const h1SemJs = await pj.locator("h1").first().textContent();
  checar(
    /comprar/i.test(h1SemJs ?? "") && /consignar/i.test(h1SemJs ?? ""),
    "sem JavaScript o título principal aparece",
    h1SemJs ?? "sem h1",
  );
  const textoSemJs = await pj.evaluate(() => document.body.innerText);
  checar(
    textoSemJs.includes("98340-2324"),
    "sem JavaScript o telefone continua na página",
  );
  checar(
    textoSemJs.includes("Octávio Mangabeira"),
    "sem JavaScript o endereço continua na página",
  );
  await pj.screenshot({ path: path.join(SAIDA, "sem-js-1440.png"), fullPage: true });
  await pj.close();
  await ctxJs.close();
}

/* ---------------------------------------------------- estoque e gerência */

/**
 * O fluxo que mais importa nesta loja.
 *
 * A Delux Motors não publica estoque em lugar nenhum, então o site nasceu sem
 * catálogo. Duas coisas precisam ser verdade: a página de estoque vazia tem que
 * continuar vendendo em vez de virar beco sem saída, e cadastrar um carro na
 * gerência tem que fazer ele aparecer no estoque de verdade.
 */
async function estoqueEGerencia(navegador) {
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 1000 },
    httpCredentials: CREDENCIAL,
  });

  // ------------------------------------------------------------- o catálogo
  const { pagina, erros } = await abrir(ctx, "/estoque");
  await rolarTudo(pagina);
  checar(erros.length === 0, "o estoque não tem erro de console", erros.join(" | "));
  checar((await pagina.locator("h1").count()) === 1, "o estoque tem um h1");

  const presas = await pagina.evaluate(() =>
    [...document.querySelectorAll("[data-revela], .mascara")]
      .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9)
      .map((e) => e.textContent.trim().slice(0, 30)),
  );
  checar(presas.length === 0, "nenhuma revelação presa em /estoque", presas.slice(0, 3).join(" | "));

  const conta = () => pagina.locator("[data-carro]").count();
  const precos = () =>
    pagina.$$eval("[data-carro]", (as) => as.map((a) => Number(a.dataset.preco)));

  const total = await conta();
  checar(total === 5, "o catálogo abre com os 5 carros", "achei " + total);

  // Pílula sem texto e grupo com uma opção só. Os dois apareceram de verdade:
  // quatro carros estão sem combustível na legenda de origem, e isso virava uma
  // pílula em branco ao lado de "Híbrido".
  const filtros = await pagina.evaluate(() => {
    const painel = document.getElementById("painel-filtros");
    const grupos = [...painel.children].map((g) => ({
      titulo: g.querySelector("p")?.textContent?.trim() ?? "",
      opcoes: [...g.querySelectorAll("button")].map((b) => b.textContent.trim()),
    }));
    return grupos.filter((g) => g.opcoes.length);
  });
  checar(
    filtros.every((g) => g.opcoes.every((o) => o.length > 0)),
    "nenhuma pílula de filtro sem texto",
    JSON.stringify(filtros),
  );
  checar(
    filtros.every((g) => g.opcoes.length > 1),
    "nenhum grupo de filtro com uma opção só",
    JSON.stringify(filtros.filter((g) => g.opcoes.length < 2)),
  );

  /* ------------------------------------------------------- filtro de marca */
  await pagina.getByRole("button", { name: "BMW", exact: true }).click();
  await pagina.waitForTimeout(300);
  const soBmw = await pagina.$$eval("[data-carro] h3", (hs) =>
    hs.map((h) => h.textContent.trim()),
  );
  checar(soBmw.length === 1, "filtrar BMW deixa só a BMW", "sobraram " + soBmw.length);
  checar(
    soBmw.every((n) => n.startsWith("BMW")),
    "só sobra BMW depois de filtrar BMW",
    soBmw.join(", "),
  );
  checar(
    (await pagina.evaluate(() => location.search)).includes("marca=BMW"),
    "o filtro de marca entra na barra de endereço",
  );

  const contagem = await pagina.locator("[aria-live='polite']").first().innerText();
  checar(
    contagem.includes("1") && contagem.includes("5"),
    "a contagem mostra 1 de 5",
    contagem.replace(/\s+/g, " "),
  );

  /* ------------------------------------------ o link filtrado já vem pronto */
  const comFiltro = await pagina.evaluate(() => location.href);
  const p2 = await ctx.newPage();
  await p2.goto(comFiltro, { waitUntil: "networkidle" });
  await p2.waitForTimeout(700);
  checar(
    (await p2.locator("[data-carro]").count()) === 1,
    "abrir o link filtrado já traz o filtro aplicado",
  );
  await p2.close();

  await pagina.getByRole("button", { name: /limpar 1 filtro/i }).first().click();
  await pagina.waitForTimeout(300);
  checar((await conta()) === 5, "limpar filtros devolve os 5");

  /* ----------------------------------------------------------------- busca */
  await pagina.getByPlaceholder("Buscar marca, modelo ou versão").fill("lexus");
  await pagina.waitForTimeout(350);
  checar((await conta()) === 1, "buscar lexus acha só o Lexus");

  await pagina.getByPlaceholder("Buscar marca, modelo ou versão").fill("ferrari");
  await pagina.waitForTimeout(350);
  checar((await conta()) === 0, "busca sem resultado não mostra carro nenhum");
  checar(
    await pagina.getByText("Nenhum carro bate com essa busca").isVisible(),
    "busca sem resultado mostra o estado vazio",
  );
  for (const id of ["comprar", "vender", "consignar"]) {
    checar(
      (await pagina.locator("[data-cta='vazio-" + id + "']").count()) === 1,
      "o estado vazio oferece a porta de " + id,
    );
  }
  await pagina.getByRole("button", { name: /limpar filtros/i }).click();
  await pagina.waitForTimeout(350);
  checar((await conta()) === 5, "limpar do estado vazio devolve os 5");

  /* ----------------------------------------------------------------- preço */
  await pagina.getByRole("button", { name: "Até 120 mil" }).click();
  await pagina.waitForTimeout(300);
  const ate120 = await precos();
  checar(ate120.length > 0, "o filtro de preço deixa algum carro");
  checar(
    ate120.every((v) => v <= 120000),
    "nenhum carro acima de 120 mil sobrevive ao filtro",
    ate120.filter((v) => v > 120000).join(", "),
  );
  await pagina.getByRole("button", { name: /limpar 1 filtro/i }).first().click();
  await pagina.waitForTimeout(300);

  /* ------------------------------------------------------------- ordenação */
  await pagina.getByRole("button", { name: "Menor preço" }).click();
  await pagina.waitForTimeout(300);
  const cres = await precos();
  checar(
    cres.every((v, i) => i === 0 || cres[i - 1] <= v),
    "ordenar por menor preço deixa a lista crescente",
    cres.join(", "),
  );
  await pagina.getByRole("button", { name: "Maior preço" }).click();
  await pagina.waitForTimeout(300);
  const decr = await precos();
  checar(
    decr.every((v, i) => i === 0 || decr[i - 1] >= v),
    "ordenar por maior preço deixa a lista decrescente",
    decr.join(", "),
  );
  checar(decr[0] !== cres[0], "trocar a ordenação muda o primeiro cartão");

  /* --------------------------------------------------------------- alertas */
  // A RAM tem passagem por leilão declarada na legenda deles. Isso muda o valor
  // do carro, então precisa aparecer no cartão e na ficha, não só na conversa.
  const textoLista = await pagina.evaluate(() => document.body.innerText);
  checar(/passagem por leil/i.test(textoLista), "o alerta de leilão aparece na listagem");

  await pagina.screenshot({ path: path.join(SAIDA, "estoque-1440.png"), fullPage: true });
  await pagina.close();

  /* --------------------------------------------------------- ficha do carro */
  const { pagina: ficha, erros: errosFicha } = await abrir(
    ctx,
    "/estoque/ram-laramie-1500-classic-2022",
  );
  await rolarTudo(ficha);
  checar(errosFicha.length === 0, "a ficha não tem erro de console", errosFicha.join(" | "));
  checar((await ficha.locator("h1").count()) === 1, "a ficha tem um h1");
  const textoFicha = await ficha.evaluate(() => document.body.innerText);
  checar(textoFicha.includes("209.900"), "a ficha mostra o preço");
  checar(/passagem por leil/i.test(textoFicha), "o alerta de leilão aparece na ficha");
  const fotosFicha = await ficha.locator("main img").count();
  checar(fotosFicha >= 4, "a ficha traz a galeria do carro", "achei " + fotosFicha);
  const ctaFicha = await ficha.locator("[data-cta='carro']").first().getAttribute("href");
  checar(
    !!ctaFicha && /RAM/i.test(decodeURIComponent(ctaFicha)),
    "o CTA da ficha leva o carro na mensagem",
    ctaFicha ?? "",
  );
  await ficha.screenshot({ path: path.join(SAIDA, "ficha-1440.png"), fullPage: true });
  await ficha.close();

  /* --------------------------------------------------------------- gerência */
  const { pagina: adm } = await abrir(ctx, "/admin");
  for (const c of ["Marca", "Modelo", "Versão", "Ano", "Preço em reais"]) {
    checar(
      (await adm.getByText(c, { exact: false }).count()) > 0,
      "a gerência tem o campo " + c,
    );
  }
  const naLista = await adm.locator("section ul li").count();
  checar(naLista === 5, "a gerência começa com os 5 carros publicados", "achei " + naLista);

  await adm.locator("form input").nth(0).fill("Mercedes-Benz");
  await adm.locator("form input").nth(1).fill("C 180");
  await adm.locator("form input").nth(2).fill("Cabriolet");
  await adm.locator("form input").nth(3).fill("2018");
  const nums = adm.locator("form input[type='number']");
  await nums.nth(1).fill("62000");
  await nums.nth(2).fill("189900");
  await adm.getByRole("button", { name: /cadastrar no estoque/i }).click();
  await adm.waitForTimeout(700);
  checar(
    (await adm.getByText("Mercedes-Benz C 180").count()) > 0,
    "cadastrar um carro grava e ele aparece na lista da gerência",
  );
  const emprestada = await adm.evaluate(() => {
    const linha = [...document.querySelectorAll("section ul li")].find((l) =>
      l.textContent.includes("Mercedes-Benz C 180"),
    );
    const img = linha ? linha.querySelector("img") : null;
    return img ? "mostrou " + img.getAttribute("src") : "";
  });
  checar(emprestada === "", "carro sem foto não usa a foto de outro carro", emprestada);
  await adm.screenshot({ path: path.join(SAIDA, "gerencia-1440.png"), fullPage: true });
  await adm.close();

  // o carro cadastrado chega ao site público
  const publico = await ctx.newPage();
  await publico.goto(BASE + "/estoque", { waitUntil: "networkidle" });
  await publico.waitForTimeout(900);
  const depois = await publico.locator("[data-carro]").count();
  checar(depois === 6, "o carro cadastrado aparece na página de estoque", "achei " + depois);
  checar(
    (await publico.evaluate(() => document.body.innerText)).includes("189.900"),
    "o preço cadastrado aparece formatado no estoque",
  );
  await publico.close();
  await ctx.close();
}

/* --------------------------------------------------------- diga o que procura */

/**
 * O formulário de interesse.
 *
 * A regra que ele tem que cumprir: nenhum formulário pode fingir que enviou. A
 * loja não tem servidor, então este aqui monta uma mensagem, mostra ela inteira
 * antes de mandar, e o botão abre o WhatsApp com o texto pronto.
 *
 * O teste confere o que o briefing pede de um formulário: que todo campo
 * preenchido chegue ao destino. Digitar e o valor não aparecer na mensagem é um
 * defeito que passa despercebido, porque a tela continua bonita.
 */
async function procura(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 } });
  const { pagina, erros } = await abrir(ctx, "/procuro");
  await rolarTudo(pagina);
  checar(erros.length === 0, "a página de procura não tem erro de console", erros.join(" | "));
  checar((await pagina.locator("h1").count()) === 1, "a página de procura tem um h1");

  const presasProcura = await pagina.evaluate(() =>
    [...document.querySelectorAll("[data-revela], .mascara")]
      .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9)
      .map((e) => e.textContent.trim().slice(0, 30)),
  );
  checar(
    presasProcura.length === 0,
    "nenhuma revelação presa em /procuro",
    presasProcura.slice(0, 3).join(" | "),
  );

  // Nada é obrigatório: o botão já funciona com o formulário em branco.
  const vazio = await pagina.locator("[data-cta='procuro']").getAttribute("href");
  checar(
    !!vazio && vazio.includes("wa.me/"),
    "com o formulário em branco o botão já abre uma conversa",
    vazio ?? "",
  );
  const semNada = await pagina.locator("[data-previa]").innerText();
  checar(
    semNada.length > 20,
    "com o formulário em branco a mensagem ainda faz sentido",
    semNada,
  );
  checar(
    (await pagina.locator("form [required]").count()) === 0,
    "nenhum campo do formulário é obrigatório",
  );

  // Preenche e confere que TUDO chega na mensagem e no link.
  const campos = pagina.locator("form input[type='text'], form textarea");
  await campos.nth(0).fill("Marcus");
  await campos.nth(1).fill("Uma picape para trabalho");
  await campos.nth(2).fill("2019");
  await campos.nth(3).fill("Corolla 2015 com 90 mil km");
  await pagina.locator("form select").nth(0).selectOption("RAM");
  await pagina.locator("form select").nth(1).selectOption("De 120 a 200 mil");
  await pagina.waitForTimeout(300);

  const previa = await pagina.locator("[data-previa]").innerText();
  const href = await pagina.locator("[data-cta='procuro']").getAttribute("href");
  const noLink = decodeURIComponent((href ?? "").split("text=")[1] ?? "");

  for (const [rotulo, valor] of [
    ["nome", "Marcus"],
    ["o que procura", "picape para trabalho"],
    ["ano", "2019"],
    ["troca", "Corolla 2015"],
    ["marca", "RAM"],
    ["faixa de preço", "120 a 200 mil"],
  ]) {
    checar(previa.includes(valor), `a prévia mostra ${rotulo}`, previa.split(String.fromCharCode(10)).join(" | "));
    checar(noLink.includes(valor), `o link do WhatsApp leva ${rotulo}`, noLink.split(String.fromCharCode(10)).join(" | "));
  }

  checar(
    (href ?? "").includes("wa.me/5571983402324"),
    "o formulário aponta para o número da loja",
    href ?? "",
  );

  // Campo em branco não vira linha vazia na mensagem.
  checar(
    !/:\s*$/m.test(previa) && !previa.includes("não informado"),
    "campo em branco não vira linha vazia na mensagem",
    previa.split(String.fromCharCode(10)).join(" | "),
  );

  await pagina.screenshot({ path: path.join(SAIDA, "procuro-1440.png"), fullPage: true });
  await pagina.close();
  await ctx.close();
}

/* ------------------------------------------------------- a porta da gerência */

/**
 * A senha da gerência.
 *
 * Testa a porta pelos dois lados: sem credencial tem que dar 401, com a
 * credencial errada também, e só a certa entra. Se algum dia alguém trocar a
 * conferência para o lado do cliente, o primeiro caso passa a devolver 200 e
 * este teste reprova.
 */
async function porta(navegador) {
  const semSenha = await navegador.newContext();
  const p1 = await semSenha.newPage();
  const r1 = await p1.goto(BASE + "/admin", { waitUntil: "domcontentloaded" });
  checar(r1.status() === 401, "sem senha a gerência devolve 401", "deu " + r1.status());
  const corpo = await p1.evaluate(() => document.body.innerText).catch(() => "");
  checar(
    !/cadastrar no estoque/i.test(corpo),
    "sem senha a tela de gerência não aparece",
  );
  // A senha não pode estar no pacote que vai para o navegador.
  const html = await (await fetch(BASE + "/admin")).text().catch(() => "");
  checar(
    !SENHA_ADMIN || !html.includes(SENHA_ADMIN),
    "a senha não aparece na resposta do servidor",
  );
  await semSenha.close();

  const errada = await navegador.newContext({
    httpCredentials: { username: "delux", password: SENHA_ADMIN + "x" },
  });
  const p2 = await errada.newPage();
  const r2 = await p2.goto(BASE + "/admin", { waitUntil: "domcontentloaded" });
  checar(r2.status() === 401, "senha errada devolve 401", "deu " + r2.status());
  await errada.close();

  const certa = await navegador.newContext({ httpCredentials: CREDENCIAL });
  const p3 = await certa.newPage();
  const r3 = await p3.goto(BASE + "/admin", { waitUntil: "networkidle" });
  checar(r3.status() === 200, "com a senha certa a gerência abre", "deu " + r3.status());
  checar(
    (await p3.getByRole("button", { name: /cadastrar no estoque/i }).count()) === 1,
    "com a senha certa o formulário está lá",
  );
  await certa.close();

  // O resto do site continua aberto: a porta é só da gerência.
  const publico = await navegador.newContext();
  const p4 = await publico.newPage();
  for (const rota of ["/", "/estoque"]) {
    const r = await p4.goto(BASE + rota, { waitUntil: "domcontentloaded" });
    checar(r.status() === 200, `${rota} continua aberto sem senha`, "deu " + r.status());
  }
  await publico.close();
}

/* -------------------------------------------------------------- retratos */

async function retratos(navegador) {
  for (const largura of [390, 1440, 1920]) {
    const ctx = await navegador.newContext({
      viewport: { width: largura, height: largura === 390 ? 844 : 900 },
    });
    const { pagina } = await abrir(ctx, "/");
    await pagina.waitForTimeout(3400);

    for (const id of SECOES) {
      const alvo = pagina.locator(`#${id}`);
      if ((await alvo.count()) === 0) continue;
      await alvo.scrollIntoViewIfNeeded();
      await pagina.waitForTimeout(800);
      await pagina.screenshot({ path: path.join(SAIDA, `s-${id}-${largura}.png`) });

      if (largura === 1920) {
        // Layout desenhado em 1440 vira objeto pequeno boiando em 1920, e isso
        // não aparece em teste de estouro.
        const ocupa = await pagina.evaluate((sec) => {
          const raiz = document.getElementById(sec);
          const casca = raiz.querySelector(".casca") ?? raiz;
          const limite = casca.getBoundingClientRect();
          if (!limite.width) return 1;
          let esq = Infinity;
          let dir = -Infinity;
          for (const el of raiz.querySelectorAll("*")) {
            const temTexto = [...el.childNodes].some(
              (n) => n.nodeType === 3 && n.textContent.trim(),
            );
            const ehMidia = ["IMG", "IFRAME", "CANVAS"].includes(el.tagName);
            if (!temTexto && !ehMidia) continue;
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) continue;
            if (getComputedStyle(el).visibility === "hidden") continue;
            esq = Math.min(esq, r.left);
            dir = Math.max(dir, r.right);
          }
          return isFinite(esq) ? (dir - esq) / limite.width : 0;
        }, id);
        checar(
          ocupa >= 0.7,
          `a seção ${id} usa a largura em 1920`,
          `ocupa ${(ocupa * 100).toFixed(0)}%`,
        );
      }
    }
    await pagina.close();
    await ctx.close();
  }
}

/* --------------------------------------------------------------------- ir */

async function main() {
  await mkdir(SAIDA, { recursive: true });
  const manifesto = JSON.parse(
    await readFile(path.resolve("public/images/manifest.json"), "utf8"),
  );

  const navegador = await chromium.launch();
  try {
    await estruturais(navegador, manifesto);
    await copy(navegador);
    await conversao(navegador);
    await abertura(navegador);
    await procura(navegador);
    await porta(navegador);
    await estoqueEGerencia(navegador);
    await retratos(navegador);
  } finally {
    await navegador.close();
  }

  await writeFile(
    path.join(SAIDA, "resultado.txt"),
    [`passou: ${passou.length}`, `falhou: ${falhas.length}`, "", ...falhas.map((f) => `FALHA  ${f}`)].join("\n"),
  );

  console.log(`\n  passou ${passou.length}   falhou ${falhas.length}\n`);
  for (const f of falhas) console.log(`  FALHA  ${f}`);
  console.log(`\n  telas em ${SAIDA}\n`);
  if (falhas.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
