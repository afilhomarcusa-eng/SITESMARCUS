/**
 * O portão de QA.
 *
 * Roda num navegador de verdade, contra o build de produção, e grava as
 * capturas em qa/. Tudo que dá para cobrar em código está cobrado aqui: uma
 * lista que uma pessoa lê uma vez para de valer no dia seguinte.
 *
 * Duas regras de disciplina que valem mais que a contagem de verificações:
 *
 * 1. Quando um teste passa com o defeito na tela, o teste está medindo a coisa
 *    errada. Conserta o teste primeiro, o defeito depois. Perguntar se a
 *    cortina EXISTE é inútil: o que importa é se ela COBRE, ponto a ponto.
 *
 * 2. O instrumento faz parte do experimento. Cada captura congela a animação,
 *    que anda pelo relógio do compositor, então quem posa para foto e quem é
 *    cronometrada têm que ser páginas diferentes. E espera se calcula contra um
 *    t0, nunca somando intervalos, senão o quadro marcado 1600ms sai aos 2400.
 */

import { chromium } from "playwright";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE ?? "http://127.0.0.1:3314";
const QA = path.resolve("qa");
const MANIFESTO = JSON.parse(readFileSync("public/images/manifest.json", "utf8")).imagens;

const LARGURAS = [360, 390, 430, 768, 1024, 1280, 1440, 1920];
const PAGINAS = ["/", "/estoque", "/procuro", "/vender", "/estoque/porsche-911"];

/** O número de verdade, em formato internacional. 13 dígitos, contados. */
const NUMERO = "5579999592905";

/**
 * As únicas conversas em branco autorizadas.
 *
 * Todo outro link para o WhatsApp no site tem que sair de um caminho
 * qualificado: o carro, ou o formulário. A varredura reprova qualquer link que
 * não esteja nesta lista e diz qual é.
 */
const CONVERSA_LIVRE = ["cabecalho", "rodape"];

let passou = 0;
const falhas = [];

function ok(condicao, titulo, detalhe = "") {
  if (condicao) {
    passou++;
  } else {
    falhas.push(detalhe ? `${titulo}\n      ${detalhe}` : titulo);
    console.log(`  FALHOU  ${titulo}${detalhe ? `\n          ${detalhe}` : ""}`);
  }
}

