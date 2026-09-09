// QA do site. Sobe contra o servidor em 127.0.0.1:3012 (npm run build && npm start).
// Falha em qualquer erro de console, estouro horizontal, link quebrado, conteúdo
// preso invisível, travessão na copy ou cortina repetida.
import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const BASE = "http://127.0.0.1:3012";
// O numero do clube mora em lib/content.ts. Aqui ele e repetido de proposito:
// se alguem trocar so um dos dois, o qa reprova em vez de deixar passar.
const WHATSAPP = "https://wa.me/5579998276343";
const manifest = JSON.parse(await readFile("public/images/manifest.json", "utf8"));
await mkdir("qa-output", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const errors = [];
page.on("pageerror", e => errors.push("pageerror: " + e.message));
page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
page.on("response", r => { if (r.url().startsWith(BASE) && r.status() >= 400) errors.push(r.status() + " " + r.url()); });

await page.addInitScript(() => {
  window.__metrics = { lcp: 0, cls: 0 };
  new PerformanceObserver(list => list.getEntries().forEach(e => { window.__metrics.lcp = e.startTime; })).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.__metrics.cls += e.value; })).observe({ type: "layout-shift", buffered: true });
});

// Percorre a página inteira antes de fotografar, para o retrato ser o real.
const walk = (target) => target.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo({ top: y, behavior: "instant" }); await new Promise(r => requestAnimationFrame(r)); }
  scrollTo({ top: 0, behavior: "instant" });
});

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(3200);
await walk(page);
await page.waitForTimeout(700);
await page.screenshot({ path: "qa-output/desktop-1440.png", fullPage: true });

const viewports = [];
for (const width of [360, 390, 430, 768, 1024, 1280, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await walk(page);
  await page.waitForTimeout(500);

  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "Estouro horizontal em " + width);
  assert.equal(await page.locator("h1").count(), 1);
  const broken = await page.locator("img").evaluateAll(imgs => imgs.filter(i => i.loading !== "lazy" && (!i.complete || i.naturalWidth === 0)).map(i => i.src));
  assert.deepEqual(broken, [], "Imagem quebrada em " + width);

  // Nada pode ficar preso invisível depois que a página inteira foi percorrida.
  const hidden = await page.locator("[data-reveal]").evaluateAll(list => list.filter(el => !el.classList.contains("is-in")).map(el => el.className));
  assert.deepEqual(hidden, [], "Revelação presa em " + width);

  viewports.push({ width, heading: await page.locator("h1").innerText() });
  if ([390, 768, 1920].includes(width)) await page.screenshot({ path: "qa-output/screen-" + width + ".png", fullPage: true });
}

// Menu, agenda e FAQ no celular
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Menu", exact: true }).click();
await page.getByRole("navigation").getByRole("link", { name: "Onde treinamos" }).waitFor({ state: "visible" });
await page.screenshot({ path: "qa-output/mobile-menu.png" });
await page.keyboard.press("Escape");
assert.equal(await page.getByRole("button", { name: "Menu", exact: true }).getAttribute("aria-expanded"), "false");

for (const [name, expected] of [["Orla de Atalaia", "4h30 às 6h30"], ["Sementeira", "5h às 7h"], ["13 de Julho", "17h às 20h"]]) {
  await page.getByRole("button", { name: new RegExp(name) }).click();
  await page.getByText(expected, { exact: true }).waitFor({ state: "visible" });
  const map = await page.locator(".schedule-info a").getAttribute("href");
  assert.ok(map.startsWith("https://www.google.com/maps/search/?api=1&query="));
}
await page.locator("summary").first().click();
assert.equal(await page.locator("details").first().getAttribute("open"), "");
await walk(page);
await page.screenshot({ path: "qa-output/mobile-schedule.png", fullPage: true });

