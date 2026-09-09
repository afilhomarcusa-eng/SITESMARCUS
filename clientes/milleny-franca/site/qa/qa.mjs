/**
 * Portao de QA. Roda contra o build de producao, num navegador de verdade.
 *
 *   node qa/qa.mjs          checagens + capturas
 *   node qa/qa.mjs --rapido so as checagens, sem capturas
 *
 * Duas regras que este arquivo respeita e que custaram caro em outros sites:
 *
 *  1. Cobertura da cortina se mede com elementFromPoint, nao perguntando se o
 *     elemento existe. Existir ele existe: a pergunta e quem esta por cima
 *     naquela coordenada, naquele milissegundo.
 *
 *  2. Captura de tela congela o compositor. Por isso a sessao que mede tempo
 *     e outra, e ela nao tira foto nenhuma. Os tempos sao calculados contra um
 *     marco tomado no inicio, nunca somando intervalos.
 */
import { chromium, devices } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.QA_BASE ?? "http://127.0.0.1:3210";
const CAPTURAS = path.resolve("qa/capturas");
const RAPIDO = process.argv.includes("--rapido");

const LARGURAS = [360, 390, 430, 768, 1024, 1280, 1440, 1920];
const WHATS = "5579998314942";

/** CTA por seletor, um por um. Um link certo em algum lugar da pagina nao prova nada. */
const CTAS = [
  { seletor: '[data-cta="cabecalho"]', onde: "cabeçalho" },
  { seletor: '[data-cta="hero"]', onde: "hero" },
  { seletor: '[data-cta="como-comeca"]', onde: "como começa" },
  { seletor: '[data-cta="formulario"]', onde: "formulário" },
  { seletor: '[data-cta="fecho"]', onde: "fecho" },
];

/** Unicos links para o endpoint de conversa que podem existir fora da lista acima. */
const EXCECOES_WA = [];

let ok = 0;
const falhas = [];
/** Erros que vem de dentro de embed de terceiro. Ficam visiveis no fim, sem reprovar. */
const terceiros = new Set();

function checa(nome, condicao, detalhe = "") {
  if (condicao) {
    ok++;
  } else {
    falhas.push(`${nome}${detalhe ? ` :: ${detalhe}` : ""}`);
  }
}

const dorme = (ms) => new Promise((r) => setTimeout(r, ms));

/** Desliga a rolagem suave: senao o elemento ainda esta andando quando o
 *  Playwright toca nele, e o que falha e a medicao. */
const semRolagemSuave = (pag) =>
  pag.addStyleTag({ content: "html{scroll-behavior:auto !important}" });

// =====================================================================

const navegador = await chromium.launch();
await mkdir(CAPTURAS, { recursive: true });

const manifesto = JSON.parse(
  await readFile("public/img/manifesto.json", "utf8"),
);
/** arquivo -> largura NATIVA da fonte. E contra ela que se compara, nunca
 *  contra a largura exportada: um pipeline que amplia gera um arquivo grande
 *  e passaria feliz numa checagem contra o export. */
const nativaPorArquivo = new Map(
  manifesto.map((m) => [m.arquivo, m.recorteLargura]),
);

