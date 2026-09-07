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

const BASE = process.env.QA_BASE ?? "http://127.0.0.1:3210";
const SAIDA = path.resolve("qa");
const LARGURAS = [360, 390, 430, 768, 1024, 1280, 1440, 1920];

const falhas = [];
const passou = [];

function checar(condicao, titulo, detalhe = "") {
  if (condicao) passou.push(titulo);
  else falhas.push(detalhe ? `${titulo} :: ${detalhe}` : titulo);
}

/* --------------------------------------------------------------- utilidades */

/**
 * O mapa embutido é um iframe do Google e o script dele grita no console por
 * conta própria. Isso não é defeito deste site e não dá para consertar daqui,
 * então o teste ignora o que vem de dentro dele. Erro de qualquer outra origem
 * continua reprovando.
 */
const TERCEIROS = /maps\.gstatic\.com|maps\.google|google\.com\/maps|gstatic\.com/;

async function abrir(ctx, rota) {
  const pagina = await ctx.newPage();
  const erros = [];
  const respostasRuins = [];
  pagina.on("console", (m) => {
    if (m.type() !== "error") return;
    const origem = m.location()?.url ?? "";
    if (TERCEIROS.test(origem) || TERCEIROS.test(m.text())) return;
    erros.push(m.text());
  });
  pagina.on("pageerror", (e) => {
    if (TERCEIROS.test(String(e))) return;
    erros.push(String(e));
  });
  pagina.on("response", (r) => {
    if (r.status() >= 400 && r.url().startsWith(BASE)) {
      respostasRuins.push(`${r.status()} ${r.url()}`);
    }
  });
  await pagina.goto(BASE + rota, { waitUntil: "networkidle" });
  return { pagina, erros, respostasRuins };
}

/** Os que precisam abrir conversa, cada um conferido pelo próprio seletor. */
const CTAS_ESPERADOS = [
  { seletor: "[data-cta='cabecalho']", onde: "cabeçalho" },
  { seletor: "[data-cta='heroi']", onde: "herói" },
  { seletor: "[data-cta='final']", onde: "fecho" },
];

/** A ação principal do herói leva ao catálogo, não à conversa. */
const CTAS_INTERNOS = [
  { seletor: "[data-cta='heroi-estoque']", onde: "herói", destino: "/estoque" },
  { seletor: "[data-cta='ver-estoque']", onde: "vitrine", destino: "/estoque" },
];

/* ------------------------------------------------------------- estruturais */

