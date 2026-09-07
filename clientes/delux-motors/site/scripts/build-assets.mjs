/**
 * Pipeline de imagem.
 *
 * Regra que manda: nenhuma imagem sai maior do que entrou. A largura exportada
 * é min(slot * 2, largura nativa). Quando a origem não cobre 2x, sai em 1x e
 * pronto, não existe upscale.
 *
 * O manifesto guarda a dimensão NATIVA de cada origem. O QA compara a caixa
 * desenhada na tela contra esse número, nunca contra o arquivo exportado,
 * porque um pipeline que amplia gera arquivo grande e passaria feliz num teste
 * que olhasse só o export.
 */

import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const ASSETS = path.resolve("../assets");
const OUT = path.resolve("public/images");

/**
 * Larguras de slot, medidas no layout que existe.
 * card    = grade do estoque, 3 colunas em 1920
 * retrato = foto grande da ficha do carro, e o carro do herói
 * fachada = a foto da loja na seção "A loja"
 */
const SLOTS = { card: 500, retrato: 640, fachada: 620 };

const CARROS = ["ram-laramie", "bmw-x4", "corolla-altis", "lexus-nx300", "honda-city"];

const manifest = { geradoEm: new Date().toISOString(), imagens: {} };

async function emitir({ origem, nome, slot }) {
  const meta = await sharp(origem).metadata();
  const nativa = { w: meta.width, h: meta.height };
  const largura = Math.min(slot * 2, nativa.w);
  const saida = path.join(OUT, `${nome}-${largura}.webp`);

  await sharp(origem)
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(saida);

  // Lê de volta o que de fato saiu. Biblioteca de imagem ignora instrução em
  // silêncio, então não dá para confiar no que se pediu.
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
  console.log(
    `  ${nome}-${largura}.webp  nativa ${nativa.w}x${nativa.h}  ->  ${real.width}x${real.height}  (slot ${slot}px)`,
  );
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const arquivos = await readdir(path.join(ASSETS, "carros"));

  console.log("Carros:");
  for (const base of CARROS) {
    const meus = arquivos
      .filter((f) => f.startsWith(`${base}-`) && f.endsWith(".jpg"))
      .sort();
    if (!meus.length) throw new Error(`Nenhuma foto encontrada para ${base}`);

    for (const [i, arq] of meus.entries()) {
      const origem = path.join(ASSETS, "carros", arq);
      // A primeira foto de cada carro é a do cartão da grade, e também a
      // grande da ficha. As outras só aparecem na ficha.
      if (i === 0) await emitir({ origem, nome: `${base}-${i}c`, slot: SLOTS.card });
      await emitir({ origem, nome: `${base}-${i}`, slot: SLOTS.retrato });
    }
  }

  console.log("Fachada:");
  await emitir({
    origem: path.join(ASSETS, "maps-01.jpg"),
    nome: "fachada",
    slot: SLOTS.fachada,
  });

  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\n${Object.keys(manifest.imagens).length} imagens, manifesto gravado.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