function igual(a, b, titulo) {
  ok(a === b, titulo, a === b ? "" : `esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);
}

async function novaPagina(navegador, opcoes = {}) {
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "pt-BR",
    ...opcoes,
  });
  const pagina = await ctx.newPage();
  const erros = [];
  pagina.on("console", (m) => m.type() === "error" && erros.push(m.text()));
  pagina.on("pageerror", (e) => erros.push(String(e)));
  const respostas = [];
  pagina.on("response", (r) => {
    if (r.url().startsWith(BASE) && r.status() >= 400) respostas.push(`${r.status()} ${r.url()}`);
  });
  return { ctx, pagina, erros, respostas };
}

/** Pula a abertura: para quase todo teste ela é obstáculo, não objeto. */
async function semAbertura(pagina) {
  await pagina.addInitScript(() => {
    try {
      sessionStorage.setItem("sj:abriu", "1");
    } catch {
      /* contexto sem armazenamento */
    }
  });
}

const local = ["127.0.0.1","localhost","[::1]"].includes(new URL(BASE).hostname);
if (!local || process.env.QA_ISOLADO !== "1" || !process.env.ESTOQUE_TESTE_DIR) throw new Error("Rode npm run qa: o teste exige banco local isolado.");
const AUTH = "Basic " + Buffer.from("saulo:" + process.env.ADMIN_SENHA).toString("base64");
const baseDados = await fetch(BASE + "/api/gerencia/estoque", {headers:{authorization:AUTH}});
if (!baseDados.ok) throw new Error("Não foi possível ler a referência do estoque para o QA.");
const ESTOQUE = (await baseDados.json()).carros;
const TOTAL = ESTOQUE.length;
const BMW = ESTOQUE.filter(c=>c.marca==="BMW").length;
const PORSCHE = ESTOQUE.filter(c=>c.marca==="Porsche").length;
const navegador = await chromium.launch();
if (path.dirname(QA) !== process.cwd() || path.basename(QA) !== "qa") throw new Error("Pasta de QA inválida.");
await rm(QA, { recursive: true, force: true });
await mkdir(QA, { recursive: true });

console.log(`\n  QA contra ${BASE}\n`);

/* =========================================================================
   1. ESTRUTURA, em todas as larguras
   ========================================================================= */

console.log("  estrutura");
for (const rota of PAGINAS) {
  for (const largura of LARGURAS) {
    const { ctx, pagina, erros, respostas } = await novaPagina(navegador, {
      viewport: { width: largura, height: 900 },
    });
    await semAbertura(pagina);
    await pagina.goto(BASE + rota, { waitUntil: "networkidle" });

    const medida = await pagina.evaluate(() => ({
      corpo: document.documentElement.scrollWidth,
      janela: innerWidth,
      h1: document.querySelectorAll("h1").length,
      quebrados: [...document.querySelectorAll("img")]
        .filter((i) => i.loading !== "lazy")
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src),
    }));

    ok(
      medida.corpo <= medida.janela + 1,
      `sem rolagem horizontal em ${rota} a ${largura}px`,
      `documento ${medida.corpo}px numa janela de ${medida.janela}px`,
    );
    ok(medida.h1 === 1, `um h1 só em ${rota} a ${largura}px`, `achei ${medida.h1}`);
    ok(
      medida.quebrados.length === 0,
      `imagens carregadas em ${rota} a ${largura}px`,
      medida.quebrados.join(", "),
    );
    ok(erros.length === 0, `sem erro de console em ${rota} a ${largura}px`, erros.join(" | "));
    ok(
      respostas.length === 0,
      `sem resposta 400+ em ${rota} a ${largura}px`,
      respostas.join(" | "),
    );

    await ctx.close();
  }
}

/* =========================================================================
   2. IMAGEM: a lei da resolução, e nenhuma foto repetida na mesma página
   ========================================================================= */

console.log("  imagens");
for (const rota of PAGINAS) {
  for (const largura of [390, 1440, 1920]) {
    const { ctx, pagina } = await novaPagina(navegador, {
      viewport: { width: largura, height: 1000 },
    });
    await semAbertura(pagina);
    await pagina.goto(BASE + rota, { waitUntil: "networkidle" });
    await pagina.evaluate(async () => {
      // Desce a página inteira para as imagens preguiçosas entrarem.
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
        scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      scrollTo(0, 0);
    });
    await pagina.waitForTimeout(400);

    const fotos = await pagina.evaluate(() =>
      [...document.querySelectorAll("img")].map((i) => ({
        arquivo: (i.currentSrc || i.src).split("/").pop(),
        local: (i.currentSrc || i.src).includes("/images/"),
        nativa: Number((i.dataset.nativa ?? "0x0").split("x")[0]),
        caixa: Math.round(i.getBoundingClientRect().width),
      })),
    );

    for (const f of fotos) {
      if (f.caixa === 0) continue;

      /* A comparação é contra a dimensão da ORIGEM, que viaja no data-nativa, e
         não contra o arquivo entregue: um pipeline que amplia geraria arquivo
         grande e passaria feliz aqui, com a foto borrada na tela. O atributo
         vale igual para foto do repositório e para foto que o Saulo subiu na
         gerência, que nenhum manifesto local conhece. */
      ok(
        f.nativa > 0,
        `${f.arquivo} declara a dimensão da origem em ${rota}`,
        "sem data-nativa",
      );
      if (f.nativa > 0) {
        ok(
          f.caixa * 2 <= f.nativa + 2,
          `${f.arquivo} não é desenhada além da origem em ${rota} a ${largura}px`,
          `caixa ${f.caixa}px em tela retina pede ${f.caixa * 2}px, a origem tem ${f.nativa}px`,
        );
      }

      // Para as fotos que vieram do pipeline, o manifesto ainda é conferido: é
      // ele que prova que o arquivo entregue não foi ampliado na geração.
      if (f.local) {
        const registro = MANIFESTO[f.arquivo];
        ok(!!registro, `${f.arquivo} está no manifesto (${rota})`);
        if (registro) {
          ok(
            registro.exportada.w <= registro.nativa.w,
            `${f.arquivo} não foi ampliada na geração`,
            `${registro.exportada.w}px de uma origem de ${registro.nativa.w}px`,
          );
        }
      }
    }

    const nomes = fotos.map((f) => f.arquivo).filter(Boolean);
    const repetida = nomes.find((n, i) => nomes.indexOf(n) !== i);
    ok(!repetida, `nenhuma foto aparece duas vezes em ${rota} a ${largura}px`, repetida ?? "");

    await ctx.close();
  }
}

/* =========================================================================
   3. COPY
   ========================================================================= */

console.log("  copy");
/** Proibições sem distinção de caixa. */
const PROIBIDAS = [
  "—",
  "–",
  "Lorem ipsum",
  "placeholder",
  "Saiba more",
  "Book now",
  "Discover",
  "Read more",
  "[object Object]",
  "excelência",
  "referência no mercado",
  "solução completa",
];

/**
 * Proibições que só valem escritas exatamente assim.
 *
 * "NaN" sem caixa pega "Financiado", e um teste que reprova a palavra
 * financiado está medindo a coisa errada. Aqui a caixa importa.
 */
const PROIBIDAS_EXATAS = ["NaN", "undefined", "Infinity"];

for (const rota of PAGINAS) {
  const { ctx, pagina } = await novaPagina(navegador);
  await semAbertura(pagina);
  await pagina.goto(BASE + rota, { waitUntil: "networkidle" });

  const texto = await pagina.evaluate(() => document.body.innerText);
  for (const termo of PROIBIDAS) {
    ok(
      !texto.toLowerCase().includes(termo.toLowerCase()),
      `sem "${termo}" em ${rota}`,
      texto.slice(Math.max(0, texto.toLowerCase().indexOf(termo.toLowerCase()) - 40), 120),
    );
  }

  for (const termo of PROIBIDAS_EXATAS) {
    const posicao = texto.indexOf(termo);
    ok(posicao === -1, `sem "${termo}" em ${rota}`, texto.slice(Math.max(0, posicao - 40), 120));
  }

  // Palavra repetida em sequência, do tipo "de de".
  const repetida = texto
    .replace(/\s+/g, " ")
    .match(/\b(\p{L}{3,})\s+\1\b/iu);
  ok(!repetida, `sem palavra duplicada em ${rota}`, repetida ? repetida[0] : "");

  // Caractere decorativo fazendo papel de ícone.
  const decorativos = await pagina.evaluate(() =>
    /[←-⇿☀-➿️⬀-⯿]/.test(document.body.innerText),
  );
  ok(!decorativos, `nenhum caractere decorativo no lugar de ícone em ${rota}`);

  await ctx.close();
}

/* =========================================================================
   4. CONVERSÃO: cada botão conferido um por um, e a varredura
   ========================================================================= */

console.log("  conversão");
{
  const { ctx, pagina } = await novaPagina(navegador);
  await semAbertura(pagina);
  await pagina.goto(BASE + "/", { waitUntil: "networkidle" });

  const destino = async (seletor) =>
    pagina.getAttribute(seletor, "href").catch(() => null);

  igual(await destino('[data-acao="heroi-estoque"]'), "/estoque", "botão do herói leva ao estoque");
  igual(await destino('[data-acao="heroi-procuro"]'), "/procuro", "botão do herói leva a procuro");
  igual(await destino('[data-porta="/estoque"]'), "/estoque", "porta 01 leva ao estoque");
  igual(await destino('[data-porta="/procuro"]'), "/procuro", "porta 02 leva a procuro");
  igual(await destino('[data-porta="/vender"]'), "/vender", "porta 03 leva a vender");
  igual(await destino('[data-acao="final-estoque"]'), "/estoque", "chamada final leva ao estoque");
  igual(await destino('[data-acao="final-procuro"]'), "/procuro", "chamada final leva a procuro");

  const cabecalho = await destino('[data-conversa="cabecalho"]');
  ok(
    cabecalho?.startsWith(`https://wa.me/${NUMERO}?text=`),
    "WhatsApp do cabeçalho leva ao número certo",
    cabecalho ?? "sem href",
  );

  // Os seis cartões da home levam cada um à ficha do seu carro.
  const cartoes = await pagina.$$eval("[data-carro]", (as) =>
    as.map((a) => ({ carro: a.dataset.carro, href: a.getAttribute("href") })),
  );
  igual(cartoes.length, 6, "a home mostra seis cartões");
  for (const c of cartoes) {
    igual(c.href, `/estoque/${c.carro}`, `cartão de ${c.carro} leva à ficha dele`);
  }

  await ctx.close();
}