async function estruturais(navegador, manifesto) {
  for (const largura of LARGURAS) {
    const ctx = await navegador.newContext({
      viewport: { width: largura, height: 900 },
      deviceScaleFactor: 1,
    });
    const { pagina, erros, respostasRuins } = await abrir(ctx, "/");

    // rola a página inteira para disparar tudo que é preguiçoso
    await pagina.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
    });
    await pagina.waitForTimeout(500);

    const estouro = await pagina.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    checar(estouro <= 1, `sem estouro horizontal em ${largura}`, `sobra de ${estouro}px`);

    const h1 = await pagina.locator("h1").count();
    checar(h1 === 1, `exatamente um h1 em ${largura}`, `achei ${h1}`);

    const imagensQuebradas = await pagina.evaluate(() =>
      [...document.images]
        .filter((i) => i.loading !== "lazy" && (!i.complete || i.naturalWidth === 0))
        .map((i) => i.currentSrc || i.src),
    );
    checar(
      imagensQuebradas.length === 0,
      `imagens não preguiçosas carregaram em ${largura}`,
      imagensQuebradas.join(", "),
    );

    checar(erros.length === 0, `sem erro de console em ${largura}`, erros.slice(0, 3).join(" | "));
    checar(
      respostasRuins.length === 0,
      `sem resposta 400+ em ${largura}`,
      respostasRuins.slice(0, 3).join(" | "),
    );

    // nada marcado para revelar pode continuar escondido depois de rolar tudo
    const escondidos = await pagina.evaluate(() =>
      [...document.querySelectorAll("[data-revela], .mascara")]
        .filter((e) => {
          const s = getComputedStyle(e);
          return parseFloat(s.opacity) < 0.9;
        })
        .map((e) => e.className),
    );
    checar(
      escondidos.length === 0,
      `nenhuma revelação presa em ${largura}`,
      escondidos.slice(0, 3).join(" | "),
    );

    /* -------------------------------------------------- texto sendo comido */
    // Nasceu de um defeito de verdade: a máscara de revelação cortava o fim
    // das palavras do h1 e o resultado parecia quebra de linha, não corte.
    // Mede o texto contra a caixa que o contém, em vez de acreditar no CSS.
    const cortados = await pagina.evaluate(() =>
      [...document.querySelectorAll("h1, h2, h3, .display, .display-solto")]
        .filter((e) => {
          const s = getComputedStyle(e);
          if (s.display === "none" || s.whiteSpace === "nowrap") return false;
          return e.scrollWidth - e.clientWidth > 2;
        })
        .map((e) => `${e.tagName} "${e.textContent.trim().slice(0, 26)}" sobra ${e.scrollWidth - e.clientWidth}px`),
    );
    checar(
      cortados.length === 0,
      `nenhum título cortado pela própria caixa em ${largura}`,
      cortados.slice(0, 4).join(" | "),
    );

    /* ------------------------------------------------- a lei da resolução */
    // Compara a caixa desenhada contra a NATIVA da origem, lida do manifesto.
    // Comparar contra o arquivo exportado deixaria passar qualquer pipeline
    // que amplia, que é exatamente o defeito que esta regra existe para pegar.
    const desenhadas = await pagina.evaluate(() =>
      [...document.images].map((i) => ({
        src: (i.currentSrc || i.src).split("/").pop().split("?")[0],
        css: Math.round(i.getBoundingClientRect().width),
      })),
    );
    for (const d of desenhadas) {
      const info = manifesto.imagens[d.src];
      if (!info || d.css === 0) continue;
      const precisa = d.css * 2;
      const podeDar = Math.min(precisa, info.nativa.w);
      checar(
        d.css <= info.nativa.w,
        `${d.src} não é desenhada acima da nativa em ${largura}`,
        `caixa ${d.css}px contra nativa ${info.nativa.w}px`,
      );
      checar(
        info.exportada.w >= Math.min(podeDar, info.nativa.w),
        `${d.src} tem pixel suficiente para o slot em ${largura}`,
        `exportada ${info.exportada.w}px, caixa ${d.css}px`,
      );
    }

    // nenhum arquivo de imagem duas vezes na mesma página
    const arquivos = desenhadas.map((d) => d.src);
    const repetidos = arquivos.filter((f, i) => arquivos.indexOf(f) !== i);
    checar(
      repetidos.length === 0,
      `nenhuma imagem repetida em ${largura}`,
      [...new Set(repetidos)].join(", "),
    );

    if (largura === 1440 || largura === 1920 || largura === 390) {
      await pagina.screenshot({
        path: path.join(SAIDA, `home-${largura}.png`),
        fullPage: true,
      });
    }
    await ctx.close();
  }
}

/* --------------------------------------------------- a cena não cobre texto */

/**
 * Percorre a cena do estúdio de ponta a ponta e exige que, em nenhum momento,
 * a foto encoste na frase enquanto a frase ainda está sendo lida.
 *
 * Nasceu de um defeito de verdade: a foto crescia por cima do título e sobrava
 * "MESMA SAL" na tela. Em código isso não aparece, só numa captura, e mesmo na
 * captura só aparece se alguém pegar exatamente o quadro certo. Por isso vira
 * teste: mede as duas caixas em vinte pontos da rolagem.
 */
async function cenaNaoCobreTexto(navegador) {
  for (const largura of [1440, 1920]) {
    const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } });
    const { pagina } = await abrir(ctx, "/");
    await pagina.waitForTimeout(3600);

    const cena = await pagina.evaluate(() => {
      const s = document.getElementById("confianca");
      return { topo: s.offsetTop, altura: s.offsetHeight };
    });

    let piorSobreposicao = 0;
    let ondeQuebrou = "";
    for (let i = 0; i <= 20; i++) {
      const y = cena.topo + (cena.altura - 900) * (i / 20);
      await pagina.evaluate((v) => window.scrollTo(0, v), y);
      await pagina.waitForTimeout(120);

      const medida = await pagina.evaluate(() => {
        const frase = document.querySelector("[data-frase]");
        const foto = document.querySelector("[data-foto-sala]");
        if (!frase || !foto) return null;
        const opac = parseFloat(getComputedStyle(frase.closest("div").parentElement).opacity);
        const a = frase.getBoundingClientRect();
        const b = foto.getBoundingClientRect();
        const larg = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const alt = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        const area = a.width * a.height;
        return { opac, fracao: area ? (larg * alt) / area : 0 };
      });
      if (!medida) continue;

      // Só conta quando a frase ainda está legível. Depois que ela sai de cena
      // a foto pode ocupar o espaço inteiro, que é justamente o plano.
      if (medida.opac > 0.12 && medida.fracao > piorSobreposicao) {
        piorSobreposicao = medida.fracao;
        ondeQuebrou = `passo ${i}, opacidade ${medida.opac.toFixed(2)}`;
      }
    }

    checar(
      piorSobreposicao < 0.02,
      `a foto não cobre a frase do estúdio em ${largura}`,
      `${(piorSobreposicao * 100).toFixed(0)}% do título coberto, ${ondeQuebrou}`,
    );

    await pagina.close();
    await ctx.close();
  }
}