// Nenhuma foto pode ser pedida acima do arquivo que existe: e o que deixava a
// imagem borrada. Margem de 6% cobre arredondamento de layout.
// `naturalWidth` no <img> vem corrigido pela densidade do srcset, entao nao serve
// de medida. O arquivo real e medido recarregando a mesma URL sem srcset.
const stretched = await page.evaluate(async () => {
  const out = [];
  for (const img of document.images) {
    if (!img.currentSrc || !img.getBoundingClientRect().width) continue;
    const probe = new Image();
    probe.src = img.currentSrc;
    await probe.decode().catch(() => {});
    const css = img.getBoundingClientRect().width;
    if (probe.naturalWidth && probe.naturalWidth < css * 0.94) {
      out.push(decodeURIComponent(img.currentSrc).replace(/.*\/images\//, "").replace(/&q=.*/, "")
        + " entregue com " + probe.naturalWidth + "px para " + Math.round(css) + "px de layout");
    }
  }
  return out;
});
assert.deepEqual(stretched, [], "Imagem esticada acima do arquivo");

// A checagem acima compara o arquivo entregue com a caixa. Ela nao pegava o bug
// de verdade: o arquivo era grande porque o gerador ampliava um negativo de
// 850px. O manifesto guarda a origem, entao a conta agora e contra o nativo.
const desenhadas = await page.evaluate(() => [...document.images]
  .filter(img => img.getBoundingClientRect().width)
  .map(img => ({ src: decodeURIComponent(img.currentSrc || img.src), css: img.getBoundingClientRect().width })));
const acimaDoNativo = [];
const usadas = [];
for (const item of desenhadas) {
  const entry = manifest.find(m => item.src.includes(m.file));
  if (!entry) continue;
  usadas.push(entry.name);
  const nativa = Number(entry.native.split("x")[0]);
  if (nativa < item.css * 0.94) acimaDoNativo.push(entry.name + ": origem de " + nativa + "px para " + Math.round(item.css) + "px de layout");
}
assert.deepEqual(acimaDoNativo, [], "Foto desenhada acima da origem que existe");
assert.equal(usadas.length >= 4, true, "Poucas fotos na pagina: " + usadas.length);
// A pagina inteira vinha de recortes da mesma foto. Cada uma aparece uma vez.
assert.deepEqual(usadas.filter((name, i) => usadas.indexOf(name) !== i), [], "Foto repetida na pagina");

const metrics = await page.evaluate(() => window.__metrics);
const allText = await page.locator("body").innerText();
assert.equal(/[—–]/.test(allText), false, "Travessão na copy");
assert.equal(/Lorem ipsum|placeholder|Saiba more|Discover|Book now/i.test(allText), false, "Placeholder ou inglês na copy");
assert.equal(/\b(\w+)\s+\1\b/i.test(allText.replace(/\n/g, " ")), false, "Palavra duplicada na copy");

const invalidAnchors = await page.locator('a[href^="#"]').evaluateAll(list => list.filter(a => !document.querySelector(a.getAttribute("href"))).map(a => a.getAttribute("href")));
assert.deepEqual(invalidAnchors, [], "Âncora quebrada");
const external = await page.locator('a[target="_blank"]').evaluateAll(list => list.filter(a => !a.rel.includes("noopener")).map(a => a.href));
assert.deepEqual(external, [], "Link externo sem noopener");
const social = await page.locator('a[href*="instagram.com"]').evaluateAll(list => list.every(a => a.href === "https://www.instagram.com/thadeumeloteam/"));
assert.equal(social, true);

// Conversa comeca no WhatsApp, e num numero so. O Instagram fica so para seguir.
const wa = await page.locator('a[href*="wa.me"]').evaluateAll(list => list.map(a => a.href));
assert.ok(wa.length >= 4, "Poucos CTAs de WhatsApp: " + wa.length);
assert.equal(new Set(wa).size, 1, "Mais de um destino de WhatsApp na pagina");
// O numero tinha doze digitos: faltava um. Todo CTA precisa levar o numero
// inteiro e ja com a primeira mensagem escrita.
assert.ok(wa[0].startsWith(WHATSAPP + "?text="), "WhatsApp fora do numero do clube: " + wa[0]);
assert.ok(decodeURIComponent(wa[0]).includes("Thadeu Melo Team"), "CTA sem mensagem inicial");
for (const [selector, label] of [[".header-cta", "CTA do cabecalho"], [".hero-alt", "segunda acao do heroi"], [".final-bottom .button", "CTA do fim"]]) {
  assert.equal(await page.locator(selector).getAttribute("href"), wa[0], label + " nao vai para o WhatsApp");
}

// A pagina de cadastro: ela existe, monta a mensagem com o numero do clube e
// carrega sem erro nas duas pontas de largura.
for (const largura of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: largura, height: 900 } });
  const form = await ctx.newPage();
  const falhas = [];
  form.on("pageerror", e => falhas.push("pageerror: " + e.message));
  form.on("console", m => { if (m.type() === "error") falhas.push("console: " + m.text()); });
  await form.goto(BASE + "/cadastro", { waitUntil: "networkidle" });
  assert.equal(await form.locator("h1").count(), 1, "Cadastro sem titulo em " + largura);
  assert.equal(await form.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "Estouro horizontal no cadastro em " + largura);
  for (const campo of ["nome", "telefone", "nivel", "objetivo", "local", "periodo"]) {
    assert.ok(await form.locator('[name="' + campo + '"]').count() > 0, "Campo " + campo + " sumiu do cadastro");
  }
  await form.fill('[name="nome"]', "Teste QA");
  await form.fill('[name="telefone"]', "79999999999");
  await form.locator('input[name="local"][value="Orla de Atalaia"]').check();
  const [conversa] = await Promise.all([
    form.waitForEvent("popup", { timeout: 15000 }),
    form.locator(".signup-form button[type=submit]").click(),
  ]);
  // O wa.me redireciona para o api.whatsapp.com, que reescreve espaco como "+".
  const destino = decodeURIComponent(conversa.url()).replace(/\+/g, " ");
  assert.match(destino, /5579998276343/, "Formulario abriu numero errado");
  assert.match(destino, /Teste QA/, "Formulario nao levou o nome");
  assert.match(destino, /Orla de Atalaia/, "Formulario nao levou o local escolhido");
  assert.deepEqual(falhas, [], "Erro de console no cadastro em " + largura);
  await ctx.close();
}

