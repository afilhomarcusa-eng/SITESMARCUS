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
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  for (const rota of ["/", "/estoque", "/admin"]) {
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

  // Quanto tempo até a loja estar na tela.
  //
  // A abertura segura a pintura do maior elemento, então ela é o LCP na
  // prática. Sem este teste a sequência cresce de novo sem ninguém notar: já
  // esteve em 4,2s e em 2,9s, as duas reprovando o alvo.
  const pTempo = await ctx.newPage();
  const t0 = Date.now();
  await pTempo.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await pTempo
    .locator("[data-foto-loja]")
    .evaluate(
      (e) =>
        new Promise((ok) => {
          const ver = () =>
            parseFloat(getComputedStyle(e).opacity) >= 0.95
              ? ok(true)
              : requestAnimationFrame(ver);
          ver();
        }),
      undefined,
      { timeout: 12000 },
    )
    .catch(() => {});
  const ateAparecer = Date.now() - t0;
  checar(
    ateAparecer <= 2500,
    "a loja aparece em até 2,5s na primeira visita",
    `levou ${ateAparecer}ms`,
  );
  await pTempo.close();

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
    const foto = document.querySelector("[data-foto-loja]");
    const op = (e) => (e ? parseFloat(getComputedStyle(e).opacity) : -1);
    return { h1: op(h1), cta: op(cta?.parentElement?.parentElement ?? cta), foto: op(foto) };
  });
  checar(
    heroiSem3d.h1 >= 0.99,
    "sem WebGL o título do herói aparece",
    `opacidade ${heroiSem3d.h1}`,
  );
  checar(
    heroiSem3d.foto >= 0.99,
    "sem WebGL a foto da loja aparece",
    `opacidade ${heroiSem3d.foto}`,
  );
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
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 } });

  // ---------------------------------------------------------- estado vazio
  const { pagina, erros } = await abrir(ctx, "/estoque");
  await rolarTudo(pagina);
  checar(erros.length === 0, "o estoque não tem erro de console", erros.join(" | "));

  // Faltava conferir isto fora da home, e a captura entregou: o fecho de
  // /estoque aparecia em branco porque a revelação nunca tinha disparado.
  const presas = await pagina.evaluate(() =>
    [...document.querySelectorAll("[data-revela], .mascara")]
      .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9)
      .map((e) => e.textContent.trim().slice(0, 30)),
  );
  checar(
    presas.length === 0,
    "nenhuma revelação presa em /estoque",
    presas.slice(0, 3).join(" | "),
  );
  checar((await pagina.locator("h1").count()) === 1, "o estoque tem um h1");
  checar(
    (await pagina.locator("[data-carro]").count()) === 0,
    "sem estoque cadastrado, nenhum cartão de carro é inventado",
  );
  checar(
    await pagina.getByText("O jeito mais rápido é perguntar").isVisible(),
    "o estoque vazio explica o que fazer",
  );
  const ctaVazio = pagina.locator("[data-cta='vazio']");
  checar(
    (await ctaVazio.count()) === 1 &&
      ((await ctaVazio.getAttribute("href")) ?? "").includes("wa.me/"),
    "o estoque vazio oferece o WhatsApp",
  );
  for (const id of ["comprar", "vender", "consignar"]) {
    checar(
      (await pagina.locator(`[data-cta='vazio-${id}']`).count()) === 1,
      `o estoque vazio oferece a porta de ${id}`,
    );
  }
  await pagina.screenshot({ path: path.join(SAIDA, "estoque-vazio-1440.png"), fullPage: true });
  await pagina.close();

  // ------------------------------------------------------------- gerência
  const { pagina: adm } = await abrir(ctx, "/admin");
  for (const c of ["Marca", "Modelo", "Versão", "Ano", "Preço em reais"]) {
    checar((await adm.getByText(c, { exact: false }).count()) > 0, `a gerência tem o campo ${c}`);
  }
  checar(
    (await adm.locator("section ul li").count()) === 0,
    "a gerência começa sem nenhum carro",
  );

  await adm.locator("form input").nth(0).fill("Mercedes-Benz");
  await adm.locator("form input").nth(1).fill("C 180");
  await adm.locator("form input").nth(2).fill("Cabriolet");
  await adm.locator("form input").nth(3).fill("2018");
  const numeros = adm.locator("form input[type='number']");
  await numeros.nth(1).fill("62000");
  await numeros.nth(2).fill("189900");
  await adm.getByRole("button", { name: /cadastrar no estoque/i }).click();
  await adm.waitForTimeout(700);

  checar(
    (await adm.getByText("Mercedes-Benz C 180").count()) > 0,
    "cadastrar um carro grava e ele aparece na lista da gerência",
  );
  await adm.screenshot({ path: path.join(SAIDA, "gerencia-1440.png"), fullPage: true });

  // ------------------------------- o carro cadastrado chega ao site público
  const publico = await ctx.newPage();
  await publico.goto(BASE + "/estoque", { waitUntil: "networkidle" });
  await publico.waitForTimeout(900);
  await rolarTudo(publico);
  const cartoes = await publico.locator("[data-carro]").count();
  checar(cartoes === 1, "o carro cadastrado aparece na página de estoque", `achei ${cartoes}`);
  const texto = await publico.evaluate(() => document.body.innerText);
  checar(texto.includes("189.900"), "o preço cadastrado aparece formatado no estoque");
  checar(
    texto.includes("1 carro à venda") || texto.includes("1 carro"),
    "a contagem acompanha o cadastro",
  );

  // e o filtro passa a existir junto com o carro
  checar(
    (await publico.getByRole("button", { name: "Mercedes-Benz", exact: true }).count()) === 1,
    "a marca cadastrada vira filtro",
  );
  await publico.screenshot({ path: path.join(SAIDA, "estoque-com-carro-1440.png"), fullPage: true });
  await publico.close();
  await ctx.close();
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
