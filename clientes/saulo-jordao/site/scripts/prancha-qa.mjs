/**
 * Corta uma captura de página inteira em pedaços de uma tela e põe lado a lado.
 * É assim que se olha o site seção por seção, em vez de olhar a home inteira
 * reduzida, onde nenhum defeito de celular aparece.
 *
 *   node scripts/prancha-qa.mjs qa/1440-home.png saida.png 860
 */
import sharp from "sharp";

const [entrada, saida, alturaTela = "860"] = process.argv.slice(2);
const tela = Number(alturaTela);

const img = sharp(entrada);
const meta = await img.metadata();
const pedacos = Math.ceil(meta.height / tela);
const escala = 0.42;
const larg = Math.round(meta.width * escala);
const alt = Math.round(tela * escala);

const comps = [];
for (let i = 0; i < pedacos; i++) {
  const altura = Math.min(tela, meta.height - i * tela);
  const buf = await sharp(entrada)
    .extract({ left: 0, top: i * tela, width: meta.width, height: altura })
    .resize({ width: larg })
    .toBuffer();
  comps.push({ input: buf, left: i * (larg + 8), top: 0 });
}

await sharp({
  create: {
    width: pedacos * (larg + 8),
    height: alt + 8,
    channels: 3,
    background: "#999999",
  },
})
  .composite(comps)
  .png()
  .toFile(saida);

console.log(`${pedacos} telas de ${meta.width}x${meta.height} em ${saida}`);