// ---------------------------------------------------------------------
// 1. Estrutural, copy, imagens e conversao, em cada largura
// ---------------------------------------------------------------------
for (const largura of LARGURAS) {
  const ctx = await navegador.newContext({
    viewport: { width: largura, height: 900 },
    deviceScaleFactor: 1,
    locale: "pt-BR",
  });
  const pag = await ctx.newPage();

  const errosConsole = [];
  const errosDeTerceiros = [];
  const respostasRuins = [];
  /** O embed do Google joga erro dentro do iframe dele. Isso nao e defeito
   *  deste site e nao esta ao nosso alcance consertar, entao fica registrado
   *  a parte em vez de reprovar o portao. O que reprova e erro nosso. */
  const nosso = (texto, url) => {
    const alvo = `${url ?? ""} ${texto}`;
    return !/gstatic\.com|googleapis\.com|google\.com\/maps/.test(alvo);
  };
  pag.on("console", (m) => {
    if (m.type() !== "error") return;
    const url = m.location()?.url;
    (nosso(m.text(), url) ? errosConsole : errosDeTerceiros).push(m.text());
  });
  pag.on("pageerror", (e) => {
    const t = String(e);
    (nosso(t, "") ? errosConsole : errosDeTerceiros).push(t);
  });
  pag.on("response", (r) => {
    const u = new URL(r.url());
    if (u.origin === new URL(BASE).origin && r.status() >= 400) {
      respostasRuins.push(`${r.status()} ${u.pathname}`);
    }
  });

  await pag.goto(BASE, { waitUntil: "networkidle" });
  // deixa a cortina sair antes de medir layout
  await pag.evaluate(() => document.documentElement.setAttribute("data-abertura", "nao"));
  await dorme(150);

  const L = `${largura}px`;

  // --- sem estouro horizontal ---
  const estouro = await pag.evaluate(() => {
    const d = document.documentElement;
    const largos = [];
    document.querySelectorAll("body *").forEach((e) => {
      const r = e.getBoundingClientRect();
      let dentroDeRolagem = false;
      for (let a = e.parentElement; a; a = a.parentElement) {
        if (getComputedStyle(a).overflowX === "auto" || getComputedStyle(a).overflowX === "scroll") {
          dentroDeRolagem = true; break;
        }
      }
      if (!dentroDeRolagem && r.width > 0 && r.right > d.clientWidth + 1.5) {
        largos.push(`${e.tagName}.${(e.className || "").toString().split(" ")[0]} right=${Math.round(r.right)}`);
      }
    });
    return {
      scroll: d.scrollWidth,
      cliente: d.clientWidth,
      culpados: largos.slice(0, 4),
    };
  });
  checa(
    `sem estouro horizontal em ${L}`,
    estouro.scroll <= estouro.cliente + 1,
    `scrollWidth=${estouro.scroll} clientWidth=${estouro.cliente} ${estouro.culpados.join(" | ")}`,
  );

  // --- um h1 so ---
  const h1 = await pag.locator("h1").count();
  checa(`exatamente um h1 em ${L}`, h1 === 1, `achei ${h1}`);

  // --- imagens carregadas e nao ampliadas ---
  const imgs = await pag.evaluate(() => {
    return [...document.querySelectorAll("img")].map((i) => ({
      src: i.currentSrc || i.src,
      completa: i.complete,
      natural: i.naturalWidth,
      pintada: Math.round(i.getBoundingClientRect().width),
      lazy: i.loading === "lazy",
    }));
  });
  for (const im of imgs) {
    const nome = im.src.replace(BASE, "");
    if (!im.lazy) {
      checa(
        `imagem carregada em ${L}: ${nome}`,
        im.completa && im.natural > 0,
        `completa=${im.completa} natural=${im.natural}`,
      );
    }
    // A LEI: nunca desenhada mais larga que o recorte nativo que a alimenta.
    const nativa = nativaPorArquivo.get(nome);
    if (nativa && im.pintada > 0) {
      checa(
        `imagem nao ampliada em ${L}: ${nome}`,
        im.pintada * 2 <= nativa || im.pintada <= nativa,
        `pintada ${im.pintada}px, recorte nativo ${nativa}px`,
      );
    }
  }

  // --- nenhuma foto repetida na pagina ---
  const arquivos = imgs.map((i) => i.src.replace(/-\d+\.(avif|webp|jpg|png)$/, ""));
  const repetida = arquivos.find((a, i) => a && arquivos.indexOf(a) !== i);
  checa(`nenhuma foto repetida em ${L}`, !repetida, `${repetida}`);

  // --- copy ---
  const texto = await pag.evaluate(() => document.body.innerText);
  checa(`sem travessao nem en dash em ${L}`, !/[—–]/.test(texto),
    (texto.match(/.{0,40}[—–].{0,40}/) || [""])[0]);
  checa(`sem placeholder em ${L}`,
    !/lorem ipsum|seu texto aqui|placehold|00000-0000|Rua Exemplo/i.test(texto));
  checa(`sem ingles solto em ${L}`,
    !/\b(Book now|Read more|Discover|Learn more|Get started|Contact us)\b/i.test(texto));

  const html = await pag.content();
  checa(`sem unicode decorativo com cara de emoji em ${L}`,
    !/[↗↘↙↖✨❌⭐‼⁉]/.test(html));

  const duplicada = texto.match(/\b(\p{L}{4,})\s+\1\b/iu);
  checa(`sem palavra duplicada em ${L}`, !duplicada, duplicada?.[0]);

  // --- conversao: cada CTA, um por um, por seletor ---
  for (const cta of CTAS) {
    const el = pag.locator(cta.seletor);
    const n = await el.count();
    checa(`CTA existe (${cta.onde}) em ${L}`, n === 1, `achei ${n}`);
    if (n === 1) {
      const href = await el.getAttribute("href");
      checa(`CTA aponta pro WhatsApp certo (${cta.onde}) em ${L}`,
        href?.startsWith(`https://wa.me/${WHATS}`), href ?? "sem href");
      const rel = await el.getAttribute("rel");
      checa(`CTA com rel=noopener (${cta.onde}) em ${L}`,
        (rel ?? "").includes("noopener"), rel ?? "sem rel");
      // digito por digito
      const digitos = (href ?? "").match(/wa\.me\/(\d+)/)?.[1] ?? "";
      checa(`CTA com 13 digitos (${cta.onde}) em ${L}`,
        digitos.length === 13 && digitos.startsWith("55") && digitos[4] === "9",
        `${digitos} tem ${digitos.length}`);
    }
  }

  // --- varredura: nenhum link pro WhatsApp fora da lista ---
  const fugas = await pag.evaluate(
    ({ permitidos, extras }) => {
      const todos = [...document.querySelectorAll('a[href*="wa.me"]')];
      const listados = new Set();
      [...permitidos, ...extras].forEach((s) =>
        document.querySelectorAll(s).forEach((e) => listados.add(e)),
      );
      return todos
        .filter((a) => !listados.has(a))
        .map((a) => `${a.tagName}.${a.className} "${a.textContent.trim().slice(0, 30)}"`);
    },
    { permitidos: CTAS.map((c) => c.seletor), extras: EXCECOES_WA },
  );
  checa(`nenhum link solto pro WhatsApp em ${L}`, fugas.length === 0, fugas.join(" | "));

  // --- todo target=_blank com noopener ---
  const semNoopener = await pag.evaluate(() =>
    [...document.querySelectorAll('a[target="_blank"]')]
      .filter((a) => !(a.rel || "").includes("noopener"))
      .map((a) => a.href),
  );
  checa(`todo _blank com noopener em ${L}`, semNoopener.length === 0, semNoopener.join(" | "));

  // --- toda ancora interna resolve ---
  const ancorasMortas = await pag.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && h !== "#" && !document.querySelector(h)),
  );
  checa(`toda ancora interna resolve em ${L}`, ancorasMortas.length === 0,
    ancorasMortas.join(" | "));

  // --- nenhum elemento de revelacao fica escondido depois de rolar tudo ---
  await pag.evaluate(async () => {
    const alt = document.body.scrollHeight;
    for (let y = 0; y < alt; y += 300) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    // segura no fim: o IntersectionObserver entrega o callback de forma
    // assincrona, e voltar pro topo antes disso mede o quadro errado.
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
  });
  await dorme(500);
  const escondidos = await pag.evaluate(() =>
    [...document.querySelectorAll(".revela")]
      .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.95)
      .map((e) => e.className),
  );
  checa(`nada de .revela fica escondido em ${L}`, escondidos.length === 0,
    escondidos.join(" | "));

  checa(`sem erro nosso no console em ${L}`, errosConsole.length === 0,
    errosConsole.slice(0, 2).join(" | "));
  if (errosDeTerceiros.length) {
    terceiros.add(`${L}: ${errosDeTerceiros[0].slice(0, 80)}`);
  }
  checa(`sem resposta 4xx/5xx propria em ${L}`, respostasRuins.length === 0,
    respostasRuins.slice(0, 3).join(" | "));

  await ctx.close();
}

