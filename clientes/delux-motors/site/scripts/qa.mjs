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

/**
 * A saída direta, e as que passam pelo formulário.
 *
 * Um botão só abre a conversa em branco: o do cabeçalho, escrito WHATSAPP. Ele
 * é a saída de quem não quer preencher nada, e foi mantido de propósito.
 *
 * Todos os outros levam ao formulário do serviço deles. A regra que existia
 * antes, de cada botão já carregar a mensagem certa para ninguém começar do
 * zero, não sumiu: ela mudou de lugar, e agora quem escreve a mensagem é o
 * formulário, com muito mais coisa dentro dela.
 */
const CTA_DIRETO = { sel: "[data-cta='cabecalho']", onde: "cabeçalho" };

const CTAS_FORMULARIO = [
  { sel: "[data-cta='heroi']", onde: "herói", destino: "/comprar" },
  { sel: "[data-cta='servico-comprar']", onde: "serviço comprar", destino: "/comprar" },
  { sel: "[data-cta='servico-vender']", onde: "serviço vender", destino: "/vender" },
  { sel: "[data-cta='servico-consignar']", onde: "serviço consignar", destino: "/consignar" },
  { sel: "[data-cta='estoque-whatsapp']", onde: "faixa de estoque", destino: "/comprar" },
  { sel: "[data-cta='final']", onde: "fecho", destino: "/comprar" },
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
  for (const rota of ["/", "/estoque", "/comprar", "/vender", "/consignar", "/admin"]) {
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

  // A saída direta.
  const direto = pagina.locator(CTA_DIRETO.sel).first();
  checar((await direto.count()) > 0, `existe o CTA do ${CTA_DIRETO.onde}`);
  if ((await direto.count()) > 0) {
    const href = await direto.getAttribute("href");
    checar(
      !!href && href.includes(`wa.me/${numero[1]}`),
      `CTA do ${CTA_DIRETO.onde} abre o WhatsApp no número completo`,
      href ?? "sem href",
    );
    checar(
      (await direto.getAttribute("target")) !== "_blank" ||
        ((await direto.getAttribute("rel")) ?? "").includes("noopener"),
      `CTA do ${CTA_DIRETO.onde} tem rel noopener`,
    );
  }

  // Os que passam pelo formulário, cada um no formulário do serviço dele.
  for (const { sel, onde, destino } of CTAS_FORMULARIO) {
    const el = pagina.locator(sel).first();
    checar((await el.count()) > 0, `existe o CTA do ${onde}`);
    if ((await el.count()) === 0) continue;
    const href = await el.getAttribute("href");
    checar(
      href === destino,
      `CTA do ${onde} leva ao formulário de ${destino}`,
      href ?? "sem href",
    );
  }

  // Cada formulário já chega escrito com o assunto dele. É a mesma regra de
  // antes, de ninguém começar uma conversa em branco tendo que explicar do
  // zero, agora cumprida pelo formulário em vez do link.
  const msgs = {};
  for (const id of ["comprar", "vender", "consignar"]) {
    const pf = await pagina.context().newPage();
    await pf.goto(BASE + "/" + id, { waitUntil: "networkidle" });
    msgs[id] = await pf.locator("[data-previa]").innerText();
    await pf.close();
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
  /* --------------------------- a cortina esta no HTML --------------------- */

  // O defeito relatado foi "o site abre antes da abertura", e ele sobreviveu a
  // duas correcoes porque o teste daqui media a coisa errada: perguntava se o
  // elemento do veu EXISTIA. Existia. Passava verde enquanto o problema estava
  // na tela do cliente.
  //
  // A causa era o veu nascer do React, depois da hidratacao, enquanto o HTML do
  // servidor ja tinha sido pintado sem ele. Entao o primeiro teste agora e
  // sobre o HTML cru, do jeito que o navegador recebe, antes de qualquer script
  // rodar.
  const cru = await (await fetch(BASE + "/")).text();
  checar(
    cru.includes('class="cortina"'),
    "a cortina vem pronta no HTML do servidor, sem depender de React",
  );
  const iScript = cru.indexOf("dataset.abrir");
  checar(
    iScript > -1 && iScript < cru.indexOf("<body"),
    "o script que decide a abertura e bloqueante e vem antes do body",
  );

  /* ------------------------------ ela cobre mesmo ------------------------- */

  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pAb = await ctx.newPage();
  const t0 = Date.now();
  await pAb.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await pAb.waitForTimeout(400);

  // Cobrir de verdade, medido ponto a ponto com elementFromPoint, inclusive em
  // cima do cabecalho: era por ali que o site vazava.
  const cobertura = await pAb.evaluate(() => {
    const c = document.querySelector(".cortina");
    if (!c) return { existe: false, vazou: ["a cortina nem esta na tela"], opacidadeFoto: -1 };
    const L = innerWidth;
    const A = innerHeight;
    const pontos = [
      ["canto superior esquerdo", 6, 6],
      ["faixa do cabecalho", L / 2, 30],
      ["botao de WhatsApp do cabecalho", L - 70, 30],
      ["centro da tela", L / 2, A / 2],
      ["pe da dobra", L / 2, A - 8],
      ["canto inferior direito", L - 6, A - 6],
    ];
    const foto = document.querySelector("[data-foto-carro]");
    return {
      existe: true,
      opacidadeFoto: foto ? parseFloat(getComputedStyle(foto).opacity) : -1,
      vazou: pontos
        .filter(([, x, y]) => {
          const el = document.elementFromPoint(x, y);
          return !(el && (el === c || c.contains(el)));
        })
        .map(([nome]) => nome),
    };
  });
  checar(cobertura.existe, "aos 400ms a cortina esta na tela");
  checar(
    cobertura.vazou.length === 0,
    "aos 400ms nenhum pedaco do site aparece por cima da cortina",
    "vazou em: " + cobertura.vazou.join(", "),
  );
  // A cena por baixo ja tem que estar pintada. Se alguem voltar a animar a
  // opacidade do conteudo, o LCP passa a medir o fim da abertura: ja mediu 4,2s
  // assim, e foi por isso que esta abertura precisou ser reescrita a primeira
  // vez.
  checar(
    cobertura.opacidadeFoto >= 0.99,
    "por baixo da cortina a foto do heroi ja esta pintada aos 400ms",
    "opacidade " + cobertura.opacidadeFoto,
  );

  /* ------------------------------- e ela termina -------------------------- */

  await pAb
    .waitForFunction(
      () => {
      const c = document.querySelector(".cortina");
      return !c || getComputedStyle(c).visibility === "hidden";
      },
      undefined,
      { timeout: 12000 },
    )
    .catch(() => {});
  const duracao = Date.now() - t0;
  checar(
    duracao >= 2000 && duracao <= 6000,
    "a abertura dura entre 2 e 6 segundos e termina",
    "levou " + duracao + "ms",
  );

  /* Quadros ao longo da abertura, para olhar e nao so contar.
   *
   * Numa PAGINA A PARTE, e essa separacao e o ponto.
   *
   * Tirar foto pausa a pintura, e animacao de CSS anda pelo relogio do
   * compositor: cada captura congela a cortina por algumas centenas de
   * milissegundos. Com seis fotos na mesma pagina em que eu media a duracao, a
   * abertura "levava" 6,6 segundos e o teste acusava um defeito que nao
   * existia. O instrumento estava mudando o que ele media.
   *
   * Entao quem posa e uma pagina, e quem e cronometrada e outra.
   *
   * O tempo tambem e sempre medido a partir do inicio, descontando o que falta:
   * somar esperas ignora o custo da captura, e o quadro marcado 1600ms saia
   * perto dos 2400ms. */
  const pFotos = await ctx.newPage();
  const tFoto = Date.now();
  await pFotos.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  for (const t of [400, 1200, 2000, 2400, 2800]) {
    const falta = t - (Date.now() - tFoto);
    if (falta > 0) await pFotos.waitForTimeout(falta);
    await pFotos.screenshot({ path: path.join(SAIDA, `abertura-${t}ms.png`) });
  }
  await pFotos.close();

  // Assim que ela sai, a acao principal tem que estar livre. Cortina que some
  // da vista mas deixa um retangulo invisivel comendo clique e pior do que
  // cortina nenhuma.
  await pAb.waitForTimeout(150);
  const ctaDepois = await pAb.evaluate(() => {
const alvo = document.querySelector("[data-cta='cabecalho']");
      if (!alvo) return null;
      const r = alvo.getBoundingClientRect();
      const e = getComputedStyle(alvo);
      const meio = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return {
        opacidade: parseFloat(e.opacity),
        visivel: e.visibility !== "hidden" && r.width > 0 && r.height > 0,
        noTopo: !!meio && (meio === alvo || alvo.contains(meio)),
      };
  });
  checar(!!ctaDepois, "o CTA do cabecalho existe depois da abertura");
  if (ctaDepois) {
    checar(ctaDepois.opacidade >= 0.99, "o CTA fica cheio depois da abertura");
    checar(ctaDepois.visivel, "o CTA fica visivel depois da abertura");
    checar(ctaDepois.noTopo, "depois da abertura nada invisivel sobra por cima do CTA");
  }
  await pAb.close();

  /* ------------------------------ e cobre no celular ---------------------- */

  // Mesma medicao a 390 de largura. A barra do celular tem o atalho de Estoque
  // e o botao de WhatsApp lado a lado no topo, entao e ali que um vazamento
  // apareceria primeiro para quem chega pelo Instagram, que e quase todo mundo.
  const ctxM = await navegador.newContext({ viewport: { width: 390, height: 844 } });
  const pM = await ctxM.newPage();
  const tM = Date.now();
  await pM.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await pM.waitForTimeout(400);
  const coberturaM = await pM.evaluate(() => {
    const c = document.querySelector(".cortina");
    if (!c) return { existe: false, vazou: ["a cortina nem esta na tela"] };
    const L = innerWidth;
    const A = innerHeight;
    const pontos = [
      ["topo a esquerda, a marca", 40, 30],
      ["atalho de Estoque", L / 2, 30],
      ["botao de WhatsApp", L - 40, 30],
      ["centro", L / 2, A / 2],
      ["pe da tela", L / 2, A - 6],
    ];
    return {
      existe: true,
      vazou: pontos
        .filter(([, x, y]) => {
          const el = document.elementFromPoint(x, y);
          return !(el && (el === c || c.contains(el)));
        })
        .map(([nome]) => nome),
    };
  });
  checar(coberturaM.existe, "no celular a cortina esta na tela aos 400ms");
  checar(
    coberturaM.vazou.length === 0,
    "no celular nada do site aparece por cima da cortina",
    "vazou em: " + coberturaM.vazou.join(", "),
  );
  await pM.screenshot({ path: path.join(SAIDA, "abertura-390-400ms.png") });
  await pM
    .waitForFunction(
      () => {
      const c = document.querySelector(".cortina");
      return !c || getComputedStyle(c).visibility === "hidden";
      },
      undefined,
      { timeout: 12000 },
    )
    .catch(() => {});
  checar(
    Date.now() - tM >= 2000 && Date.now() - tM <= 6000,
    "no celular a abertura tambem termina",
    "levou " + (Date.now() - tM) + "ms",
  );
  await pM.screenshot({ path: path.join(SAIDA, "abertura-390-fim.png") });
  await pM.close();
  await ctxM.close();

  /* --------------------------- o primeiro gesto pula ---------------------- */

  const pPula = await ctx.newPage();
  await pPula.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await pPula.waitForTimeout(350);
  await pPula.mouse.click(240, 420);
  await pPula.waitForTimeout(150);
  const depoisDoGesto = await pPula.evaluate(() => ({
    desligou: document.documentElement.dataset.abrir !== "1",
    cortinaFora: (() => {
      const c = document.querySelector(".cortina");
      return !c || getComputedStyle(c).display === "none";
    })(),
    cta: (() => {
const alvo = document.querySelector("[data-cta='cabecalho']");
      if (!alvo) return null;
      const r = alvo.getBoundingClientRect();
      const e = getComputedStyle(alvo);
      const meio = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return {
        opacidade: parseFloat(e.opacity),
        visivel: e.visibility !== "hidden" && r.width > 0 && r.height > 0,
        noTopo: !!meio && (meio === alvo || alvo.contains(meio)),
      };
    })(),
  }));
  checar(depoisDoGesto.desligou, "um gesto encerra a abertura na hora");
  checar(depoisDoGesto.cortinaFora, "depois do gesto a cortina sai da tela inteira");
  checar(
    depoisDoGesto.cta !== null && depoisDoGesto.cta.noTopo === true,
    "depois do gesto o CTA fica clicavel de imediato",
  );
  // O clique que pulou a abertura foi absorvido pela cortina. Se ele
  // atravessasse, quem toca a tela para pular abriria o WhatsApp sem querer.
  checar(
    pPula.url().replace(/\/$/, "") === BASE.replace(/\/$/, ""),
    "o clique que pula a abertura nao dispara nada por baixo",
    pPula.url(),
  );
  await pPula.close();

  /* ---------------------- ela nao depende do JavaScript ------------------- */

  // O teste que fecha a porta pela qual este defeito entrou tres vezes.
  //
  // Derruba os pacotes da pagina: o script bloqueante do head ainda roda e liga
  // a cortina, mas o React nunca hidrata. Se a saida dela dependesse de
  // JavaScript, o site inteiro ficaria preso atras de uma tela preta, sem erro
  // nenhum aparecendo. Quem tira a cortina e o CSS, entao ela sai assim mesmo.
  const ctxQ = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pQ = await ctxQ.newPage();
  // So o JavaScript. O filtro precisa terminar em .js: no Turbopack a folha
  // de estilo tambem mora em chunks/, e derrubar ela junto testaria outra
  // coisa, uma pagina sem CSS nenhum, que nao e o cenario aqui.
  await pQ.route("**/_next/static/chunks/**.js", (rota) => rota.abort());
  const tQ = Date.now();
  await pQ.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await pQ
    .waitForFunction(
      () => {
      const c = document.querySelector(".cortina");
      return !c || getComputedStyle(c).visibility === "hidden";
      },
      undefined,
      { timeout: 12000 },
    )
    .catch(() => {});
  const duracaoQ = Date.now() - tQ;
  checar(
    duracaoQ <= 6000,
    "com os pacotes da pagina derrubados a cortina sai do mesmo jeito",
    "levou " + duracaoQ + "ms",
  );
  await pQ.close();
  await ctxQ.close();

  /* ------------------------------ uma vez por sessao ---------------------- */

  const p2 = await ctx.newPage();
  await p2.goto(BASE + "/", { waitUntil: "networkidle" });
  await p2.waitForTimeout(300);
  checar(
    (await p2.evaluate(() => sessionStorage.getItem("dlx:abriu"))) === "1",
    "a abertura se marca como vista na sessao",
  );
  await p2.reload({ waitUntil: "domcontentloaded" });
  await p2.waitForTimeout(200);
  const segundaVisita = await p2.evaluate(() => {
    const c = document.querySelector(".cortina");
    return {
      ligada: document.documentElement.dataset.abrir === "1",
      display: c ? getComputedStyle(c).display : "ausente",
    };
  });
  checar(!segundaVisita.ligada, "a abertura nao repete ao recarregar");
  // Desligada, a cortina nao ocupa nada. E o mesmo caminho de quem chega sem
  // JavaScript: sem o script, sem data-abrir, sem cortina.
  checar(
    segundaVisita.display === "none",
    "com a abertura desligada a cortina nao existe na tela",
    "display " + segundaVisita.display,
  );
  const h1Opac = await p2
    .locator("h1 .display")
    .first()
    .evaluate((e) => getComputedStyle(e).opacity);
  checar(
    parseFloat(h1Opac) >= 0.99,
    "na segunda visita o heroi ja aparece pronto",
    "opacidade " + h1Opac,
  );
  // Em /estoque a abertura nunca roda: quem entra ali quer ver carro.
  const pE = await ctx.newPage();
  await pE.goto(BASE + "/estoque", { waitUntil: "domcontentloaded" });
  checar(
    (await pE.evaluate(() => document.querySelector(".cortina") === null)) === true,
    "a abertura nao aparece no estoque",
  );
  await pE.close();
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
      cortinaPresa: (() => {
        const c = document.querySelector(".cortina");
        return !!c && getComputedStyle(c).visibility !== "hidden";
      })(),
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
  checar(!heroiSem3d.cortinaPresa, "sem WebGL a cortina sai do mesmo jeito");

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
/** Um carro real do estoque, para os testes que precisam de uma ficha. */
const CARRO_TESTE = "ram-laramie-1500-classic-2022";

async function procura(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 } });

  for (const rota of ["/comprar", "/vender", "/consignar"]) {
    const { pagina, erros } = await abrir(ctx, rota);
    await rolarTudo(pagina);
    checar(erros.length === 0, `sem erro de console em ${rota}`, erros.join(" | "));
    checar((await pagina.locator("h1").count()) === 1, `${rota} tem um h1 so`);

    const presas = await pagina.evaluate(() =>
      [...document.querySelectorAll("[data-revela], .mascara")]
        .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9)
        .map((e) => e.textContent.trim().slice(0, 30)),
    );
    checar(presas.length === 0, `nenhuma revelacao presa em ${rota}`, presas.slice(0, 3).join(" | "));

    // Nada obrigatorio. O cliente pediu isso em voz alta, e alem disso e o que
    // faz o formulario ser respondido: quem nao sabe a quilometragem de cabeca
    // nao pode ficar travado por causa dela.
    checar(
      (await pagina.locator("form [required]").count()) === 0,
      `nenhum campo obrigatorio em ${rota}`,
    );
    const vazio = await pagina.locator("[data-cta='formulario']").getAttribute("href");
    checar(
      !!vazio && vazio.includes("wa.me/5571983402324"),
      `em branco, ${rota} ja abre a conversa no numero da loja`,
      vazio ?? "",
    );
    const semNada = await pagina.locator("[data-previa]").innerText();
    checar(semNada.length > 20, `em branco, a mensagem de ${rota} ainda faz sentido`, semNada);

    /* Preenche TODOS os campos, sem lista fixa.
     *
     * O teste antigo conferia seis valores escolhidos a mao. Campo novo entrava
     * no formulario sem ninguem conferir se ele chegava ao WhatsApp, que e
     * justamente o defeito silencioso: a tela continua bonita e a informacao
     * some no caminho. Aqui ele varre o que existe na pagina, marca cada campo
     * com um valor unico, e cobra todos de volta. */
    const marcas = [];

    const nTexto = await pagina.locator("form input[type='text']").count();
    for (let i = 0; i < nTexto; i++) {
      const m = `Campo${i}Zqx`;
      await pagina.locator("form input[type='text']").nth(i).fill(m);
      marcas.push(["texto " + i, m]);
    }

    const nArea = await pagina.locator("form textarea").count();
    for (let i = 0; i < nArea; i++) {
      const m = `Texto${i}Zqx`;
      await pagina.locator("form textarea").nth(i).fill(m);
      marcas.push(["area " + i, m]);
    }

    const nSel = await pagina.locator("form select").count();
    for (let i = 0; i < nSel; i++) {
      const sel = pagina.locator("form select").nth(i);
      const valores = await sel.locator("option").evaluateAll((os) =>
        os.map((o) => o.value).filter((v) => v !== ""),
      );
      checar(valores.length > 0, `a lista ${i} de ${rota} tem opcao de verdade`);
      const escolha = valores[valores.length - 1];
      await sel.selectOption(escolha);
      marcas.push(["lista " + i, escolha]);
    }

    checar(marcas.length >= 6, `${rota} tem campos suficientes para valer a pena`, String(marcas.length));
    await pagina.waitForTimeout(320);

    const previa = await pagina.locator("[data-previa]").innerText();
    const href = await pagina.locator("[data-cta='formulario']").getAttribute("href");
    const noLink = decodeURIComponent((href ?? "").split("text=")[1] ?? "");
    const umaLinha = (t) => t.split(String.fromCharCode(10)).join(" | ");

    for (const [qual, valor] of marcas) {
      checar(previa.includes(valor), `${rota}: a previa mostra ${qual}`, umaLinha(previa));
      checar(noLink.includes(valor), `${rota}: o link do WhatsApp leva ${qual}`, umaLinha(noLink));
    }

    checar(
      (href ?? "").includes("wa.me/5571983402324"),
      `${rota} aponta para o numero da loja`,
      href ?? "",
    );

    // Campo em branco nao vira linha vazia. Esvazia um e o rotulo dele tem que
    // sumir junto, em vez de sobrar um "Cor:" sozinho no fim da mensagem.
    await pagina.locator("form input[type='text']").nth(nTexto - 1).fill("");
    await pagina.waitForTimeout(250);
    const depois = await pagina.locator("[data-previa]").innerText();
    checar(
      !depois.includes(marcas[nTexto - 1][1]),
      `${rota}: campo esvaziado sai da mensagem`,
      umaLinha(depois),
    );
    checar(
      !/:\s*$/m.test(depois) && !depois.includes("nao informado") && !depois.includes("não informado"),
      `${rota}: campo em branco nao vira linha vazia`,
      umaLinha(depois),
    );

    await pagina.screenshot({
      path: path.join(SAIDA, `formulario${rota.replace("/", "-")}-1440.png`),
      fullPage: true,
    });
    await pagina.close();
  }

  /* ------------------------- trocar de servico pelas abas ----------------- */

  const pAba = await ctx.newPage();
  await pAba.goto(BASE + "/comprar", { waitUntil: "networkidle" });
  for (const id of ["vender", "consignar", "comprar"]) {
    await pAba.locator(`[data-aba='${id}']`).click();
    await pAba.waitForURL(`**/${id}`, { timeout: 8000 }).catch(() => {});
    checar(
      new URL(pAba.url()).pathname === `/${id}`,
      `a aba ${id} leva ao formulario de ${id}`,
      pAba.url(),
    );
  }
  await pAba.close();

  /* ------------------- o carro chega escrito, vindo da ficha -------------- */

  const pCarro = await ctx.newPage();
  await pCarro.goto(BASE + "/estoque/" + CARRO_TESTE, { waitUntil: "networkidle" });
  const destino = await pCarro.locator("[data-cta='carro']").getAttribute("href");
  checar(
    (destino ?? "").startsWith("/comprar?carro="),
    "o botao da ficha leva ao formulario, com o carro no endereco",
    destino ?? "",
  );
  await pCarro.locator("[data-cta='carro']").click();
  await pCarro.waitForURL("**/comprar**", { timeout: 8000 }).catch(() => {});
  await pCarro.waitForTimeout(300);
  const jaEscrito = await pCarro.locator("[data-previa]").innerText();
  checar(
    jaEscrito.includes("Laramie"),
    "o carro da ficha ja chega escrito na mensagem",
    jaEscrito.split(String.fromCharCode(10)).join(" | "),
  );
  await pCarro.close();

  // Endereco antigo continua chegando em algum lugar. Ele ja pode ter sido
  // mandado para alguem no WhatsApp.
  const pVelho = await ctx.newPage();
  const resposta = await pVelho.goto(BASE + "/procuro", { waitUntil: "domcontentloaded" });
  checar(
    new URL(pVelho.url()).pathname === "/comprar" && (resposta?.status() ?? 0) < 400,
    "o endereco antigo /procuro cai no formulario de compra",
    pVelho.url(),
  );
  await pVelho.close();

  await ctx.close();
}

