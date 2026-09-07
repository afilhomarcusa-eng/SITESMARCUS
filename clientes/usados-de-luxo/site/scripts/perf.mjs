/**
 * Mede LCP, CLS e o peso transferido contra o build de produção.
 *
 *   npm run perf
 *
 * Número medido vale mais que número estimado, e é rápido o suficiente para
 * rodar sempre que a página do topo mudar.
 */

import { chromium } from "playwright";

const BASE = process.env.PERF_BASE ?? "http://127.0.0.1:3210";

const navegador = await chromium.launch();
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
const pagina = await ctx.newPage();

await pagina.goto(BASE, { waitUntil: "networkidle" });
await pagina.waitForTimeout(4500);

const m = await pagina.evaluate(
  () =>
    new Promise((ok) => {
      const fora = { lcp: 0, cls: 0 };
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) fora.lcp = e.startTime;
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

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(`
  LCP   ${Math.round(m.lcp)} ms      (alvo abaixo de 2500)
  CLS   ${m.cls.toFixed(4)}         (alvo abaixo de 0,1)
  DCL   ${Math.round(m.dcl)} ms

  transferido  ${mb(rec.total)} MB
  JavaScript   ${mb(rec.js)} MB
  imagens      ${mb(rec.img)} MB
`);

await navegador.close();