// ---------------------------------------------------------------------
// 2. Formulario: campos descobertos, nao listados
// ---------------------------------------------------------------------
{
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: "pt-BR" });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: "networkidle" });
  await pag.evaluate(() => document.documentElement.setAttribute("data-abertura", "nao"));

  // nenhum campo obrigatorio
  const obrigatorios = await pag.evaluate(() =>
    [...document.querySelectorAll(".contato-forma [required]")].map((e) => e.id || e.name),
  );
  checa("nenhum campo obrigatorio no formulario", obrigatorios.length === 0, obrigatorios.join(" | "));

  // nenhum campo pede dado de saude
  const rotulos = await pag.evaluate(() =>
    [...document.querySelectorAll(".contato-forma label, .contato-forma legend")].map((e) => e.textContent),
  );
  checa("formulario nao pergunta dado sensivel",
    !rotulos.some((r) => /sintoma|diagn|medica|laudo|doen|transtorno|problema/i.test(r)),
    rotulos.join(" | "));

  // com tudo vazio, a mensagem ja faz sentido
  const vazio = await pag.locator('[data-cta="formulario"]').getAttribute("href");
  checa("mensagem faz sentido com o formulario vazio",
    decodeURIComponent(vazio ?? "").includes("horários para atendimento"),
    vazio ?? "");

  // descobre os campos presentes e exige todos de volta no destino
  const campos = await pag.evaluate(() =>
    [...document.querySelectorAll('.contato-forma input[type="text"]')].map((e) => e.id),
  );
  checa("achei campos de texto no formulario", campos.length > 0, `${campos.length}`);

  const marcas = {};
  for (const id of campos) {
    const marca = `zz${Math.random().toString(36).slice(2, 8)}zz`;
    marcas[id] = marca;
    await pag.fill(`#${id}`, marca);
  }
  // e as opcoes de radio tambem
  const radios = await pag.locator('.contato-forma input[type="radio"]').count();
  if (radios > 0) await pag.locator('.contato-forma input[type="radio"]').first().check();

  await dorme(120);
  const destino = decodeURIComponent(
    (await pag.locator('[data-cta="formulario"]').getAttribute("href")) ?? "",
  );
  for (const [id, marca] of Object.entries(marcas)) {
    checa(`campo ${id} chega no destino`, destino.includes(marca), destino.slice(0, 160));
  }
  if (radios > 0) {
    const escolhido = await pag.locator('.contato-forma input[type="radio"]:checked').inputValue();
    checa("periodo escolhido chega no destino",
      destino.toLowerCase().includes(escolhido.toLowerCase()), destino.slice(0, 160));
  }

  // nenhum form finge que envia
  const formsFalsos = await pag.evaluate(() =>
    [...document.querySelectorAll("form")].filter((f) => !f.action || f.action === location.href).length,
  );
  checa("nenhum formulario finge enviar", formsFalsos === 0, `${formsFalsos}`);

  await ctx.close();
}