/* ------------------------------------ o mapa ----------------------------- */

/**
 * O mapa fica nas cores do Google, sem filtro.
 *
 * Ele ja esteve dessaturado para combinar com o preto e branco do resto do
 * site, e o cliente pediu para tirar. Faz sentido: mapa e ferramenta antes de
 * ser composicao. Verde de praca, azul de mar e amarelo de avenida sao as cores
 * que a pessoa ja sabe ler sem pensar, e tingir isso custa orientacao para
 * ganhar harmonia.
 *
 * O teste existe porque um filtro volta facil, numa passada de deixar tudo
 * coerente, e ninguem repara ate alguem tentar se achar no mapa.
 */
async function mapaSemFiltro(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + "/", { waitUntil: "domcontentloaded" });

  const mapa = pagina.locator("iframe[src*='google.com/maps']");
  checar((await mapa.count()) === 1, "existe um mapa na pagina");
  if ((await mapa.count()) === 1) {
    const filtro = await mapa.evaluate((e) => getComputedStyle(e).filter);
    checar(filtro === "none", "o mapa esta nas cores do Google, sem filtro por cima", filtro);
    const doPai = await mapa.evaluate((e) => getComputedStyle(e.parentElement).filter);
    checar(doPai === "none", "o quadro do mapa tambem nao tem filtro", doPai);
  }

  await pagina.close();
  await ctx.close();
}

