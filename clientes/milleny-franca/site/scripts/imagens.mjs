/**
 * Gera as imagens do site a partir dos originais em ../assets/maps.
 *
 * Regra unica e inegociavel: nenhuma saida e maior que o recorte nativo que a
 * alimenta. Quando a fonte nao cobre 2x, entrega 1x e pronto. O manifesto
 * grava a dimensao NATIVA, porque e contra ela que o QA compara, nunca contra
 * o arquivo exportado.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ORIGEM = path.resolve("../assets/maps");
const DESTINO = path.resolve("public/img");

/**
 * recorte: regiao do original, em fracao (0..1), escolhida a mao depois de
 * olhar cada foto. left/top/width/height.
 */
const trabalhos = [
  {
    entrada: "milleny-livro-rede.jpg",
    saida: "milleny-hero",
    // Retrato inteiro, so tirando o excesso de rede na esquerda.
    recorte: { left: 0.06, top: 0.0, width: 0.94, height: 1.0 },
    larguras: [640, 900, 1200, 1600],
  },
  {
    entrada: "milleny-livro-rede.jpg",
    saida: "milleny-hero-mobile",
    // Enquadramento proprio de celular: rosto e livro, nada de perna.
    recorte: { left: 0.1, top: 0.02, width: 0.9, height: 0.62 },
    larguras: [480, 720, 1080],
  },
  {
    entrada: "milleny-livro-comportamento.jpg",
    saida: "milleny-sobre",
    recorte: { left: 0.14, top: 0.0, width: 0.86, height: 1.0 },
    larguras: [480, 720, 1000],
  },
];

await mkdir(DESTINO, { recursive: true });
const manifesto = [];

for (const t of trabalhos) {
  const origem = path.join(ORIGEM, t.entrada);
  const meta = await sharp(origem).metadata();
  const r = t.recorte;
  const caixa = {
    left: Math.round(meta.width * r.left),
    top: Math.round(meta.height * r.top),
    width: Math.round(meta.width * r.width),
    height: Math.round(meta.height * r.height),
  };

  for (const largura of t.larguras) {
    // Nunca ampliar: a largura pedida e limitada pela largura do recorte.
    const larguraReal = Math.min(largura, caixa.width);
    if (larguraReal < largura) {
      console.warn(
        `  aviso: ${t.saida} pediu ${largura}px e o recorte so tem ${caixa.width}px. Saiu em ${larguraReal}px.`,
      );
    }

    for (const formato of ["avif", "webp"]) {
      const nome = `${t.saida}-${larguraReal}.${formato}`;
      const destino = path.join(DESTINO, nome);
      // extract e resize em chamadas separadas: encadear dois resize faz o
      // sharp aplicar so o ultimo e descartar o recorte sem avisar.
      const buf = await sharp(origem)
        .extract(caixa)
        .resize({ width: larguraReal, withoutEnlargement: true })
        [formato]({ quality: formato === "avif" ? 62 : 80 })
        .toBuffer();
      await writeFile(destino, buf);

      // Le de volta o arquivo real. Nao confia no que foi pedido.
      const conferida = await sharp(destino).metadata();
      manifesto.push({
        arquivo: `/img/${nome}`,
        origem: t.entrada,
        nativaLargura: meta.width,
        nativaAltura: meta.height,
        recorteLargura: caixa.width,
        recorteAltura: caixa.height,
        exportadaLargura: conferida.width,
        exportadaAltura: conferida.height,
        bytes: buf.length,
      });
      console.log(
        `${nome}  ${conferida.width}x${conferida.height}  ${(buf.length / 1024).toFixed(0)}kB  (recorte ${caixa.width}x${caixa.height})`,
      );
    }
  }
}

await writeFile(
  path.join(DESTINO, "manifesto.json"),
  JSON.stringify(manifesto, null, 2),
);
console.log(`\n${manifesto.length} arquivos. Manifesto em public/img/manifesto.json`);
