/**
 * Pipeline de imagem das fotos de semente.
 *
 * A regra que manda: nenhuma imagem sai maior do que entrou. A largura
 * exportada é min(largura pedida, largura nativa). Quando a origem não cobre,
 * sai no tamanho da origem e pronto. Não existe upscale aqui.
 *
 * O manifesto guarda a dimensão NATIVA de cada origem. O QA compara a caixa
 * desenhada na tela contra esse número, e não contra o arquivo exportado: um
 * pipeline que amplia gera arquivo grande e passaria feliz num teste que
 * olhasse só o export, com a foto borrada na tela.
 *
 * Os nomes de saída são iguais aos que a gerência produz quando alguém sobe uma
 * foto em /admin: `<slug>-<indice>-<largura>.webp`. Um formato só para os dois
 * caminhos, senão o site precisaria de dois jeitos de desenhar a mesma coisa.
 *
 *   npm run assets
 */

import sharp from "sharp";
import { mkdir, writeFile, readdir, rm } from "node:fs/promises";
import path from "node:path";

const ASSETS = path.resolve("../assets/carros");
const OUT = path.resolve("public/images");

/**
 * As larguras que o site usa.
 *
 * 420 e 840 servem o cartão da grade (420 css) e a tira da ficha (320 css).
 * 1440 só existe para a primeira foto de cada carro, que é a única desenhada
 * grande: o retrato da ficha, em 720 css.
 */
const LARGURAS = [420, 840];
const LARGURA_GRANDE = 1440;

/** A moldura do site inteiro. Toda foto é recortada para ela. */
const PROPORCAO = 4 / 3;

/** Quantas fotos de cada carro entram no site. A primeira é a capa. */
const FOTOS_POR_CARRO = 6;

const manifest = { geradoEm: new Date().toISOString(), imagens: {} };

async function emitir({ origem, nome, largura }) {
  const meta = await sharp(origem).metadata();
  const nativa = { w: meta.width, h: meta.height };
  // O nome carrega a largura de verdade, e não a pedida: arquivo chamado 1440
  // com mil pixels dentro faz o navegador escolher ele para uma caixa grande e
  // ampliar, e nenhum teste que olhe só o nome percebe.
  const alvo = Math.min(largura, nativa.w, Math.floor(nativa.h / PROPORCAO));
  const altura = Math.round(alvo * PROPORCAO);
  const saida = path.join(OUT, `${nome}-${alvo}.webp`);

  // Um resize só. Encadear extract com resize faz a biblioteca aplicar apenas
  // o último e descartar o recorte, em silêncio.
  await sharp(origem)
    .resize({ width: alvo, height: altura, fit: "cover", position: "centre" })
    .webp({ quality: 82 })
    .toFile(saida);

  // Lê de volta o que de fato saiu, porque pedir não é o mesmo que sair.
  const real = await sharp(saida).metadata();
  if (real.width > nativa.w) {
    throw new Error(
      `${nome}: saiu com ${real.width}px, maior que a nativa ${nativa.w}px. O pipeline ampliou.`,
    );
  }

  manifest.imagens[`${nome}-${alvo}.webp`] = {
    origem: path.basename(origem),
    nativa,
    exportada: { w: real.width, h: real.height },
    larguraPedida: largura,
  };
}

/**
 * A imagem de compartilhamento.
 *
 * Feita da mesma matéria do site: o retrato à esquerda, papel à direita, o nome
 * e a linha de posicionamento. Nada de captura de tela.
 */
async function ogImagem(origem) {
  const LARG = 1200;
  const ALT = 630;
  const fotoLarg = 470;

  const foto = await sharp(origem)
    .resize({ width: fotoLarg, height: ALT, fit: "cover", position: "centre" })
    .toBuffer();

  const texto = Buffer.from(`<svg width="${LARG}" height="${ALT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${LARG}" height="${ALT}" fill="#f4f2ed"/>
  <text x="${fotoLarg + 66}" y="250" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="62" fill="#14140f">Saulo Jordão</text>
  <text x="${fotoLarg + 66}" y="316" font-family="Arial, Helvetica, sans-serif" font-size="38" fill="#4b5345">Premium Cars</text>
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
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const arquivos = (await readdir(ASSETS)).filter((f) => f.endsWith(".jpg")).sort();
  const porCarro = new Map();
  for (const arq of arquivos) {
    const slug = arq.replace(/-\d+\.jpg$/, "");
    if (!porCarro.has(slug)) porCarro.set(slug, []);
    porCarro.get(slug).push(arq);
  }

  console.log(`\n${porCarro.size} carros, ${arquivos.length} fotos de origem\n`);

  for (const [slug, fotos] of porCarro) {
    const usadas = fotos.slice(0, FOTOS_POR_CARRO);
    for (const [i, arq] of usadas.entries()) {
      const origem = path.join(ASSETS, arq);
      for (const largura of LARGURAS) {
        await emitir({ origem, nome: `${slug}-${i}`, largura });
      }
      // Só a primeira foto de cada carro é desenhada grande.
      if (i === 0) await emitir({ origem, nome: `${slug}-${i}`, largura: LARGURA_GRANDE });
    }
    console.log(`  ${slug.padEnd(22)} ${usadas.length} fotos`);
  }

  console.log("\nCompartilhamento:");
  await ogImagem(path.join(ASSETS, "corvette-stingray-00.jpg"));

  const retrato = path.resolve("../assets/saulo-original.jpg");
  for(const largura of [420,840]){
    const nome = "saulo-" + largura + ".webp";
    await sharp(retrato).extract({left:0,top:300,width:900,height:1200}).resize({width:largura,withoutEnlargement:true}).webp({quality:86}).toFile(path.join(OUT,nome));
    manifest.imagens[nome]={origem:"saulo-original.jpg",nativa:{w:900,h:1200},exportada:{w:largura,h:Math.round(largura*4/3)},larguraPedida:largura};
  }
  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\n${Object.keys(manifest.imagens).length} arquivos gerados, manifesto gravado.\n`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