/* ---------------------------- para onde vao os botoes --------------------- */

/**
 * Todo botao de WhatsApp leva ao formulario, menos um.
 *
 * O cliente foi exato: qualquer botao de WhatsApp abre o formulario, com uma
 * excecao, o do canto superior direito escrito WHATSAPP. Essa excecao e a saida
 * direta de quem so quer falar e nao quer preencher nada, e por isso ela nao
 * pode ser perdida numa mudanca futura sem alguem perceber.
 *
 * O teste varre as paginas e olha para todo link que aponta para o wa.me. Se
 * aparecer um que nao seja o do cabecalho nem o botao de envio do proprio
 * formulario, ele falha e diz qual e.
 */
async function paraOndeVaoOsBotoes(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 } });
  const permitidos = new Set(["cabecalho", "formulario"]);

  for (const rota of [
    "/",
    "/estoque",
    "/estoque/" + CARRO_TESTE,
    "/comprar",
    "/vender",
    "/consignar",
  ]) {
    const pagina = await ctx.newPage();
    await pagina.goto(BASE + rota, { waitUntil: "networkidle" });

    const diretos = await pagina.evaluate(() =>
      [...document.querySelectorAll("a[href*='wa.me']")].map((a) => ({
        cta: a.dataset.cta ?? "(sem marca)",
        texto: (a.textContent ?? "").trim().slice(0, 40),
      })),
    );

    const fora = diretos.filter((d) => !permitidos.has(d.cta));
    checar(
      fora.length === 0,
      `em ${rota}, so o cabecalho e o envio do formulario vao direto ao WhatsApp`,
      fora.map((f) => `${f.cta} (${f.texto})`).join(", "),
    );
    checar(
      diretos.some((d) => d.cta === "cabecalho"),
      `o botao WHATSAPP do cabecalho continua abrindo a conversa em ${rota}`,
    );

    // E os outros botoes tem que ir para algum formulario de verdade.
    const chamadas = await pagina.evaluate(() =>
      [...document.querySelectorAll("a[data-cta]")]
        .filter((a) => !["cabecalho", "formulario"].includes(a.dataset.cta ?? ""))
        .map((a) => ({ cta: a.dataset.cta, href: a.getAttribute("href") ?? "" })),
    );
    const quebradas = chamadas.filter(
      (c) =>
        !/^\/(comprar|vender|consignar|estoque)/.test(c.href) &&
        !c.href.startsWith("/#") &&
        !c.href.startsWith("http") &&
        !c.href.startsWith("tel:"),
    );
    checar(
      quebradas.length === 0,
      `em ${rota} nenhum botao aponta para lugar nenhum`,
      quebradas.map((q) => `${q.cta} -> ${q.href}`).join(", "),
    );

    await pagina.close();
  }

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
    await paraOndeVaoOsBotoes(navegador);
    await mapaSemFiltro(navegador);
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
