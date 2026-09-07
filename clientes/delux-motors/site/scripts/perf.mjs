/**
 * Mede LCP, CLS e o peso transferido contra o build de produção.
 *
 *   npm run perf
 *
 * Número medido vale mais que número estimado, e é rápido o suficiente para
 * rodar sempre que a página do topo mudar.
 */

import { chromium } from "playwright";

const BASE = process.env.PERF_BASE ?? "http://127.0.0.1:3315";

const navegador = await chromium.launch();
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
const pagina = await ctx.newPage();

await pagina.goto(BASE, { waitUntil: "networkidle" });
await pagina.waitForTimeout(4500);

const m = await pagina.evaluate(
  () =>
    new Promise((ok) => {
      const fora = { lcp: 0, cls: 0, alvo: "" };
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) {
          fora.lcp = e.startTime;
          // Saber QUAL elemento é o LCP muda o conserto: imagem pede
          // prioridade, texto pede fonte, e elemento animado pede sequência
          // mais curta.
          fora.alvo = e.element
            ? `${e.element.tagName.toLowerCase()}${e.element.className ? "." + String(e.element.className).split(" ")[0] : ""}`
            : e.url || "";
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) fora.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      const n = performance.getEntriesByType("navigation")[0];
      setTimeout(() => ok({ ...fora, dcl: n.domContentLoadedEventEnd }), 700);
    }),
);

const rec = await pagina.evaluate(() => {
  const r = performance.getEntriesByType("resource");
  const soma = (f) => r.filter(f).reduce((a, x) => a + (x.transferSize || 0), 0);
  return {
    total: r.reduce((a, x) => a + (x.transferSize || 0), 0),
    js: soma((x) => x.name.endsWith(".js")),
    img: soma((x) => /\.(webp|jpg|png|avif)/.test(x.name)),
  };
});

/**
 * Quando a loja de fato aparece.
 *
 * O LCP do navegador não conta elemento que nasce com opacidade 0, e a foto do
 * herói nasce assim por causa da abertura. O número dele fica bonito e não diz
 * o que o visitante viu. Este aqui diz: mede, em página nova, quanto tempo até
 * a foto estar cheia na tela.
 */
async function tempoAteAparecer(navegador) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto(BASE, { waitUntil: "domcontentloaded" });
  // Espera com requestAnimationFrame, e não com sondagem a cada 50ms. A
  // sondagem soma o custo de cada evaluate e devolve algumas centenas de
  // milissegundos a mais, o que fazia esta medida discordar da do QA.
  await p
    .locator("[data-foto-carro]")
    .evaluate(
      (e) =>
        new Promise((ok) => {
          const ver = () =>
            parseFloat(getComputedStyle(e).opacity) >= 0.95
              ? ok(true)
              : requestAnimationFrame(ver);
          ver();
        }),
      undefined,
      { timeout: 12000 },
    )
    .catch(() => {});
  const ms = Date.now() - t0;
  await ctx.close();
  return ms;
}

const mb = (n) => (n / 1024 / 1024).toFixed(2);
const aparece = await tempoAteAparecer(navegador);

console.log(`
  LCP   ${Math.round(m.lcp)} ms  em ${m.alvo || "?"}   (alvo abaixo de 2500)
  carro na tela, primeira visita da sessão: ${aparece} ms
  CLS   ${m.cls.toFixed(4)}         (alvo abaixo de 0,1)
  DCL   ${Math.round(m.dcl)} ms

  transferido  ${mb(rec.total)} MB
  JavaScript   ${mb(rec.js)} MB
  imagens      ${mb(rec.img)} MB
`);

await navegador.close();