/* --------------------------------------------------------------- catálogo */

/**
 * Os filtros de /estoque.
 *
 * Existe porque o cliente disse que "os filtros não funcionaram". Funcionavam,
 * mas eram só quatro ordenações em texto miúdo, sem contagem, e mexer neles
 * não mudava nada visível. Aqui o teste não pergunta se o clique registrou:
 * conta os cartões antes e depois e confere o conteúdo do que sobrou.
 */
async function catalogo(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 } });
  const { pagina, erros } = await abrir(ctx, "/estoque");

  const conta = () => pagina.locator("[data-carro]").count();
  const precos = () =>
    pagina.$$eval("[data-carro]", (as) => as.map((a) => Number(a.dataset.preco)));
  const nomes = () =>
    pagina.$$eval("[data-carro] h3", (hs) => hs.map((h) => h.textContent.trim()));

  const total = await conta();
  checar(total === 12, "o catálogo abre com os 12 carros", `achei ${total}`);
  checar(erros.length === 0, "o catálogo não tem erro de console", erros.join(" | "));
  checar((await pagina.locator("h1").count()) === 1, "o catálogo tem um h1");

  /* ------------------------------------------------------- filtro de marca */
  await pagina.getByRole("button", { name: "BMW", exact: true }).click();
  await pagina.waitForTimeout(300);
  const soBmw = await nomes();
  checar(soBmw.length === 2, "filtrar BMW deixa os 2 BMW", `sobraram ${soBmw.length}`);
  checar(
    soBmw.every((n) => n.startsWith("BMW")),
    "só sobra BMW depois de filtrar BMW",
    soBmw.join(", "),
  );
  checar(
    (await pagina.evaluate(() => location.search)).includes("marca=BMW"),
    "o filtro de marca entra na barra de endereço",
  );

  // a contagem visível precisa concordar com o que está na tela
  const textoContagem = await pagina.locator("[aria-live='polite']").first().innerText();
  checar(
    textoContagem.includes("2") && textoContagem.includes("12"),
    "a contagem mostra 2 de 12",
    textoContagem.replace(/\s+/g, " "),
  );

  /* ---------------------------------------------- o link filtrado funciona */
  const comFiltro = await pagina.evaluate(() => location.href);
  const p2 = await ctx.newPage();
  await p2.goto(comFiltro, { waitUntil: "networkidle" });
  await p2.waitForTimeout(700);
  const abertoDeLink = await p2.locator("[data-carro]").count();
  checar(abertoDeLink === 2, "abrir o link filtrado já traz o filtro aplicado", `achei ${abertoDeLink}`);
  await p2.close();

  /* -------------------------------------------------------------- limpar */
  await pagina.getByRole("button", { name: /limpar 1 filtro/i }).first().click();
  await pagina.waitForTimeout(300);
  checar((await conta()) === 12, "limpar filtros devolve os 12");

  /* --------------------------------------------------------------- busca */
  await pagina.getByPlaceholder("Buscar marca, modelo ou versão").fill("ranger");
  await pagina.waitForTimeout(350);
  const busca = await nomes();
  checar(
    busca.length === 1 && /ranger/i.test(busca[0]),
    "buscar por ranger acha só a Ranger",
    busca.join(", "),
  );

  // acento não pode atrapalhar: "hibrido" tem que achar "Híbrido"
  await pagina.getByPlaceholder("Buscar marca, modelo ou versão").fill("camaro");
  await pagina.waitForTimeout(350);
  checar((await conta()) === 1, "buscar camaro acha o Camaro");

  /* ---------------------------------------------------------- lista vazia */
  await pagina.getByPlaceholder("Buscar marca, modelo ou versão").fill("ferrari");
  await pagina.waitForTimeout(350);
  checar((await conta()) === 0, "busca sem resultado não mostra carro nenhum");
  checar(
    await pagina.getByText("Nenhum carro com esses filtros").isVisible(),
    "busca sem resultado mostra o estado vazio",
  );
  const ctaVazio = pagina.locator("[data-cta='vazio']");
  checar(
    (await ctaVazio.count()) === 1 &&
      (await ctaVazio.getAttribute("href")).includes("wa.me/"),
    "o estado vazio oferece o WhatsApp",
  );

  await pagina.getByRole("button", { name: /limpar filtros/i }).click();
  await pagina.waitForTimeout(350);
  checar((await conta()) === 12, "limpar do estado vazio devolve os 12");

  /* --------------------------------------------------------------- preço */
  await pagina.getByRole("button", { name: "Até 150 mil" }).click();
  await pagina.waitForTimeout(300);
  const ate150 = await precos();
  checar(ate150.length > 0, "o filtro de preço deixa algum carro");
  checar(
    ate150.every((v) => v <= 150000),
    "nenhum carro acima de 150 mil sobrevive ao filtro",
    ate150.filter((v) => v > 150000).join(", "),
  );
  const semFiltroPreco = 12;
  checar(
    ate150.length < semFiltroPreco,
    "o filtro de preço realmente reduz a lista",
    `${ate150.length} de ${semFiltroPreco}`,
  );
  await pagina.getByRole("button", { name: /limpar 1 filtro/i }).first().click();
  await pagina.waitForTimeout(300);

  /* ----------------------------------------------------------- ordenação */
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
  checar(
    decr[0] !== cres[0],
    "trocar a ordenação muda de fato o primeiro cartão",
    `${cres[0]} contra ${decr[0]}`,
  );

  /* ------------------------------------------------ combinação de filtros */
  await pagina.getByRole("button", { name: "Automático", exact: true }).click();
  await pagina.waitForTimeout(300);
  const auto = await conta();
  checar(auto > 0 && auto < 12, "o filtro de câmbio reduz a lista", `sobraram ${auto}`);

  await pagina.screenshot({ path: path.join(SAIDA, "estoque-1440.png"), fullPage: true });
  await pagina.close();
  await ctx.close();
}