// A varredura: nenhum link para conversa em branco fora das exceções.
console.log("  varredura de wa.me");
for (const rota of [...PAGINAS, "/estoque/corvette-stingray", "/estoque/audi-rs5"]) {
  const { ctx, pagina } = await novaPagina(navegador);
  await semAbertura(pagina);
  await pagina.goto(BASE + rota, { waitUntil: "networkidle" });

  const links = await pagina.$$eval('a[href*="wa.me"]', (as) =>
    as.map((a) => ({
      href: a.getAttribute("href") ?? "",
      conversa: a.dataset.conversa ?? "",
      texto: (a.textContent ?? "").trim().slice(0, 40),
      rel: a.getAttribute("rel") ?? "",
      alvo: a.getAttribute("target") ?? "",
    })),
  );

  for (const l of links) {
    ok(
      l.href.includes(NUMERO),
      `link de WhatsApp em ${rota} carrega o número inteiro`,
      `${l.texto}: ${l.href.slice(0, 60)}`,
    );
    ok(
      l.conversa !== "",
      `link de WhatsApp em ${rota} está declarado`,
      `sem data-conversa: "${l.texto}"`,
    );
    ok(
      l.alvo !== "_blank" || l.rel.includes("noopener"),
      `link externo em ${rota} tem rel noopener`,
      l.texto,
    );

    const decodificado = decodeURIComponent(l.href.split("text=")[1] ?? "");
    const qualificado =
      CONVERSA_LIVRE.includes(l.conversa) ||
      l.conversa === "carro" ||
      l.conversa === "formulario";
    ok(
      qualificado,
      `link de WhatsApp em ${rota} sai de um caminho qualificado`,
      `"${l.texto}" com data-conversa="${l.conversa}"`,
    );
    if (l.conversa === "carro") {
      ok(
        decodificado.length > 40,
        `a conversa do carro em ${rota} leva o carro na mensagem`,
        decodificado,
      );
    }
  }

  // Âncoras internas apontam para algo que existe.
  const ancoras = await pagina.$$eval('a[href^="#"]', (as) =>
    as.map((a) => a.getAttribute("href") ?? ""),
  );
  for (const a of ancoras) {
    const existe = await pagina.$(a);
    ok(!!existe, `âncora ${a} existe em ${rota}`);
  }

  await ctx.close();
}

/* =========================================================================
   5. FORMULÁRIOS: campos descobertos, não listados
   ========================================================================= */

console.log("  formulários");
for (const rota of ["/procuro", "/vender"]) {
  const { ctx, pagina } = await novaPagina(navegador);
  await semAbertura(pagina);
  await pagina.goto(BASE + rota, { waitUntil: "networkidle" });

  // Nenhum campo obrigatório: quem não sabe um dado não pode travar por causa dele.
  const obrigatorios = await pagina.$$eval(
    "[data-formulario] [required]",
    (els) => els.length,
  );
  igual(obrigatorios, 0, `nenhum campo obrigatório em ${rota}`);

  // Varre os campos que existem, marca cada um com um valor único e cobra todos
  // de volta. Campo novo já nasce conferido.
  const campos = await pagina.$$eval("[data-formulario] input, [data-formulario] textarea", (els) =>
    els.map((e) => e.id),
  );
  ok(campos.length >= 6, `${rota} tem campos de texto`, `achei ${campos.length}`);

  const marcados = {};
  for (const [i, id] of campos.entries()) {
    const valor = `qa${i}zt`;
    marcados[id] = valor;
    await pagina.fill(`#${id}`, valor);
  }

  const listas = await pagina.$$eval("[data-formulario] select", (els) => els.map((e) => e.id));
  for (const id of listas) {
    const opcoes = await pagina.$$eval(`#${id} option`, (os) =>
      os.map((o) => o.value).filter(Boolean),
    );
    if (opcoes.length) {
      await pagina.selectOption(`#${id}`, opcoes[0]);
      marcados[id] = opcoes[0];
    }
  }

  const href = await pagina.getAttribute("[data-enviar]", "href");
  const mensagem = decodeURIComponent((href ?? "").split("text=")[1] ?? "");
  for (const [id, valor] of Object.entries(marcados)) {
    ok(
      mensagem.includes(valor),
      `o que foi digitado em ${id} chega na mensagem (${rota})`,
      mensagem.slice(0, 200),
    );
  }
  ok(href?.includes(NUMERO), `o envio de ${rota} vai para o número certo`, href ?? "");

  // A prévia mostra o que vai ser mandado, não uma promessa vazia.
  const previa = await pagina.textContent("[data-previa]");
  ok(
    previa?.includes(Object.values(marcados)[0] ?? ""),
    `a prévia de ${rota} acompanha o que foi digitado`,
  );

  // Nada finge envio.
  const finge = await pagina.evaluate(() =>
    /enviado com sucesso|mensagem enviada/i.test(document.body.innerText),
  );
  ok(!finge, `${rota} não finge que enviou`);

  await ctx.close();
}

