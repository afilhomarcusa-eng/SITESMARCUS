// Gera as imagens do site. A regra é uma só: nenhum arquivo sai maior do que a
// origem. A versão anterior ampliava um negativo de 850x566 até 1700px e o
// resultado era o que estava na tela, borrado e repetido, porque toda a página
// vinha de recortes daquela mesma foto.
//
// Agora cada seção tem a sua foto, cada foto vem de um arquivo próprio, e a
// largura de saída é `min(css * 2, largura nativa do recorte)`. Quando a origem
// não dá conta do dobro, o arquivo sai no tamanho nativo e o layout aceita isso
// em vez de esticar. O `manifest.json` guarda a conta para o qa conferir.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const OUT = "public/images/";

// Tratamento comum: a saturação cede um pouco e a imagem encosta no petróleo da
// marca. Leve, porque agora existe nitidez de verdade para preservar.
const grade = (pipe) => pipe.modulate({ saturation: 0.86, brightness: 1.02 }).linear(1.04, -5)
  .recomb([[0.96, 0.02, 0.02], [0.01, 0.98, 0.01], [0.02, 0.03, 0.97]]);

// `css` é a maior largura, em pixels de layout, que a foto ocupa no site.
// `ratio` é a proporção do recorte, casada com a caixa onde ela é desenhada.
// `crop` escolhe a região do enquadramento quando a proporção pede corte.
const photos = {
  // herói: o painel vertical inteiro da primeira dobra. É a foto de melhor
  // resolução do conjunto, e a proporção 0.8 cobre tanto tela baixa quanto alta
  // sem o `cover` precisar ampliar em nenhuma das duas.
  "orla-corrida": { src: "corrida-atlet-original.jpeg", css: 800, ratio: 0.8, crop: "center" },
  // 01 / o clube: a coluna da esquerda é alta, então a foto é vertical
  "pista-vertical": { src: "unit-IMG-9-1.png", css: 330, ratio: 3 / 4, crop: "attention" },
  // 02 / onde treinamos: o retrato ao lado do título
  "pista-dupla": { src: "unit-IMG-2-1.png", css: 350, ratio: 350 / 286, crop: "attention" },
  // 03 / feito de gente: o quadro grande da seção
  "pista-grupo": { src: "unit-IMG-3-1.png", css: 820, ratio: 820 / 600, crop: "attention" },
  // 03 / o quadro pequeno: a única foto do próprio clube que existe hoje
  "equipe-2018": { src: "equipe-corrida-2018.jpg", css: 210, ratio: 210 / 150, crop: "center" },
  // 04 / dúvidas: o retrato que fecha a coluna
  "pista-solo": { src: "unit-IMG-7-1.png", css: 252, ratio: 252 / 162, crop: "attention" },
  // /cadastro: o retrato ao lado do título do formulário
  "pista-largada": { src: "unit-desafio-2024.png", css: 320, ratio: 320 / 230, crop: "attention" },
};


const manifest = [];
for (const [name, item] of Object.entries(photos)) {
  const source = sharp("../assets/" + item.src).rotate();
  const meta = await source.metadata();

  // O recorte é o maior retângulo na proporção pedida que cabe no original.
  const box = meta.width / meta.height > item.ratio
    ? { width: Math.round(meta.height * item.ratio), height: meta.height }
    : { width: meta.width, height: Math.round(meta.width / item.ratio) };

  // Recorte e redução na mesma chamada: o sharp só honra o último `resize` da
  // cadeia, então dois em sequência descartariam o enquadramento.
  const width = Math.min(item.css * 2, box.width);
  const scale = width / box.width;
  const pipe = grade(sharp("../assets/" + item.src).rotate()
    .resize({ width, height: Math.round(width / item.ratio), fit: "cover", position: item.crop, kernel: "lanczos3", withoutEnlargement: true }));
  // A máscara de nitidez só entra quando houve redução, que é onde ela devolve
  // acutância. Em escala 1 ela só criaria halo.
  const buffer = await (scale < 0.98 ? pipe.sharpen({ sigma: 0.7, m1: 0.4, m2: 1.6 }) : pipe)
    .webp({ quality: 90, effort: 6, smartSubsample: true }).toBuffer();
  await writeFile(OUT + name + ".webp", buffer);

  const out = await sharp(buffer).metadata();
  manifest.push({
    name, file: "/images/" + name + ".webp", source: item.src,
    native: meta.width + "x" + meta.height, width: out.width, height: out.height,
    css: item.css, cover: +(out.width / item.css).toFixed(2), kB: Math.round(buffer.length / 1024),
  });
}
await writeFile(OUT + "manifest.json", JSON.stringify(manifest, null, 2) + "\n");