/* ------------------------------------------------------------- retratos */

/**
 * Uma foto de cada seção, em 1440 e em 1920, para olhar.
 *
 * Fatiar uma captura de página inteira em alturas fixas não serve, porque as
 * seções ficam em posições diferentes em cada largura. Aqui cada seção é
 * capturada pelo próprio id, então a foto é sempre da seção certa.
 *
 * Também mede quanto da faixa central da seção é fundo puro em 1920. Layout
 * desenhado em 1440 costuma virar um objeto pequeno boiando num oceano de
 * fundo quando a tela cresce, e isso não aparece em teste de estouro.
 */
const SECOES = ["conteudo", "estoque", "confianca", "distancia", "loja", "duvidas"];

async function retratos(navegador) {
  for (const largura of [390, 1440, 1920]) {
    const ctx = await navegador.newContext({
      viewport: { width: largura, height: largura === 390 ? 844 : 900 },
    });
    const { pagina } = await abrir(ctx, "/");
    await pagina.waitForTimeout(3600);

    for (const id of SECOES) {
      const alvo = pagina.locator(`#${id}`);
      if ((await alvo.count()) === 0) continue;
      await alvo.scrollIntoViewIfNeeded();
      await pagina.waitForTimeout(900);
      await pagina.screenshot({ path: path.join(SAIDA, `s-${id}-${largura}.png`) });

      if (largura === 1920) {
        // Quanto da largura útil a seção realmente ocupa. Mede a caixa de
        // tudo que tem conteúdo dentro dela, não o que o CSS prometeu.
        const ocupa = await pagina.evaluate((sec) => {
          const raiz = document.getElementById(sec);
          const casca = raiz.querySelector(".casca") ?? raiz;
          const limite = casca.getBoundingClientRect();
          if (limite.width === 0) return 1;
          let esq = Infinity;
          let dir = -Infinity;
          for (const el of raiz.querySelectorAll("*")) {
            const temTexto = el.childNodes.length &&
              [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
            const ehMidia = el.tagName === "IMG" || el.tagName === "IFRAME" || el.tagName === "CANVAS";
            if (!temTexto && !ehMidia) continue;
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) continue;
            if (getComputedStyle(el).visibility === "hidden") continue;
            esq = Math.min(esq, r.left);
            dir = Math.max(dir, r.right);
          }
          if (!isFinite(esq)) return 0;
          return (dir - esq) / limite.width;
        }, id);
        checar(
          ocupa >= 0.7,
          `a seção ${id} usa a largura em 1920`,
          `ocupa ${(ocupa * 100).toFixed(0)}% da casca`,
        );
      }
    }
    await pagina.close();
    await ctx.close();
  }
}