/* =========================================================================
   6. FILTROS: conferidos pelo resultado, não pelo clique
   ========================================================================= */

console.log("  filtros");
{
  const { ctx, pagina } = await novaPagina(navegador);
  await semAbertura(pagina);
  await pagina.goto(BASE + "/estoque", { waitUntil: "networkidle" });

  const quantos = () => pagina.$$eval("[data-carro]", (as) => as.length);
  const marcas = () =>
    pagina.$$eval("[data-carro]", (as) => as.map((a) => a.dataset.carro ?? ""));
  const precos = () =>
    pagina.$$eval("[data-carro] .cartao-preco", (ps) =>
      ps.map((p) => Number((p.textContent ?? "").replace(/[^\d]/g, ""))),
    );

  igual(await quantos(), TOTAL, "o estoque inteiro aparece sem filtro");

  await pagina.click('[data-marca="BMW"]');
  await pagina.waitForTimeout(150);
  const soBmw = await marcas();
  ok(soBmw.length === BMW, "filtrar BMW acompanha o estoque", `vieram ${soBmw.length}`);
  ok(
    soBmw.every((s) => s.startsWith("bmw")),
    "filtrar BMW não deixa passar outra marca",
    soBmw.join(", "),
  );
  ok(
    (await pagina.textContent("[data-contagem]"))?.includes("de " + TOTAL),
    "a contagem acompanha o filtro",
  );
  ok(page_url(pagina).includes("marca=BMW"), "o filtro vive na barra de endereço");

  await pagina.click("[data-limpar]");
  await pagina.waitForTimeout(150);
  igual(await quantos(), TOTAL, "limpar devolve todo o estoque");

  await pagina.click('[data-ate="500000"]');
  await pagina.waitForTimeout(150);
  const abaixo = await precos();
  ok(
    abaixo.every((p) => p <= 500000),
    "o teto de preço não deixa passar nada acima",
    abaixo.join(", "),
  );

  await pagina.click("[data-limpar]");
  await pagina.selectOption("[data-ordem]", "menor-preco");
  await pagina.waitForTimeout(150);
  const ordenados = await precos();
  ok(
    ordenados.every((p, i) => i === 0 || ordenados[i - 1] <= p),
    "ordenar por menor preço produz lista crescente",
    ordenados.join(", "),
  );

  await pagina.fill("[data-busca]", "porsche");
  await pagina.waitForTimeout(200);
  const busca = await marcas();
  ok(
    busca.length === PORSCHE && busca.every((s) => s.includes("porsche")),
    "buscar Porsche acompanha o estoque",
    busca.join(", "),
  );

  await pagina.fill("[data-busca]", "lamborghini");
  await pagina.waitForTimeout(200);
  igual(await quantos(), 0, "busca sem resultado não inventa carro");
  const vazio = await pagina.textContent(".vazio");
  ok(vazio?.includes("Procuro") || vazio?.includes("procura"), "o estado vazio continua vendendo");

  await ctx.close();
}

function page_url(pagina) {
  return pagina.url();
}

// Link filtrado abre já filtrado, do servidor, sem piscar.
{
  const { ctx, pagina } = await novaPagina(navegador);
  await semAbertura(pagina);
  await pagina.goto(BASE + "/estoque?marca=Porsche", { waitUntil: "domcontentloaded" });
  const daPrimeira = await pagina.$$eval("[data-carro]", (as) => as.length);
  igual(daPrimeira, PORSCHE, "link filtrado chega filtrado no primeiro quadro");
  await ctx.close();
}

/* =========================================================================
   7. A ABERTURA: cobertura medida, não existência conferida
   ========================================================================= */

console.log("  abertura");
const DURACAO = Number(
  readFileSync("lib/abertura.ts", "utf8").match(/DURACAO_ABERTURA = (\d+)/)[1],
);