// ---------------------------------------------------------------------
// 3. Menu do celular e teclado
// ---------------------------------------------------------------------
try {
  const ctx = await navegador.newContext({ ...devices["iPhone 13"], locale: "pt-BR" });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: "networkidle" });
  await pag.evaluate(() => document.documentElement.setAttribute("data-abertura", "nao"));
  await semRolagemSuave(pag);

  // AGENDAR alcancavel num toque: visivel sem abrir menu nenhum
  const agendar = pag.locator('[data-cta="cabecalho"]');
  checa("AGENDAR visivel no celular sem abrir o menu", await agendar.isVisible());
  const caixa = await agendar.boundingBox();
  checa("AGENDAR esta dentro da primeira tela no celular",
    caixa !== null && caixa.y + caixa.height <= 900, JSON.stringify(caixa));

  // menu abre e fecha
  await pag.click(".botao-menu");
  await dorme(300);
  checa("menu do celular abre", await pag.locator("#menu-celular a").first().isVisible());
  await pag.keyboard.press("Escape");
  await dorme(300);
  checa("Escape fecha o menu", !(await pag.locator("#menu-celular a").first().isVisible()));

  // FAQ funciona no toque, sem hover
  await pag.locator(".cartao-botao").nth(2).tap();
  await dorme(300);
  const aberta = await pag.locator(".cartao").nth(2).getAttribute("class");
  checa("FAQ abre no toque", (aberta ?? "").includes("cartao-aberto"), aberta ?? "");

  // roadmap sem estouro em 390
  const estouroCel = await pag.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
  );
  checa("sem estouro horizontal no celular depois de interagir", estouroCel);

  await ctx.close();
} catch (e) {
  checa("bloco do celular roda ate o fim", false, String(e).slice(0, 120));
}