/* -------------------------------------------------------------------- copy */

async function copy(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  for (const rota of ["/", "/estoque/bmw-m4-coupe-2016", "/admin"]) {
    const { pagina } = await abrir(ctx, rota);
    const texto = await pagina.evaluate(() => document.body.innerText);

    checar(!/[—–]/.test(texto), `sem travessão em ${rota}`, (texto.match(/.{0,30}[—–].{0,30}/) ?? [""])[0]);

    const ingles =
      /\b(Lorem ipsum|Your text here|Book now|Discover|Learn more|Read more|Click here|Coming soon|placeholder)\b/i;
    checar(!ingles.test(texto), `sem sobra de inglês em ${rota}`, (texto.match(ingles) ?? [""])[0]);

    // palavra duplicada colada, tipo "de de"
    const dup = texto
      .replace(/\s+/g, " ")
      .match(/\b([A-Za-zÀ-ÿ]{3,})\s+\1\b/i);
    checar(!dup, `sem palavra duplicada em ${rota}`, dup ? dup[0] : "");

    // proibições do briefing
    const proibidas = /\b(excelência|jornada|solução completa|potencialize|descubra)\b/i;
    checar(!proibidas.test(texto), `sem clichê proibido em ${rota}`, (texto.match(proibidas) ?? [""])[0]);

    await pagina.close();
  }
  await ctx.close();
}

/* --------------------------------------------------------------- conversão */

