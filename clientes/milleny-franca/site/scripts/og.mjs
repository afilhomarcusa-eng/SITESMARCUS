/** Gera a imagem de Open Graph a partir do mesmo retrato e da mesma paleta. */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const W = 1200, H = 630;

const fundo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#f6f0e6"/>
  <path d="M-20 520 C 160 520, 200 380, 380 400 S 640 470, 820 400" fill="none"
        stroke="#ded1bd" stroke-width="4" stroke-dasharray="10 15" stroke-linecap="round"/>
  <circle cx="92" cy="118" r="26" fill="#e0a33a"/>
  <g stroke="#e0a33a" stroke-width="6" stroke-linecap="round">
    <path d="M92 62v14M92 160v14M38 118h14M132 118h14M54 80l10 10M120 146l10 10M130 80l-10 10M64 146l-10 10"/>
  </g>
  <text x="72" y="266" font-family="Georgia, serif" font-size="70" font-weight="700" fill="#2e2620">Milleny França</text>
  <text x="72" y="332" font-family="Georgia, serif" font-size="70" font-weight="700" fill="#1f43b0">Psicóloga infantil</text>
  <text x="74" y="404" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#5d5045" letter-spacing="1.5">Intervenção precoce  ·  Jardins, Aracaju, SE</text>
  <text x="74" y="452" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#8b7d70" letter-spacing="1.5">CRP 19/3459</text>
  <rect x="74" y="506" width="292" height="66" rx="33" fill="#e2624a"/>
  <text x="220" y="548" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff">Agendar um horário</text>
</svg>`);

// retrato mascarado num arco, do lado direito
const larguraFoto = 430;
const foto = await sharp("../assets/maps/milleny-livro-rede.jpg")
  .extract({ left: 300, top: 60, width: 3200, height: 3400 })
  .resize({ width: larguraFoto, height: H, fit: "cover", position: "top" })
  .toBuffer();

const mascara = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${larguraFoto}" height="${H}">
  <rect width="${larguraFoto}" height="${H}" rx="0"/>
</svg>`);

const recortada = await sharp(foto)
  .composite([{ input: mascara, blend: "dest-in" }])
  .png()
  .toBuffer();

const img = await sharp(fundo)
  .composite([{ input: recortada, left: W - larguraFoto - 40, top: 0 }])
  .png()
  .toBuffer();

await writeFile("public/og.png", img);
const m = await sharp("public/og.png").metadata();
console.log(`public/og.png ${m.width}x${m.height} ${(img.length / 1024).toFixed(0)}kB`);