// FAQ pelo teclado
{
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: "pt-BR" });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: "networkidle" });
  await pag.evaluate(() => document.documentElement.setAttribute("data-abertura", "nao"));

  await semRolagemSuave(pag);
  const btn = pag.locator(".cartao-botao").nth(3);
  await btn.focus();
  await pag.keyboard.press("Enter");
  await dorme(280);
  checa("FAQ abre pelo teclado", (await btn.getAttribute("aria-expanded")) === "true");

  // as abas do atendimento andam com as setas
  const guia = pag.locator(".guia").first();
  await guia.focus();
  await pag.keyboard.press("ArrowRight");
  await dorme(220);
  checa("abas do atendimento andam com a seta",
    (await pag.locator(".guia").nth(1).getAttribute("aria-selected")) === "true");

  await ctx.close();
}

// ---------------------------------------------------------------------
// 4. A abertura. Cobertura medida, nao presumida.
//    Sessao sem captura nenhuma: foto congela o compositor.
// ---------------------------------------------------------------------
{
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, locale: "pt-BR" });
  const pag = await ctx.newPage();
  const marco = Date.now();
  await pag.goto(BASE, { waitUntil: "domcontentloaded" });

  // grade de pontos, incluindo a faixa do cabecalho, que foi exatamente
  // por onde a pagina vazou em outro projeto
  const grade = [];
  for (const x of [40, 360, 720, 1080, 1400]) {
    for (const y of [12, 30, 60, 200, 450, 700, 880]) grade.push([x, y]);
  }

  const medeCobertura = () =>
    pag.evaluate((pontos) => {
      const cortina = document.getElementById("cortina");
      if (!cortina) return { total: pontos.length, cobertos: 0, sem: ["sem cortina no DOM"] };
      let cobertos = 0;
      const sem = [];
      for (const [x, y] of pontos) {
        const e = document.elementFromPoint(x, y);
        if (e && (e === cortina || cortina.contains(e))) cobertos++;
        else sem.push(`${x},${y} -> ${e ? e.tagName + "." + (e.className || "") : "nada"}`);
      }
      return { total: pontos.length, cobertos, sem: sem.slice(0, 4) };
    }, grade);

  // Espera calculada contra o marco, nunca somando intervalos.
  for (const alvo of [120, 500, 1000, 1400, 1650]) {
    const falta = alvo - (Date.now() - marco);
    if (falta > 0) await dorme(falta);
    const c = await medeCobertura();
    checa(
      `cortina cobre a tela inteira em ${alvo}ms (1440px)`,
      c.cobertos === c.total,
      `${c.cobertos}/${c.total} ${c.sem.join(" | ")}`,
    );
  }

  // O CTA principal esta opaco e clicavel durante a abertura inteira,
  // inclusive no instante em que a cortina comeca a levantar.
  for (const alvo of [300, 1750, 2100, 2600]) {
    const falta = alvo - (Date.now() - marco);
    if (falta > 0) await dorme(falta);
    const estado = await pag.evaluate(() => {
      const a = document.querySelector('[data-cta="hero"]');
      if (!a) return null;
      const cs = getComputedStyle(a);
      const r = a.getBoundingClientRect();
      return { opacidade: parseFloat(cs.opacity), largura: r.width, visivel: cs.visibility };
    });
    checa(
      `CTA do hero opaco e com area em ${alvo}ms`,
      estado !== null && estado.opacidade === 1 && estado.largura > 0 && estado.visivel === "visible",
      JSON.stringify(estado),
    );
  }

  // a cortina saiu de vez
  await dorme(Math.max(0, 3200 - (Date.now() - marco)));
  const saiu = await pag.evaluate(() => {
    const c = document.getElementById("cortina");
    if (!c) return true;
    return getComputedStyle(c).visibility === "hidden";
  });
  checa("cortina saiu depois de 3,2s", saiu);

  const clicavel = await pag.evaluate(() => {
    const e = document.elementFromPoint(200, 400);
    const c = document.getElementById("cortina");
    return !c || !(e === c || c.contains(e));
  });
  checa("depois da abertura a pagina volta a receber clique", clicavel);

  await ctx.close();
}