for (const largura of [1440, 390]) {
  const { ctx, pagina } = await novaPagina(navegador, {
    viewport: { width: largura, height: 860 },
  });
  await pagina.goto(BASE + "/", { waitUntil: "domcontentloaded" });

  // Cobertura ponto a ponto, incluindo em cima da barra do cabeçalho, que é por
  // onde um site vaza. Perguntar se o elemento existe deixaria o defeito passar.
  const cobertura = await pagina.evaluate(() => {
    const pontos = [];
    for (let x = 0.08; x <= 0.95; x += 0.13) {
      for (const y of [0.03, 0.06, 0.25, 0.5, 0.75, 0.96]) {
        const el = document.elementFromPoint(x * innerWidth, y * innerHeight);
        pontos.push({
          x: Math.round(x * 100),
          y: Math.round(y * 100),
          cortina: !!el?.closest(".cortina"),
          quem: el?.className?.toString?.().slice(0, 30) ?? "",
        });
      }
    }
    return pontos;
  });

  const vazando = cobertura.filter((p) => !p.cortina);
  ok(
    vazando.length === 0,
    `a abertura cobre a tela inteira a ${largura}px`,
    vazando.map((p) => `${p.x}%,${p.y}% mostrou ${p.quem}`).join(" | "),
  );

  /* A cobertura não pode ser medida só no primeiro instante.
     Um defeito real passou por aqui: pointer-events e visibility são
     propriedades discretas, e o navegador vira o valor no meio do intervalo
     entre dois quadros de animação. A cortina continuava desenhada na tela e
     ficava atravessável a clique no meio da abertura. Medir só aos 0ms deixava
     isso passar, com o defeito acontecendo em cima do botão principal. */
  const t0Cobertura = Date.now();
  for (const fatia of [0.18, 0.35, 0.5]) {
    const marca = Math.round(DURACAO * fatia);
    const falta = marca - (Date.now() - t0Cobertura);
    if (falta > 0) await pagina.waitForTimeout(falta);

    /* Os pontos são do que está na tela, e não do que está na página: no
       celular o retrato do herói fica abaixo da dobra, e elementFromPoint em
       coordenada fora da janela devolve nada. Medir ali reprovaria uma tela
       que está perfeitamente coberta. */
    const meio = await pagina.evaluate(() => {
      const pontos = [
        { nome: "centro da tela", x: innerWidth / 2, y: innerHeight / 2 },
        { nome: "faixa do cabeçalho", x: innerWidth / 2, y: 28 },
        { nome: "canto inferior", x: innerWidth - 24, y: innerHeight - 24 },
      ];
      return pontos.map((p) => {
        const el = document.elementFromPoint(p.x, p.y);
        return { nome: p.nome, cortina: !!el?.closest(".cortina"), quem: el?.tagName ?? "nada" };
      });
    });
    for (const p of meio) {
      ok(
        p.cortina,
        `a abertura ainda cobre o ${p.nome} aos ${marca}ms, a ${largura}px`,
        `apareceu ${p.quem}`,
      );
    }
  }

  // O botão principal existe, está pintado e é clicável ao longo da abertura.
  const t0 = Date.now();
  for (const marca of [200, 900, 1500, Math.round(DURACAO * 0.52) + 40, DURACAO + 120]) {
    // Espera calculada contra o t0, nunca somando intervalos: somar acumula o
    // custo de cada medição e desloca o quadro que se quer olhar.
    const falta = marca - (Date.now() - t0);
    if (falta > 0) await pagina.waitForTimeout(falta);

    const estado = await pagina.evaluate(() => {
      const botao = document.querySelector('[data-acao="heroi-estoque"]');
      if (!botao) return null;
      const c = getComputedStyle(botao);
      const r = botao.getBoundingClientRect();
      const meio = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return {
        opacidade: Number(c.opacity),
        visivel: c.visibility === "visible",
        cobertoPorCortina: !!meio?.closest(".cortina"),
      };
    });

    ok(!!estado, `o botão principal existe aos ${marca}ms`);
    if (!estado) continue;
    igual(estado.opacidade, 1, `o botão principal está em opacidade cheia aos ${marca}ms`);
    ok(estado.visivel, `o botão principal não está escondido aos ${marca}ms`);
    if (marca > DURACAO * 0.52) {
      ok(
        !estado.cobertoPorCortina,
        `o botão principal já é clicável aos ${marca}ms`,
        "a cortina ainda intercepta o clique",
      );
    }
  }

  await ctx.close();
}

// Uma vez por sessão.
{
  const { ctx, pagina } = await novaPagina(navegador);
  await pagina.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const primeira = await pagina.evaluate(() => document.documentElement.dataset.abrir);
  igual(primeira, "1", "a abertura roda na primeira visita");
  await pagina.reload({ waitUntil: "domcontentloaded" });
  const segunda = await pagina.evaluate(() => document.documentElement.dataset.abrir);
  ok(segunda !== "1", "a abertura não repete ao recarregar na mesma sessão");
  await ctx.close();
}

// Encerra no primeiro gesto.
{
  const { ctx, pagina } = await novaPagina(navegador);
  await pagina.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await pagina.waitForTimeout(250);
  await pagina.mouse.click(10, 300);
  await pagina.waitForTimeout(120);
  const depois = await pagina.evaluate(() => document.documentElement.dataset.abrir);
  ok(depois === "0", "o primeiro gesto encerra a abertura", `data-abrir ficou ${depois}`);
  await ctx.close();
}

// Sem o pacote da página, a cortina sai do mesmo jeito e o conteúdo aparece.
{
  const { ctx, pagina } = await novaPagina(navegador);
  await pagina.route("**/_next/static/chunks/**", (r) => r.abort());
  await pagina.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await pagina.waitForTimeout(DURACAO + 500);
  const estado = await pagina.evaluate(() => {
    const meio = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    const h1 = document.querySelector("h1");
    return {
      cortinaNaFrente: !!meio?.closest(".cortina"),
      h1Visivel: !!h1 && h1.getBoundingClientRect().height > 0,
    };
  });
  ok(!estado.cortinaNaFrente, "com o JavaScript derrubado a cortina sai do mesmo jeito");
  ok(estado.h1Visivel, "com o JavaScript derrubado o conteúdo continua visível");
  await ctx.close();
}

