import { chromium } from "playwright";
const browser = await chromium.launch();
for (const width of [390, 430, 768, 1024, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.addInitScript(() => sessionStorage.setItem("sj:abriu", "1"));
  await page.goto("http://127.0.0.1:3014", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  const result = await page.evaluate(() => {
    const actions = document.querySelector(".hero-actions")?.getBoundingClientRect();
    const image = document.querySelector(".hero-visual")?.getBoundingClientRect();
    return { scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth, gap: actions && image ? Math.round(image.top - actions.bottom) : null };
  });
  console.log(width, result, "errors", errors.length);
  if (width === 390 || width === 1440) {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .75) {
        scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `.tmp-${width}.png`, fullPage: true });
  }
  await context.close();
}
await browser.close();