// cobertura tambem em 390
{
  const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 }, locale: "pt-BR" });
  const pag = await ctx.newPage();
  const marco = Date.now();
  await pag.goto(BASE, { waitUntil: "domcontentloaded" });
  const grade = [];
  for (const x of [15, 120, 250, 375]) for (const y of [10, 28, 55, 300, 600, 820]) grade.push([x, y]);

  for (const alvo of [150, 800, 1500]) {
    const falta = alvo - (Date.now() - marco);
    if (falta > 0) await dorme(falta);
    const c = await pag.evaluate((pontos) => {
      const cortina = document.getElementById("cortina");
      if (!cortina) return { total: pontos.length, cobertos: 0, sem: ["sem cortina"] };
      let cobertos = 0; const sem = [];
      for (const [x, y] of pontos) {
        const e = document.elementFromPoint(x, y);
        if (e && (e === cortina || cortina.contains(e))) cobertos++;
        else sem.push(`${x},${y}`);
      }
      return { total: pontos.length, cobertos, sem };
    }, grade);
    checa(`cortina cobre a tela inteira em ${alvo}ms (390px)`, c.cobertos === c.total,
      `${c.cobertos}/${c.total} ${c.sem.join(" | ")}`);
  }
  await ctx.close();
}

// ---------------------------------------------------------------------
// 5. A abertura sem JavaScript, sem bundle e com movimento reduzido
// ---------------------------------------------------------------------
{
  // bundles da propria pagina bloqueados: a cortina tem que sair do mesmo jeito
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: "pt-BR" });
  const pag = await ctx.newPage();
  // so o JavaScript. A folha de estilo tambem mora em chunks/, e bloquear
  // ela nao testaria nada: sem CSS a cortina nao sumiria de todo jeito.
  await pag.route("**/_next/static/chunks/**/*.js", (r) => r.abort());
  await pag.route("**/_next/static/chunks/*.js", (r) => r.abort());
  await pag.goto(BASE, { waitUntil: "domcontentloaded" });
  await dorme(3400);
  const estado = await pag.evaluate(() => {
    const c = document.getElementById("cortina");
    const h1 = document.querySelector("h1");
    return {
      cortinaSumiu: !c || getComputedStyle(c).visibility === "hidden",
      h1Visivel: !!h1 && h1.getBoundingClientRect().height > 0 &&
        parseFloat(getComputedStyle(h1).opacity) > 0.9,
      ctaVisivel: !!document.querySelector('[data-cta="hero"]'),
    };
  });
  checa("com os bundles bloqueados a cortina sai", estado.cortinaSumiu);
  checa("com os bundles bloqueados o h1 aparece", estado.h1Visivel);
  checa("com os bundles bloqueados o CTA existe", estado.ctaVisivel);
  await ctx.close();
}

{
  // JavaScript desligado de vez
  const ctx = await navegador.newContext({
    viewport: { width: 1280, height: 900 }, javaScriptEnabled: false, locale: "pt-BR",
  });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: "load" });
  await dorme(3400);
  const semJS = await pag.evaluate === undefined ? null : await pag.locator("h1").first().isVisible();
  checa("com JS desligado o h1 aparece", semJS === true);
  const textoSemJS = await pag.locator("body").innerText();
  checa("com JS desligado o conteudo principal esta la",
    textoSemJS.includes("Milleny França") && textoSemJS.includes("Agendar"));
  await ctx.close();
}

{
  // movimento reduzido: sem abertura, e tudo legivel
  const ctx = await navegador.newContext({
    viewport: { width: 1280, height: 900 }, reducedMotion: "reduce", locale: "pt-BR",
  });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: "domcontentloaded" });
  await dorme(250);
  const r = await pag.evaluate(() => {
    const c = document.getElementById("cortina");
    return {
      semCortina: !c || getComputedStyle(c).display === "none",
      titulos: [...document.querySelectorAll("h1, h2")].every(
        (h) => parseFloat(getComputedStyle(h).opacity) > 0.9,
      ),
    };
  });
  checa("com movimento reduzido a abertura nao aparece", r.semCortina);
  checa("com movimento reduzido todos os titulos ficam visiveis", r.titulos);
  await ctx.close();
}

