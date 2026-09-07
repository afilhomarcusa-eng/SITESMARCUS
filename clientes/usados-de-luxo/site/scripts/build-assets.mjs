/**
 * Pipeline de imagem.
 *
 * Regra que manda em tudo aqui: nenhuma imagem sai maior do que entrou.
 * A largura exportada é min(slot * 2, largura nativa). Quando a origem não
 * cobre 2x, sai em 1x e pronto, não existe upscale.
 *
 * O manifesto guarda a dimensão NATIVA de cada origem. O QA compara a caixa
 * desenhada na tela contra esse número, nunca contra o arquivo exportado,
 * porque um pipeline que amplia gera um arquivo grande e passaria feliz num
 * teste que olhasse só o export.
 *
 * Uso: node scripts/build-assets.mjs
 */

import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const ASSETS = path.resolve("../assets");
const OUT = path.resolve("public/images");

/**
 * Cada carro do estoque inicial: post do Instagram -> nome de arquivo.
 * Só entram as fotos limpas de estúdio (o segundo slide de cada post).
 * O primeiro slide é arte de divulgação com preço e texto queimados na imagem,
 * e isso não é fotografia, é banner.
 */
const CARROS = {
  DcwgmbgD8qW: "bmw-m4-coupe",
  DcwfqNHD5Nk: "range-rover-velar",
  Dc1Gf3qkY26: "bmw-320i-m-sport",
  Dct5841j7bT: "ford-ranger-black",
  DcwgDixD8QD: "audi-q3-black-edition",
  Dcwfahpj0jq: "chevrolet-camaro-ss",
  Dc1UtCMEYLf: "gac-gs4-elite-hev",
  Dct39HyDydx: "byd-song-plus-gs",
  Dc331hHAFVX: "chevrolet-s10-lt",
  DczC4X1jxNs: "fiat-pulse-abarth",
  Dct7Rygj6AR: "renault-kardian",
  Dct4kRKDxku: "volkswagen-saveiro-robust",
};

/**
 * Larguras de slot, medidas no layout que já existe.
 * card    = grade do estoque, 3 colunas em 1440
 * retrato = foto grande da página do carro, e o carro do herói
 */
// Medidas tiradas da página renderizada, não chutadas. Em 1920 a casca dá
// 1560px e a coluna do cartão fica em 493px, então o slot é 500, não 460.
const SLOTS = { card: 500, retrato: 720, fachada: 760 };

const manifest = { geradoEm: new Date().toISOString(), imagens: {} };

async function emitir({ origem, nomeSaida, slot, larguras, formatoExtra }) {
  const meta = await sharp(origem).metadata();
  const nativa = { w: meta.width, h: meta.height };

  for (const alvo of larguras) {
    // A lei: nunca acima da nativa.
    const largura = Math.min(alvo, nativa.w);
    const nome = `${nomeSaida}-${alvo}`;

    const base = sharp(origem).resize({ width: largura, withoutEnlargement: true });

    const webp = path.join(OUT, `${nome}.webp`);
    await base.clone().webp({ quality: 82 }).toFile(webp);

    if (formatoExtra) {
      await sharp(origem)
        .resize({ width: largura, withoutEnlargement: true })
        .jpeg({ quality: 84, progressive: true })
        .toFile(path.join(OUT, `${nome}.jpg`));
    }

    // Lê de volta o que de fato saiu. Biblioteca de imagem ignora instrução em
    // silêncio, então não dá para confiar no que se pediu.
    const real = await sharp(webp).metadata();
    if (real.width > nativa.w) {
      throw new Error(
        `${nome}: saiu com ${real.width}px, maior que a nativa ${nativa.w}px. Pipeline ampliou.`,
      );
    }

    manifest.imagens[`${nome}.webp`] = {
      origem: path.basename(origem),
      nativa,
      exportada: { w: real.width, h: real.height },
      slotCss: slot,
    };
    console.log(
      `  ${nome}.webp  nativa ${nativa.w}x${nativa.h}  ->  ${real.width}x${real.height}  (slot ${slot}px)`,
    );
  }
  return nativa;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const arquivos = await readdir(path.join(ASSETS, "carros"));

  console.log("Carros:");
  for (const [postId, nome] of Object.entries(CARROS)) {
    const arq = arquivos.find((f) => f.startsWith(`${postId}-1-`));
    if (!arq) throw new Error(`Faltou a foto limpa do post ${postId}`);
    const origem = path.join(ASSETS, "carros", arq);

    // Card da grade e retrato grande saem do mesmo original, em larguras diferentes.
    await emitir({
      origem,
      nomeSaida: nome,
      slot: SLOTS.card,
      larguras: [SLOTS.card * 2],
    });
    await emitir({
      origem,
      nomeSaida: `${nome}-g`,
      slot: SLOTS.retrato,
      larguras: [SLOTS.retrato * 2],
      formatoExtra: nome === "bmw-m4-coupe",
    });
  }

  // Galeria do carro em destaque. São seis fotos diferentes do mesmo carro,
  // no mesmo estúdio: frente, frente reta, perfil, traseira em ângulo, traseira
  // reta e o interior. Seis ângulos não é a mesma foto seis vezes.
  console.log("Galeria do destaque:");
  for (let i = 0; i <= 5; i++) {
    const arq = arquivos.find((f) => f.startsWith(`m4-slide${i}-`));
    if (!arq) continue;
    await emitir({
      origem: path.join(ASSETS, "carros", arq),
      nomeSaida: `bmw-m4-coupe-${i}`,
      slot: SLOTS.retrato,
      larguras: [SLOTS.retrato * 2],
    });
  }

  console.log("Fachada:");
  await emitir({
    origem: path.join(ASSETS, "maps-01.jpg"),
    nomeSaida: "fachada",
    slot: SLOTS.fachada,
    larguras: [SLOTS.fachada * 2],
  });

  await writeFile(
    path.join(OUT, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`\n${Object.keys(manifest.imagens).length} imagens, manifesto gravado.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