// O CTA de cadastro precisa estar visível e clicável desde o primeiro quadro,
// com cortina no ar ou sem ela. 2200ms e o instante em que a cortina comeca a
// subir; dali em diante ele nao pode estar apagado nem um quadro.
for (const espera of [2200, 2600, 3400]) {
  const cadastro = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const cadastroPage = await cadastro.newPage();
  await cadastroPage.goto(BASE, { waitUntil: "domcontentloaded" });
  await cadastroPage.waitForTimeout(espera);
  const cta = cadastroPage.locator(".hero-actions .button");
  const opacidade = await cta.evaluate(el => {
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const value = Number(getComputedStyle(node).opacity);
      if (value < 0.99) return value;
    }
    return 1;
  });
  assert.ok(opacidade > 0.99, "CTA de cadastro invisível em " + espera + "ms (opacidade " + opacidade + ")");
  await cta.click();
  await cadastroPage.waitForURL(/\/cadastro$/, { timeout: 15000 });
  assert.equal(await cadastroPage.locator(".signup-form").count(), 1, "CTA de cadastro nao abriu o formulario em " + espera + "ms");
  await cadastro.close();
}

// Cortina: uma vez por sessão, e some ao primeiro gesto
assert.equal(await page.evaluate(() => document.documentElement.dataset.intro), undefined);
await page.reload({ waitUntil: "domcontentloaded" });
assert.equal(await page.evaluate(() => document.documentElement.dataset.intro), undefined, "Cortina repetiu na sessão");
const fresh = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const freshPage = await fresh.newPage();
await freshPage.goto(BASE, { waitUntil: "domcontentloaded" });
assert.equal(await freshPage.evaluate(() => document.documentElement.dataset.intro), "play", "Cortina não entrou");
await freshPage.mouse.wheel(0, 40);
await freshPage.waitForTimeout(500);
assert.equal(await freshPage.evaluate(() => document.documentElement.dataset.intro), undefined, "Cortina não saiu com o gesto");

// Movimento reduzido
const reduced = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
const reducedPage = await reduced.newPage();
await reducedPage.goto(BASE, { waitUntil: "networkidle" });
assert.equal(await reducedPage.locator(".intro").isVisible(), false, "Cortina apareceu com movimento reduzido");
assert.equal(await reducedPage.locator("#club-title").isVisible(), true);
await reducedPage.screenshot({ path: "qa-output/reduced-motion.png", fullPage: true });

// Sem JavaScript
const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
const nojsPage = await nojs.newPage();
await nojsPage.goto(BASE);
assert.equal(await nojsPage.locator("h1").isVisible(), true);
assert.equal(await nojsPage.locator("#club-title").isVisible(), true, "Título escondido sem JavaScript");
assert.equal(await nojsPage.locator(".nojs-schedule").isVisible(), true);
assert.equal(await nojsPage.locator(".intro").isVisible(), false);

assert.deepEqual(errors, [], "Erros no console");
await writeFile("qa-output/results.json", JSON.stringify({ viewports, metrics, errors, checks: [
  "sem estouro horizontal", "sem imagem quebrada", "sem revelação presa", "menu com Escape",
  "três agendas", "mapas reais", "FAQ", "âncoras", "links externos com noopener", "Instagram único",
  "WhatsApp único e completo em todo CTA", "nenhuma imagem esticada", "formulário de cadastro",
  "nenhuma foto acima da origem", "nenhuma foto repetida", "CTA de cadastro visível e clicável",
  "sem travessão", "sem palavra duplicada", "cortina uma vez por sessão", "cortina sai ao gesto",
  "movimento reduzido", "sem JavaScript"
] }, null, 2));
console.log(JSON.stringify({ viewports, metrics, errors }));
await browser.close();