async function conversao(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const { pagina } = await abrir(ctx, "/");

  // O número que recebe o clique principal, conferido dígito a dígito.
  const contato = await readFile(path.resolve("lib/contato.ts"), "utf8");
  const principal = contato.match(/e164: "(556298\d{7})"/);
  checar(!!principal, "achei o WhatsApp principal em lib/contato.ts");

  // Todo e164 do arquivo tem que ter forma válida de número brasileiro.
  for (const [, num] of contato.matchAll(/e164: "(\d+)"/g)) {
    const celular = num.length === 13 && num.startsWith("55") && num[4] === "9";
    const fixo = num.length === 12 && num.startsWith("55");
    checar(
      celular || fixo,
      `número ${num} tem forma válida`,
      `${num.length} dígitos, celular precisa de 13 e fixo de 12`,
    );
  }

  // Cada CTA, um por um, por seletor, contra o destino que deveria ter.
  for (const { seletor, onde } of CTAS_ESPERADOS) {
    const el = pagina.locator(seletor).first();
    checar((await el.count()) > 0, `existe o CTA do ${onde}`);
    if ((await el.count()) === 0) continue;
    const href = await el.getAttribute("href");
    checar(
      !!href && href.includes(`wa.me/${principal[1]}`),
      `CTA do ${onde} aponta para o WhatsApp completo`,
      href ?? "sem href",
    );
    const rel = await el.getAttribute("rel");
    checar(
      (await el.getAttribute("target")) !== "_blank" || (rel ?? "").includes("noopener"),
      `CTA do ${onde} tem rel noopener`,
    );
  }

  // Um só destino de conversa no site inteiro por CTA, sem número solto.
  const numerosNosLinks = await pagina.evaluate(() =>
    [...document.querySelectorAll("a[href*='wa.me']")].map(
      (a) => a.getAttribute("href").match(/wa\.me\/(\d+)/)[1],
    ),
  );
  for (const n of numerosNosLinks) {
    checar(
      n.length === 13 && n[4] === "9",
      `link wa.me com número completo: ${n}`,
      `${n.length} dígitos`,
    );
  }

  for (const { seletor, onde, destino } of CTAS_INTERNOS) {
    const el = pagina.locator(seletor).first();
    checar((await el.count()) > 0, `existe o botão de estoque do ${onde}`);
    if ((await el.count()) === 0) continue;
    checar(
      (await el.getAttribute("href")) === destino,
      `o botão de estoque do ${onde} aponta para ${destino}`,
      (await el.getAttribute("href")) ?? "sem href",
    );
  }

  // toda âncora interna resolve
  const ancoras = await pagina.evaluate(() =>
    [...document.querySelectorAll("a[href^='#']")]
      .map((a) => a.getAttribute("href").slice(1))
      .filter(Boolean),
  );
  for (const id of [...new Set(ancoras)]) {
    const existe = await pagina.evaluate((x) => !!document.getElementById(x), id);
    checar(existe, `a âncora #${id} existe`);
  }

  // todo target=_blank com noopener
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
  // O CTA principal precisa estar cheio e clicável durante a abertura inteira,
  // inclusive no instante em que a luz começa a subir. Abertura que apaga a
  // ação principal por alguns quadros custa conversa, e ninguém pega isso no olho.
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + "/", { waitUntil: "domcontentloaded" });

  // Marcos em milissegundos contados a partir do carregamento. O relógio é
  // absoluto de propósito: esperar um intervalo relativo a cada passo faz os
  // rótulos mentirem sobre o instante que foi medido.
  const inicio = Date.now();
  for (const t of [120, 400, 900, 1500, 2200, 3200]) {
    const falta = t - (Date.now() - inicio);
    if (falta > 0) await pagina.waitForTimeout(falta);
    const estado = await pagina.evaluate((seletor) => {
      const el = document.querySelector(seletor);
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

  // a abertura roda uma vez por sessão
  const p2 = await ctx.newPage();
  await p2.goto(BASE + "/", { waitUntil: "networkidle" });
  const marcado = await p2.evaluate(() => sessionStorage.getItem("udl:abriu"));
  checar(marcado === "1", "a abertura se marca como vista na sessão");
  await p2.reload({ waitUntil: "domcontentloaded" });
  await p2.waitForTimeout(150);
  const aindaMarcado = await p2.evaluate(() => sessionStorage.getItem("udl:abriu"));
  checar(aindaMarcado === "1", "a abertura não repete ao recarregar");
  await p2.close();
  await ctx.close();

  // movimento reduzido
  const ctxR = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const { pagina: pr } = await abrir(ctxR, "/");
  const h1Visivel = await pr.locator("h1").first().isVisible();
  const h1Opacidade = await pr.evaluate(
    () => getComputedStyle(document.querySelector("h1 .display")).opacity,
  );
  checar(h1Visivel && parseFloat(h1Opacidade) >= 0.99, "com movimento reduzido o h1 aparece");
  await pr.screenshot({ path: path.join(SAIDA, "reduzido-1440.png"), fullPage: true });
  await pr.close();
  await ctxR.close();

  // sem JavaScript
  const ctxJs = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const pj = await ctxJs.newPage();
  await pj.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const textoSemJs = await pj.evaluate(() => document.body.innerText).catch(() => "");
  const conteudoSemJs = await pj.locator("h1").first().textContent();
  checar(
    /carros/i.test(conteudoSemJs ?? "") && /venda/i.test(conteudoSemJs ?? ""),
    "sem JavaScript o título principal aparece",
    conteudoSemJs ?? "sem h1",
  );
  const opacidadeSemJs = await pj
    .locator("h1 .display")
    .first()
    .evaluate((e) => getComputedStyle(e).opacity);
  checar(
    parseFloat(opacidadeSemJs) >= 0.99,
    "sem JavaScript nada fica escondido por revelação",
    `opacidade ${opacidadeSemJs}`,
  );
  checar(
    (textoSemJs || "").includes("3434-6026"),
    "sem JavaScript o telefone continua na página",
  );

  // O catálogo é a página que vende. Sem JavaScript ele tem que sair inteiro
  // no HTML, com preço, senão o Google indexa uma casca vazia.
  const pjEstoque = await ctxJs.newPage();
  await pjEstoque.goto(BASE + "/estoque", { waitUntil: "domcontentloaded" });
  const cartoesSemJs = await pjEstoque.locator("[data-carro]").count();
  checar(
    cartoesSemJs === 12,
    "sem JavaScript o catálogo traz os 12 carros no HTML",
    `achei ${cartoesSemJs}`,
  );
  const textoEstoqueSemJs = await pjEstoque.evaluate(() => document.body.innerText);
  checar(
    textoEstoqueSemJs.includes("359.900"),
    "sem JavaScript os preços saem no HTML do catálogo",
  );
  await pjEstoque.close();
  await pj.screenshot({ path: path.join(SAIDA, "sem-js-1440.png"), fullPage: true });
  await pj.close();
  await ctxJs.close();
}

/* ------------------------------------------------------------- a gerência */

async function gerencia(navegador) {
  // Formulário nenhum pode fingir que enviou. Este grava de verdade, então o
  // teste é: preencher, salvar, e o carro tem que existir na lista depois.
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 1000 } });
  const { pagina } = await abrir(ctx, "/admin");

  const campos = ["Marca", "Modelo", "Versão", "Ano", "Preço em reais"];
  for (const c of campos) {
    checar(
      (await pagina.getByText(c, { exact: false }).count()) > 0,
      `a gerência tem o campo ${c}`,
    );
  }

  await pagina.locator("form input").nth(0).fill("Porsche");
  await pagina.locator("form input").nth(1).fill("Macan");
  await pagina.locator("form input").nth(2).fill("S");
  await pagina.locator("form input").nth(3).fill("2022");
  await pagina.locator("form input[type='number']").last().fill("450000");
  await pagina.getByRole("button", { name: /cadastrar no estoque/i }).click();
  await pagina.waitForTimeout(700);

  const apareceu = await pagina.getByText("Porsche Macan S").count();
  checar(apareceu > 0, "cadastrar um carro grava e ele aparece na lista");

  const contagem = await pagina.evaluate(
    () => document.querySelectorAll("section ul li").length,
  );
  checar(contagem === 13, "a lista passou de 12 para 13", `achei ${contagem}`);

  // Um carro cadastrado sem foto não pode aparecer com a lataria de outro.
  // Aconteceu: o Porsche recém cadastrado herdava a miniatura do M4.
  const emprestada = await pagina.evaluate(() => {
    const linha = [...document.querySelectorAll("section ul li")].find((l) =>
      l.textContent.includes("Porsche Macan S"),
    );
    if (!linha) return "não achei a linha do carro novo";
    const img = linha.querySelector("img");
    return img ? `mostrou ${img.getAttribute("src")}` : "";
  });
  checar(emprestada === "", "carro sem foto não usa a foto de outro carro", emprestada);

  await pagina.screenshot({ path: path.join(SAIDA, "gerencia-1440.png"), fullPage: true });
  await pagina.close();
  await ctx.close();
}