// Sem JavaScript nenhum: nada fica escondido esperando um observador.
{
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const pagina = await ctx.newPage();
  // "load", e não "domcontentloaded": com o script desligado a folha de estilo
  // pode ainda não ter sido aplicada no DOMContentLoaded, e aí toda medida sai
  // errada. Já aconteceu aqui: a cortina apareceu como display block porque o
  // CSS ainda não valia. Antes de medir desenho, confirmar que há desenho.
  await pagina.goto(BASE + "/", { waitUntil: "load" });
  const pintado = await pagina.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  ok(
    pintado !== "rgba(0, 0, 0, 0)" && pintado !== "rgb(255, 255, 255)",
    "sem JavaScript a folha de estilo foi aplicada antes da medição",
    pintado,
  );
  const semJs = await pagina.evaluate(() => ({
    titulo: document.querySelector("h1")?.textContent ?? "",
    cortina: getComputedStyle(document.querySelector(".cortina")).display,
    escondidos: [...document.querySelectorAll("[data-revelar]")].filter(
      (e) => e.getBoundingClientRect().height === 0,
    ).length,
  }));
  ok(semJs.titulo.length > 10, "sem JavaScript o título aparece", semJs.titulo);
  igual(semJs.cortina, "none", "sem JavaScript não existe cortina nenhuma");
  igual(semJs.escondidos, 0, "sem JavaScript nada fica escondido");
  await ctx.close();
}

// Movimento reduzido: sem abertura, e os títulos à vista.
{
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + "/", { waitUntil: "networkidle" });
  const estado = await pagina.evaluate(() => ({
    abrir: document.documentElement.dataset.abrir ?? "",
    h1: document.querySelector("h1")?.getBoundingClientRect().height ?? 0,
  }));
  ok(estado.abrir !== "1", "com movimento reduzido a abertura não roda");
  ok(estado.h1 > 20, "com movimento reduzido o título continua visível");
  await ctx.close();
}

/* =========================================================================
   8. REVELAÇÃO: nada continua escondido depois que a página inteira rolou
   ========================================================================= */

console.log("  revelação");
for (const rota of PAGINAS) {
  const { ctx, pagina } = await novaPagina(navegador);
  await semAbertura(pagina);
  await pagina.goto(BASE + rota, { waitUntil: "networkidle" });
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
  });
  await pagina.waitForTimeout(1200);

  const escondidos = await pagina.$$eval("[data-revelar]", (els) =>
    els.filter((e) => e.dataset.revelar !== "visivel").map((e) => e.textContent?.slice(0, 30)),
  );
  igual(escondidos.length, 0, `nada segue escondido em ${rota}`, escondidos.join(" | "));
  await ctx.close();
}

/* =========================================================================
   9. A PORTA DA GERÊNCIA
   Conferida pelos dois lados, porque cadeado só se testa tentando abrir.
   ========================================================================= */

console.log("  gerência");
const SENHA = process.env.ADMIN_SENHA ?? "";

{
  const semSenha = await fetch(BASE + "/admin");
  igual(semSenha.status, 401, "sem credencial, /admin recusa");
  ok(
    (semSenha.headers.get("www-authenticate") ?? "").startsWith("Basic"),
    "a recusa pede credencial",
  );

  const errada = await fetch(BASE + "/admin", {
    headers: { authorization: "Basic " + Buffer.from("saulo:errada").toString("base64") },
  });
  igual(errada.status, 401, "com senha errada, /admin recusa");

  const escrita = await fetch(BASE + "/api/gerencia/estoque", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ carros: [] }),
  });
  igual(escrita.status, 401, "sem credencial, a gravação recusa");

  if (SENHA) {
    const cabecalho = "Basic " + Buffer.from("saulo:" + SENHA).toString("base64");

    const certa = await fetch(BASE + "/admin", { headers: { authorization: cabecalho } });
    igual(certa.status, 200, "com a senha certa, /admin abre");

    const corpo = await certa.text();
    ok(!corpo.includes(SENHA), "a senha não aparece na resposta do servidor");

    // O site continua aberto: o cadeado é da gerência, não do estoque.
    igual((await fetch(BASE + "/estoque")).status, 200, "o estoque continua público");

    /* O fluxo inteiro: semear, conferir que o site mudou, e conferir que a home
       continua respondendo. A home já devolveu 500 em toda visita depois do
       primeiro salvamento, porque a leitura do banco tornava dinâmica uma
       página que nasceu estática, e o defeito só aparecia depois que o banco
       existia. Este bloco é o que impede isso de voltar. */
    const semeou = await fetch(BASE + "/api/gerencia/estoque", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: cabecalho },
      body: JSON.stringify({ semear: true }),
    });
    igual(semeou.status, 200, "a gerência restaura a lista original");
    const { carros: quantos } = await semeou.json();

    for (const rota of ["/", "/estoque"]) {
      const r = await fetch(BASE + rota);
      igual(r.status, 200, `${rota} responde depois de salvar na gerência`);
      const html = await r.text();
      ok(
        html.includes(String(quantos)),
        `${rota} mostra a contagem do banco (${quantos})`,
      );
    }

    // Carro sem preço não entra: cartão sem preço é defeito visível.
    const recusa = await fetch(BASE + "/api/gerencia/estoque", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: cabecalho },
      body: JSON.stringify({ carros: [{ slug: "x", marca: "X", modelo: "X", nome: "X", ano: 2020, preco: 0, conferido: [], itens: [], fotos: [] }] }),
    });
    igual(recusa.status, 400, "carro sem preço é recusado");
  } else {
    ok(false, "ADMIN_SENHA não veio para o QA: o fluxo da gerência não foi testado");
  }
}

