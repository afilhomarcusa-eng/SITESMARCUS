/**
 * Pipeline de imagem.
 *
 * A regra que manda: nenhuma imagem sai maior do que entrou. A largura
 * exportada é min(slot * 2, largura nativa do recorte). Quando a origem não
 * cobre 2x, sai em 1x e pronto. Não existe upscale aqui.
 *
 * O manifesto guarda a dimensão NATIVA de cada origem. O QA compara a caixa
 * desenhada na tela contra esse número, e não contra o arquivo exportado: um
 * pipeline que amplia gera arquivo grande e passaria feliz num teste que
 * olhasse só o export, com a foto borrada na tela.
 *
 * As 145 fotos originais são todas verticais, tiradas de celular no mesmo
 * trecho de calçada de Aracaju. É por isso que o site inteiro é feito de
 * molduras 3:4 em pé: o layout foi desenhado em cima do que existe.
 *
 *   npm run assets
 */

import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const ASSETS = path.resolve("../assets/carros");
const OUT = path.resolve("public/images");

/**
 * Larguras de slot, medidas no layout que existe.
 *
 * capa    = cartão da grade do estoque, quatro colunas em 1920
 * retrato = foto grande da ficha do carro
 * tira    = as fotos da tira horizontal da ficha
 * heroi   = o retrato do herói da home, o maior slot do site
 */
const SLOTS = { capa: 420, retrato: 720, tira: 320, heroi: 760 };

/** A moldura do site inteiro. Toda foto é recortada para ela. */
const PROPORCAO = 4 / 3;

/** Quantas fotos de cada carro entram na tira da ficha, depois da capa. */
const FOTOS_NA_TIRA = 5;

/** O retrato do herói: a foto de maior resolução do estoque inteiro. */
const HEROI = { arquivo: "corvette-stingray-00.jpg", nome: "heroi" };

const manifest = { geradoEm: new Date().toISOString(), imagens: {} };

async function emitir({ origem, nome, slot }) {
  const meta = await sharp(origem).metadata();
  const nativa = { w: meta.width, h: meta.height };

  // Duas larguras: a do slot e a retina. Nenhuma delas passa da nativa.
  const larguras = [...new Set([slot, slot * 2])]
    .map((l) => Math.min(l, nativa.w))
    .sort((a, b) => a - b);

  for (const largura of larguras) {
    const altura = Math.round(largura * PROPORCAO);
    const saida = path.join(OUT, `${nome}-${largura}.webp`);

    // Um resize só. Encadear extract com resize faz a biblioteca aplicar
    // apenas o último e descartar o recorte, em silêncio.
    await sharp(origem)
      .resize({ width: largura, height: altura, fit: "cover", position: "centre" })
      .webp({ quality: 82 })
      .toFile(saida);

    // Lê de volta o que de fato saiu, porque pedir não é o mesmo que sair.
    const real = await sharp(saida).metadata();
    if (real.width > nativa.w) {
      throw new Error(
        `${nome}: saiu com ${real.width}px, maior que a nativa ${nativa.w}px. O pipeline ampliou.`,
      );
    }

    manifest.imagens[`${nome}-${largura}.webp`] = {
      origem: path.basename(origem),
      nativa,
      exportada: { w: real.width, h: real.height },
      slotCss: slot,
    };
  }

  console.log(
    `  ${nome.padEnd(24)} nativa ${nativa.w}x${nativa.h} -> ${larguras.join(", ")} (slot ${slot}px)`,
  );
}


/**
 * A imagem de compartilhamento.
 *
 * Feita da mesma matéria do site: o retrato à esquerda, papel à direita, o nome
 * na serifa e a linha de posicionamento embaixo. Nada de captura de tela.
 */
async function ogImagem() {
  const LARG = 1200;
  const ALT = 630;
  const fotoLarg = 470;

  const foto = await sharp(path.join(ASSETS, HEROI.arquivo))
    .resize({ width: fotoLarg, height: ALT, fit: "cover", position: "centre" })
    .toBuffer();

  const texto = Buffer.from(`<svg width="${LARG}" height="${ALT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${LARG}" height="${ALT}" fill="#f4f2ed"/>
  <text x="${fotoLarg + 66}" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="66" fill="#14140f">Saulo Jordão</text>
  <text x="${fotoLarg + 66}" y="316" font-family="Georgia, 'Times New Roman', serif" font-size="40" fill="#4b5345">Premium Cars</text>
  <text x="${fotoLarg + 68}" y="392" font-family="Arial, Helvetica, sans-serif" font-size="21" letter-spacing="2" fill="#7c8188">CORRETOR DE VEÍCULOS PREMIUM</text>
  <text x="${fotoLarg + 68}" y="424" font-family="Arial, Helvetica, sans-serif" font-size="21" letter-spacing="2" fill="#7c8188">ARACAJU, SERGIPE</text>
  <rect x="${fotoLarg + 66}" y="452" width="120" height="2" fill="#4b5345"/>
</svg>`);

  await sharp(texto)
    .composite([{ input: foto, left: 0, top: 0 }])
    .jpeg({ quality: 86 })
    .toFile(path.resolve("public/og.jpg"));

  console.log("  og.jpg 1200x630");
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const arquivos = (await readdir(ASSETS)).filter((f) => f.endsWith(".jpg")).sort();

  const porCarro = new Map();
  for (const arq of arquivos) {
    const slug = arq.replace(/-\d+\.jpg$/, "");
    if (!porCarro.has(slug)) porCarro.set(slug, []);
    porCarro.get(slug).push(arq);
  }

  console.log(`\n${porCarro.size} carros, ${arquivos.length} fotos originais\n`);

  for (const [slug, fotos] of porCarro) {
    // Foto 0: a capa do cartão e o retrato grande da ficha.
    await emitir({ origem: path.join(ASSETS, fotos[0]), nome: `${slug}-capa`, slot: SLOTS.capa });
    await emitir({ origem: path.join(ASSETS, fotos[0]), nome: `${slug}-retrato`, slot: SLOTS.retrato });

    // As seguintes: a tira da ficha. Cada foto aparece uma vez só na página.
    for (let i = 1; i <= FOTOS_NA_TIRA && i < fotos.length; i++) {
      await emitir({ origem: path.join(ASSETS, fotos[i]), nome: `${slug}-tira-${i}`, slot: SLOTS.tira });
    }
  }

  console.log("\nHerói:");
  await emitir({ origem: path.join(ASSETS, HEROI.arquivo), nome: HEROI.nome, slot: SLOTS.heroi });

  console.log("\nCompartilhamento:");
  await ogImagem();

  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\n${Object.keys(manifest.imagens).length} arquivos gerados, manifesto gravado.\n`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