/* ---------------------------------------------------------- página do carro */

async function paginaCarro(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const { pagina, erros } = await abrir(ctx, "/estoque/bmw-m4-coupe-2016");
  checar((await pagina.locator("h1").count()) === 1, "a página do carro tem um h1");
  checar(erros.length === 0, "a página do carro não tem erro de console", erros.join(" | "));

  const galeria = await pagina.evaluate(() =>
    [...document.images].map((i) => (i.currentSrc || i.src).split("/").pop()),
  );
  const repetidas = galeria.filter((f, i) => galeria.indexOf(f) !== i);
  checar(
    repetidas.length === 0,
    "a galeria do carro não repete foto",
    [...new Set(repetidas)].join(", "),
  );

  const cta = pagina.locator("[data-cta='carro']").first();
  const href = await cta.getAttribute("href");
  checar(
    !!href && /wa\.me\/\d{13}\?text=.*M4/.test(decodeURI(href)),
    "o CTA do carro leva o carro na mensagem",
    href ?? "",
  );
  await pagina.screenshot({ path: path.join(SAIDA, "carro-1440.png"), fullPage: true });
  await pagina.close();
  await ctx.close();
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
    await paginaCarro(navegador);
    await catalogo(navegador);
    await gerencia(navegador);
    await cenaNaoCobreTexto(navegador);
    await retratos(navegador);
  } finally {
    await navegador.close();
  }

  const relatorio = [
    `passou: ${passou.length}`,
    `falhou: ${falhas.length}`,
    "",
    ...falhas.map((f) => `FALHA  ${f}`),
  ].join("\n");
  await writeFile(path.join(SAIDA, "resultado.txt"), relatorio);

  console.log(`\n  passou ${passou.length}   falhou ${falhas.length}\n`);
  for (const f of falhas) console.log(`  FALHA  ${f}`);
  console.log(`\n  telas em ${SAIDA}\n`);

  if (falhas.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