/* =========================================================================
   10. O SELETOR DE MARCHAS
   ========================================================================= */

console.log("  seletor");
{
  const { ctx, pagina } = await novaPagina(navegador);
  await semAbertura(pagina);
  await pagina.goto(BASE + "/", { waitUntil: "networkidle" });

  const caminhos = [
    ["comprar", "/estoque"],
    ["procurar", "/procuro"],
    ["vender", "/vender"],
  ];

  for (const [id, destino] of caminhos) {
    await pagina.click(`[data-encaixe="${id}"]`);
    await pagina.waitForTimeout(200);

    const visivel = await pagina.$$eval("[data-painel]", (paineis) =>
      paineis.filter((p) => p.dataset.oculto === "0").map((p) => p.dataset.painel),
    );
    igual(visivel.join(","), id, `engatar ${id} mostra o painel dele`);

    const href = await pagina.getAttribute(`[data-painel="${id}"] [data-porta]`, "href");
    igual(href, destino, `o botão de ${id} leva a ${destino}`);

    const marcado = await pagina.getAttribute(`[data-encaixe="${id}"]`, "aria-selected");
    igual(marcado, "true", `o encaixe de ${id} fica marcado`);
  }

  // Seta do teclado engata a marcha seguinte: é aba de verdade, não desenho.
  await pagina.click('[data-encaixe="comprar"]');
  await pagina.keyboard.press("ArrowDown");
  await pagina.waitForTimeout(200);
  const depoisDaSeta = await pagina.$$eval("[data-painel]", (paineis) =>
    paineis.filter((p) => p.dataset.oculto === "0").map((p) => p.dataset.painel),
  );
  igual(depoisDaSeta.join(","), "procurar", "a seta do teclado engata a marcha seguinte");

  await ctx.close();
}

// Sem JavaScript, os três caminhos aparecem inteiros, com os três botões.
{
  const ctx = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const pagina = await ctx.newPage();
  await pagina.goto(BASE + "/", { waitUntil: "load" });
  const paineis = await pagina.$$eval("[data-painel]", (ps) =>
    ps.filter((p) => p.getBoundingClientRect().height > 0).length,
  );
  igual(paineis, 3, "sem JavaScript os três caminhos aparecem");
  await ctx.close();
}


