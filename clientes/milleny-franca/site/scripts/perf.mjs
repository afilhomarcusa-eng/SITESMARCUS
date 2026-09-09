/**
 * Mede LCP, CLS e peso transferido no build de producao, num navegador real.
 * Sem captura de tela: foto congela o compositor e estraga o numero.
 */
import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://127.0.0.1:3210";
const navegador = await chromium.launch();
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, locale: "pt-BR" });
const pag = await ctx.newPage();

let bytes = 0;
const porTipo = {};
pag.on("response", async (r) => {
  try {
    const b = (await r.body()).length;
    bytes += b;
    const t = r.request().resourceType();
    porTipo[t] = (porTipo[t] ?? 0) + b;
  } catch {}
});

await pag.addInitScript(() => {
  window.__lcp = 0;
  window.__cls = 0;
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__lcp = e.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
});

await pag.goto(BASE, { waitUntil: "networkidle" });
await pag.evaluate(async () => {
  const alt = document.body.scrollHeight;
  for (let y = 0; y < alt; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await pag.waitForTimeout(1200);

const m = await pag.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  return {
    lcp: Math.round(window.__lcp),
    cls: Number(window.__cls.toFixed(4)),
    fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0),
    dcl: Math.round(nav?.domContentLoadedEventEnd ?? 0),
    pedidos: performance.getEntriesByType("resource").length,
  };
});

console.log("\nMedido em Chromium headless, rede local, 1440x900, sem throttling:");
console.log(`  LCP        ${m.lcp} ms      (alvo < 2500)`);
console.log(`  CLS        ${m.cls}          (alvo < 0.1)`);
console.log(`  FCP        ${m.fcp} ms`);
console.log(`  DOM pronto ${m.dcl} ms`);
console.log(`  Pedidos    ${m.pedidos}`);
console.log(`  Transferido ${(bytes / 1024).toFixed(0)} kB`);
for (const [t, b] of Object.entries(porTipo).sort((a, c) => c[1] - a[1])) {
  console.log(`    ${t.padEnd(12)} ${(b / 1024).toFixed(0)} kB`);
}

await navegador.close();
if (m.lcp > 2500) { console.error("\nLCP acima do alvo."); process.exit(1); }
if (m.cls > 0.1) { console.error("\nCLS acima do alvo."); process.exit(1); }
