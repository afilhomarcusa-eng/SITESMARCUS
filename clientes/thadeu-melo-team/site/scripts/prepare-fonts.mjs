// Os originais em TTF ficam em ../assets/fonts e não são servidos. O site carrega
// woff2, que é o mesmo desenho em cerca de um terço do peso: 271kB viravam bloqueio
// de primeira pintura sem nenhum ganho visual.
import { compress } from "wawoff2";
import { readFile, writeFile } from "node:fs/promises";

const SRC = "../assets/fonts/";
const OUT = "public/fonts/";
for (const name of ["barlow-condensed-extrabold", "manrope-regular", "manrope-bold"]) {
  const ttf = await readFile(SRC + name + ".ttf");
  const woff2 = await compress(ttf);
  await writeFile(OUT + name + ".woff2", Buffer.from(woff2));
  console.log(name.padEnd(28), (ttf.length / 1024).toFixed(0) + "kB ttf ->", (woff2.length / 1024).toFixed(0) + "kB woff2");
}