{
  // uma vez por sessao
  const ctx = await navegador.newContext({ viewport: { width: 1280, height: 900 }, locale: "pt-BR" });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: "domcontentloaded" });
  await dorme(3300);
  await pag.reload({ waitUntil: "domcontentloaded" });
  await dorme(150);
  const naSegunda = await pag.evaluate(() => {
    const c = document.getElementById("cortina");
    return !c || getComputedStyle(c).display === "none";
  });
  checa("a abertura nao repete no reload", naSegunda);
  await ctx.close();
}

// ---------------------------------------------------------------------
// 6. Nenhum texto coberto por camada nenhuma, em nenhum ponto do scroll
// ---------------------------------------------------------------------
for (const largura of [390, 1440, 1920]) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, locale: "pt-BR" });
  const pag = await ctx.newPage();
  await pag.goto(BASE, { waitUntil: "networkidle" });
  await pag.evaluate(() => document.documentElement.setAttribute("data-abertura", "nao"));
  await dorme(200);

  const cobertos = await pag.evaluate(async () => {
    const ruins = [];
    const alt = document.body.scrollHeight;
    for (let y = 0; y < alt; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
      const titulos = [...document.querySelectorAll("h1, h2, h3, p")];
      for (const t of titulos) {
        const r = t.getBoundingClientRect();
        if (r.width < 10 || r.height < 8) continue;
        if (r.top < 90 || r.bottom > window.innerHeight - 10) continue;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const e = document.elementFromPoint(cx, cy);
        if (e && e !== t && !t.contains(e) && !e.contains(t)) {
          ruins.push(`${t.tagName} "${t.textContent.trim().slice(0, 26)}" tapado por ${e.tagName}.${(e.className || "").toString().split(" ")[0]}`);
        }
      }
    }
    return [...new Set(ruins)].slice(0, 5);
  });
  checa(`nenhum texto coberto ao rolar em ${largura}px`, cobertos.length === 0, cobertos.join(" | "));
  await ctx.close();
}

// ---------------------------------------------------------------------
// 7. Capturas, para olhar. Sessao separada, e no fim.
// ---------------------------------------------------------------------
if (!RAPIDO) {
  const secoes = ["topo", "sobre-mim", "atendimento", "como-comeca", "duvidas", "contato", "agendar"];
  for (const largura of [390, 1440, 1920]) {
    const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 }, locale: "pt-BR" });
    const pag = await ctx.newPage();
    await pag.goto(BASE, { waitUntil: "networkidle" });
    await pag.evaluate(() => document.documentElement.setAttribute("data-abertura", "nao"));
    await dorme(300);
    await pag.evaluate(async () => {
      const alt = document.body.scrollHeight;
      for (let y = 0; y < alt; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await dorme(700);
    for (const s of secoes) {
      const el = pag.locator(`#${s}`);
      if ((await el.count()) === 0) continue;
      await el.scrollIntoViewIfNeeded();
      await dorme(450);
      await pag.screenshot({ path: path.join(CAPTURAS, `${largura}-${s}.png`) });
    }
    await ctx.close();
  }

  // a abertura, quadro a quadro, em sessao propria e descartavel
  for (const t of [200, 700, 1200, 1750, 2000, 2300, 2700]) {
    const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, locale: "pt-BR" });
    const pag = await ctx.newPage();
    const marco = Date.now();
    await pag.goto(BASE, { waitUntil: "domcontentloaded" });
    const falta = t - (Date.now() - marco);
    if (falta > 0) await dorme(falta);
    await pag.screenshot({ path: path.join(CAPTURAS, `abertura-${String(t).padStart(4, "0")}ms.png`) });
    await ctx.close();
  }
}

// =====================================================================
await navegador.close();

const total = ok + falhas.length;
await writeFile(
  path.join(CAPTURAS, "resultado.json"),
  JSON.stringify({ total, ok, falhas }, null, 2),
);

console.log(`\n${ok}/${total} checagens passaram.`);
if (falhas.length) {
  console.log(`\n${falhas.length} FALHA(S):`);
  falhas.forEach((f) => console.log("  x " + f));
  process.exit(1);
}
console.log("Capturas em qa/capturas. Olhe elas, nao so o placar.");