// O grão era um SVG com feTurbulence aplicado como background-image. Sem largura
// intrínseca, ele esticava até o tamanho do elemento e o filtro era rasterizado
// de novo a cada quadro em que a cena do herói se mexia: sozinho, respondia por
// quase metade do custo de rolagem ali. Virou um ladrilho rasterizado uma vez.
const LADRILHO = 128;
const ruido = Buffer.alloc(LADRILHO * LADRILHO);
for (let i = 0; i < ruido.length; i++) ruido[i] = 118 + Math.round(Math.random() * 137);
await sharp(ruido, { raw: { width: LADRILHO, height: LADRILHO, channels: 1 } })
  .webp({ lossless: true, effort: 6 }).toFile(OUT + "grain.webp");

const lanes = (n, ox, oy, w, sw) => Array.from({ length: n }, (_, i) =>
  `<path d="M ${ox + i * 27} ${oy + 900} V ${oy + 300} C ${ox + i * 27} ${oy - 60}, ${ox + w - i * 27} ${oy - 60}, ${ox + w - i * 27} ${oy + 300} V ${oy + 900}" stroke="#e8f05b" stroke-width="${sw}" fill="none"/>`).join("");

// A capa social monta a partir de um recorte próprio, no tamanho exato do lugar
// que ele ocupa dentro do cartão. Assim o embed não carrega o mestre inteiro.
const cover = await grade(sharp("../assets/" + photos["equipe-2018"].src).rotate()
  .resize({ width: 700, height: 330, fit: "cover", position: "attention", kernel: "lanczos3" }))
  .sharpen({ sigma: 0.7, m1: 0.4, m2: 1.6 }).webp({ quality: 90 }).toBuffer();

const og = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<rect width="1200" height="630" fill="#153f43"/>
<g opacity=".16">${lanes(7, 690, -170, 560, 2)}</g>
<image href="data:image/webp;base64,${cover.toString("base64")}" x="590" y="152" width="700" height="330" opacity=".92" preserveAspectRatio="xMidYMid slice"/>
<rect x="590" y="152" width="700" height="330" fill="#153f43" opacity=".18"/>
<text x="58" y="272" fill="#f3f1e8" font-family="Arial Narrow, Arial" font-size="196" font-weight="900" letter-spacing="-11">BORA</text>
<text x="52" y="446" fill="#e8f05b" font-family="Arial Narrow, Arial" font-size="196" font-weight="900" letter-spacing="-11">CORRER.</text>
<text x="60" y="74" fill="#f3f1e8" font-family="Arial" font-weight="bold" font-size="18" letter-spacing="3.4">THADEU MELO TEAM / ARACAJU</text>
<rect y="566" width="1200" height="64" fill="#e8f05b"/>
<text x="58" y="609" font-family="Arial" font-weight="bold" font-size="25" fill="#153f43" letter-spacing="1">A CIDADE É A NOSSA PISTA.</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile(OUT + "og-cover.jpg");

for (const item of manifest) {
  console.log(item.name.padEnd(14), (item.width + "x" + item.height).padEnd(10),
    ("nativo " + item.native).padEnd(20), ("caixa " + item.css + "px").padEnd(13),
    "x" + item.cover, item.kB + "kB");
}