/* Regression: CRUD, upload, empty inventory, and failed saves use the isolated store. */
console.log("  fluxo completo da gerência");
{
 const headers={authorization:AUTH,"content-type":"application/json"};
 const ler=async()=>{const r=await fetch(BASE+"/api/gerencia/estoque",{headers});return (await r.json()).carros;};
 const gravar=async carros=>fetch(BASE+"/api/gerencia/estoque",{method:"POST",headers,body:JSON.stringify({carros})});
 const original=await ler();
 const {ctx,pagina}=await novaPagina(navegador,{httpCredentials:{username:"saulo",password:process.env.ADMIN_SENHA}});
 try {
  const novo={...original[0],slug:"qa-veiculo",marca:"Teste",modelo:"Veículo de teste",nome:"Veículo de teste",preco:123456};
  igual((await gravar([...original,novo])).status,200,"adicionar carro salva");
  const ficha=await fetch(BASE+"/estoque/qa-veiculo");
  igual(ficha.status,200,"carro novo tem ficha sem rebuild");
  ok((await ficha.text()).includes("123.456"),"a ficha nova tem o preço salvo");

  await semAbertura(pagina);
  await pagina.goto(BASE+"/admin",{waitUntil:"networkidle"});
  await pagina.locator('[data-linha="qa-veiculo"] .gerencia-linha').click();
  await pagina.getByLabel("Preço, em reais",{exact:true}).fill("234567");
  const equipamentos=pagina.getByLabel("Equipamentos, um por linha",{exact:true});
  await equipamentos.fill("Primeiro");
  await equipamentos.press("End");
  await equipamentos.press("Enter");
  await equipamentos.pressSequentially("Segundo");
  igual(await equipamentos.inputValue(),"Primeiro\nSegundo","o editor aceita equipamentos em linhas separadas");
  await pagina.locator("[data-salvar]").click();
  await pagina.waitForFunction(()=>document.querySelector("[data-recado]")?.textContent?.startsWith("Salvo."));
  const salvo=(await ler()).find(c=>c.slug==="qa-veiculo");
  igual(salvo.preco,234567,"editar preço pelo painel persiste");
  igual(salvo.itens.join("|"),"Primeiro|Segundo","equipamentos persistem sem perder quebras");

  await pagina.getByLabel("Preço, em reais",{exact:true}).fill("345678");
  await pagina.route("**/api/gerencia/estoque",r=>r.abort());
  await pagina.locator("[data-salvar]").click();
  await pagina.waitForFunction(()=>document.querySelector("[data-recado]")?.textContent?.includes("conexão"));
  ok(await pagina.locator("[data-salvar]").isEnabled(),"falha de rede libera o botão para tentar de novo");
  igual(await pagina.getByLabel("Preço, em reais",{exact:true}).inputValue(),"345678","falha de rede preserva a edição");
  await pagina.unroute("**/api/gerencia/estoque");
  await pagina.locator("[data-salvar]").click();
  await pagina.waitForFunction(()=>document.querySelector("[data-recado]")?.textContent?.startsWith("Salvo."));

  const sharp=(await import("sharp")).default;
  const pequena=await sharp({create:{width:300,height:180,channels:3,background:"#555555"}}).jpeg().toBuffer();
  const form=new FormData();form.append("foto",new Blob([pequena],{type:"image/jpeg"}),"teste.jpg");form.append("slug","qa-veiculo");form.append("indice","0");
  const upload=await fetch(BASE+"/api/gerencia/foto",{method:"POST",headers:{authorization:AUTH},body:form});
  igual(upload.status,200,"upload de foto funciona com armazenamento isolado");
  const {foto}=await upload.json();
  for(const fonte of foto.fontes){
   const info=await sharp(Buffer.from(fonte.url.split(",")[1],"base64")).metadata();
   igual(info.width,fonte.w,"srcset declara a largura real do upload");
   ok(info.width<=135&&info.height<=180,"foto horizontal não amplia o recorte para retrato");
  }
  const grande=Buffer.concat([pequena,Buffer.alloc(5*1024*1024)]);
  let bytesEnviados=0;
  pagina.on("request",r=>{if(r.url().endsWith("/api/gerencia/foto"))bytesEnviados=r.postDataBuffer()?.length??0;});
  await pagina.locator('input[type="file"]').first().setInputFiles({name:"celular.jpg",mimeType:"image/jpeg",buffer:grande});
  await pagina.waitForFunction(()=>document.querySelector("[data-recado]")?.textContent==="Foto pronta.");
  ok(bytesEnviados>0&&bytesEnviados<3_600_000,"foto grande é reduzida antes do envio da gerência");
  await pagina.locator("[data-salvar]").click();
  await pagina.waitForFunction(()=>document.querySelector("[data-recado]")?.textContent?.startsWith("Salvo."));
  ok((await ler()).find(c=>c.slug==="qa-veiculo").fotos[0].fontes[0].url.startsWith("data:image/webp;base64,"),"a foto enviada pelo painel fica no banco isolado");
  const semFoto={...novo,slug:"qa-sem-foto",fotos:[]};
  igual((await gravar([semFoto])).status,400,"publicação sem foto não pode quebrar o herói");
  igual((await gravar([null])).status,400,"carro nulo recebe erro de validação");
  igual((await gravar([])).status,200,"é possível remover o último carro");
  igual((await ler()).length,0,"banco vazio continua vazio");
  for(const rota of ["/","/estoque"]){
   const r=await fetch(BASE+rota);const html=await r.text();
   igual(r.status,200,"estoque vazio não quebra "+rota);
   ok(!/R\$(?:&nbsp;|\s)*0[,<]/.test(html)&&!html.includes("marca: undefined"),"estoque vazio não inventa faixa de preço em "+rota);
  }
  igual((await fetch(BASE+"/estoque/qa-veiculo")).status,404,"carro removido deixa de ter ficha");
  await pagina.goto(BASE+"/admin",{waitUntil:"networkidle"});
  pagina.once("dialog",d=>d.accept());
  await pagina.locator("[data-restaurar]").click();
  await pagina.waitForFunction(()=>document.querySelector("[data-recado]")?.textContent?.includes("restaurada"));
  igual(await pagina.locator("[data-linha]").count(),original.length,"restaurar atualiza o editor sem recarregar");
  ok(await pagina.locator("[data-salvar]").isDisabled(),"restauração não deixa cópia antiga pronta para salvar");
 } finally {
  await gravar(original);
  await ctx.close();
 }
}

/* =========================================================================
   11. CAPTURAS: olhar, não só contar
   ========================================================================= */

console.log("  capturas");
{
  for (const [rotulo, largura] of [
    ["390", 390],
    ["1440", 1440],
    ["1920", 1920],
  ]) {
    for (const rota of PAGINAS) {
      const { ctx, pagina } = await novaPagina(navegador, {
        viewport: { width: largura, height: 1000 },
      });
      await semAbertura(pagina);
      await pagina.goto(BASE + rota, { waitUntil: "networkidle" });
      await pagina.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 90));
        }
        scrollTo(0, 0);
      });
      await pagina.waitForTimeout(700);
      const nome = rota === "/" ? "home" : rota.replace(/\//g, "-").replace(/^-/, "");
      await pagina.screenshot({
        path: path.join(QA, `${rotulo}-${nome}.png`),
        fullPage: true,
      });
      await ctx.close();
    }
  }

  // A abertura, quadro a quadro. Página separada da que é cronometrada: cada
  // captura congela a animação, e seis fotos na mesma página transformam uma
  // abertura de 2,8s numa medida de 6,6s.
  for (const largura of [1440, 390]) {
    const { ctx, pagina } = await novaPagina(navegador, {
      viewport: { width: largura, height: 860 },
    });
    await pagina.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    const t0 = Date.now();
    for (const marca of [150, 700, 1300, 1900, 2400, DURACAO + 400]) {
      const falta = marca - (Date.now() - t0);
      if (falta > 0) await pagina.waitForTimeout(falta);
      await pagina.screenshot({ path: path.join(QA, `abertura-${largura}-${marca}ms.png`) });
    }
    await ctx.close();
  }
}

/* =========================================================================
   Fim
   ========================================================================= */

await navegador.close();

const total = passou + falhas.length;
await writeFile(
  path.join(QA, "resultado.txt"),
  `${new Date().toISOString()}\n${passou} de ${total} verificações passaram\n\n${falhas.join("\n")}\n`,
);

console.log(`\n  ${passou} de ${total} verificações passaram`);
if (falhas.length) {
  console.log(`\n  ${falhas.length} falhas:\n`);
  for (const f of falhas) console.log(`   - ${f}`);
  process.exit(1);
}
console.log("  capturas em qa/\n");
