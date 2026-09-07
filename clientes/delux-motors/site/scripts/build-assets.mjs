/**
 * Pipeline de imagem.
 *
 * Regra que manda: nenhuma imagem sai maior do que entrou. A largura exportada
 * é min(slot * 2, largura nativa). Quando a origem não cobre 2x, sai em 1x e
 * pronto, não existe upscale.
 *
 * Este projeto tem exatamente uma fotografia real, a da fachada, em 1200x1600.
 * Ela é servida em 1200, ou seja 1x, e a composição do herói foi desenhada em
 * cima disso: o bloco tem no máximo 1200px, e o que sobra dos lados é céu de
 * verdade, desenhado em shader. O contrário, esticar a foto para preencher a
 * tela, entregaria borrão em qualquer monitor grande.
 *
 * O manifesto guarda a dimensão NATIVA de cada origem. O QA compara a caixa
 * desenhada na tela contra esse número, nunca contra o arquivo exportado,
 * porque um pipeline que amplia gera arquivo grande e passaria feliz num teste
 * que olhasse só o export.
 */

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ASSETS = path.resolve("../assets");
const OUT = path.resolve("public/images");

const manifest = { geradoEm: new Date().toISOString(), imagens: {} };

async function emitir({ origem, nome, slot }) {
  const meta = await sharp(origem).metadata();
  const nativa = { w: meta.width, h: meta.height };
  const largura = Math.min(slot * 2, nativa.w);

  const saida = path.join(OUT, `${nome}-${largura}.webp`);
  await sharp(origem)
    .resize({ width: largura, withoutEnlargement: true })
    .webp({ quality: 84 })
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

  console.log("Fachada:");
  await emitir({
    origem: path.join(ASSETS, "maps-01.jpg"),
    nome: "fachada",
    // O bloco no herói tem no máximo 1200px de largura, e a origem tem 1200.
    // min(1200*2, 1200) = 1200, então sai em 1x, de propósito.
    slot: 1200,
  });

  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\n${Object.keys(manifest.imagens).length} imagem, manifesto gravado.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
