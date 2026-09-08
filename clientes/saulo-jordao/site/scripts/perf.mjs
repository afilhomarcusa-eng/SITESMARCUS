/**
 * Mede LCP, CLS e o peso transferido contra o build de produção.
 *
 *   npm run build && npm start   (numa janela)
 *   npm run perf                 (noutra)
 *
 * Número medido vale mais que número estimado. E a medida é contra o build,
 * nunca contra o dev: em desenvolvimento nada é minificado e a conta é outra.
 */

import { chromium } from "playwright";

const BASE = process.env.PERF_BASE ?? "http://127.0.0.1:3014";

const navegador = await chromium.launch();
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
const pagina = await ctx.newPage();

await pagina.goto(BASE, { waitUntil: "networkidle" });
await pagina.waitForTimeout(4000);

const m = await pagina.evaluate(
  () =>
    new Promise((ok) => {
      const fora = { lcp: 0, cls: 0, alvo: "" };
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          fora.lcp = e.startTime;
          // Saber QUAL elemento é o LCP muda o conserto: imagem pede
          // prioridade, texto pede fonte, elemento animado pede sequência mais
          // curta.
          fora.alvo = e.element
            ? `${e.element.tagName.toLowerCase()}${
                e.element.className ? "." + String(e.element.className).split(" ")[0] : ""
              }`
            : e.url || "";
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) fora.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      const n = performance.getEntriesByType("navigation")[0];
      setTimeout(() => ok({ ...fora, dcl: n.domContentLoadedEventEnd }), 600);
    }),
);

const rec = await pagina.evaluate(() => {
  const r = performance.getEntriesByType("resource");
  const soma = (f) => r.filter(f).reduce((a, x) => a + (x.transferSize || 0), 0);
  return {
    total: r.reduce((a, x) => a + (x.transferSize || 0), 0),
    js: soma((x) => x.name.endsWith(".js")),
    css: soma((x) => x.name.endsWith(".css")),
    img: soma((x) => /\.(webp|jpg|png|avif)/.test(x.name)),
    fontes: soma((x) => /\.(woff2?|ttf)/.test(x.name)),
  };
});

/**
 * Quando o carro de fato aparece, numa visita nova.
 *
 * A abertura roda em cima do conteúdo, não no lugar dele, então o LCP do
 * navegador já conta a foto pintada no primeiro quadro. Esta medida é a outra
 * metade da verdade: quanto tempo até a cortina sair e o visitante ver o carro.
 */
async function tempoAteVer() {
  const c = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  const t0 = Date.now();
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  await p
    .locator("[data-foto-heroi]")
    .evaluate(
      (e) =>
        new Promise((ok) => {
          // requestAnimationFrame, e não sondagem a cada 50ms: a sondagem soma o
          // custo de cada medição e devolve algumas centenas de ms a mais.
          // Geometria, não hit-test. elementFromPoint responde por
          // pointer-events, e a cortina abre mão do clique antes de sair da
          // frente: medir por ali daria um número bonito e errado.
          const cobre = (alvo, ponto) => {
            const r = alvo.getBoundingClientRect();
            return (
              r.width > 0 &&
              r.height > 0 &&
              getComputedStyle(alvo).visibility === "visible" &&
              ponto.x >= r.left &&
              ponto.x <= r.right &&
              ponto.y >= r.top &&
              ponto.y <= r.bottom
            );
          };
          const ver = () => {
            const r = e.getBoundingClientRect();
            const ponto = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
            const camadas = [...document.querySelectorAll(".cortina-chapa, .folha")];
            return camadas.some((c) => cobre(c, ponto))
              ? requestAnimationFrame(ver)
              : ok(true);
          };
          ver();
        }),
      undefined,
      { timeout: 15000 },
    )
    .catch(() => {});
  const ms = Date.now() - t0;
  await c.close();
  return ms;
}

const kb = (n) => (n / 1024).toFixed(0) + " KB";
const aparece = await tempoAteVer();

console.log(`
  LCP   ${Math.round(m.lcp)} ms  em ${m.alvo || "?"}   (alvo abaixo de 2500)
  CLS   ${m.cls.toFixed(4)}                (alvo abaixo de 0,1)
  DCL   ${Math.round(m.dcl)} ms

  carro na tela, primeira visita da sessão: ${aparece} ms

  transferido  ${kb(rec.total)}
  JavaScript   ${kb(rec.js)}
  CSS          ${kb(rec.css)}
  fontes       ${kb(rec.fontes)}
  imagens      ${kb(rec.img)}
`);

await navegador.close();
