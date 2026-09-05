"use client";
import { useEffect, useRef } from "react";

const glyphs = [{ x: 25, width: 150 }, { x: 495, width: 35 }, { x: 638, width: 128 }, { x: 816, width: 152 }, { x: 1044, width: 132 }];
const trajectory = "M319 157 C294 170 273 194 271 218 C265 185 266 118 270 86 C298 70 340 76 356 91 C385 117 365 144 324 151 C366 140 390 166 378 198 C365 232 312 239 293 211 C276 185 307 155 342 155";
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => n * n * (3 - 2 * n);
const part = (time: number, start: number, duration: number) => ease(clamp((time - start) / duration));

export function BrandOpening() {
  const opening = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = opening.current;
    const root = document.documentElement;
    if (!el || !root.hasAttribute("data-opening")) return;
    const content = document.querySelector<HTMLElement>("[data-opening-content]");
    const screen = el.querySelector<SVGSVGElement>(".opening-screen")!;
    const logo = el.querySelector<SVGSVGElement>(".opening-logo")!;
    const symbol = el.querySelector<SVGGElement>(".opening-symbol")!;
    const path = el.querySelector<SVGPathElement>(".opening-trajectory")!;
    const dot = el.querySelector<SVGCircleElement>(".opening-dot")!;
    const bMask = el.querySelector<SVGRectElement>("#opening-b rect")!;
    const masks = [...el.querySelectorAll<SVGRectElement>(".opening-glyph-mask")];
    const subtitle = el.querySelector<SVGRectElement>("#opening-subtitle rect")!;
    const aperture = el.querySelector<SVGRectElement>(".opening-aperture")!;
    const bridge = el.querySelector<SVGPathElement>(".opening-bridge")!;
    const lead = el.querySelector<SVGCircleElement>(".opening-lead")!;
    const rule = el.querySelector<SVGPathElement>(".opening-rule")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    let frame = 0, handoff = -1;
    let stopped = false, ready = false, shown = false;
    let width = 0, height = 0, originX = 0, originY = 0, targetY = 0, bridgeLength = 0, scale = 1.8;
    const previousFocus = document.activeElement;
    const started = performance.now();

    const geometry = () => {
      width = el.getBoundingClientRect().width;
      height = el.getBoundingClientRect().height;
      const logoWidth = width < 640 ? width - 48 : Math.min(650, width * .54);
      const logoHeight = logoWidth * 432 / 1200;
      const x = (width - logoWidth) / 2, y = (height - logoHeight) / 2;
      screen.setAttribute("viewBox", "0 0 " + width + " " + height);
      logo.setAttribute("x", String(x)); logo.setAttribute("y", String(y));
      logo.setAttribute("width", String(logoWidth)); logo.setAttribute("height", String(logoHeight));
      scale = width < 640 ? 2.5 : 1.8;
      originX = x + 342 * logoWidth / 1200;
      originY = y + 155 * logoWidth / 1200;
      const marker = document.querySelector(".hero-thread")?.getBoundingClientRect();
      targetY = marker ? marker.top + marker.height / 2 : height * .3;
      bridge.setAttribute("d", "M" + originX + " " + originY + " C" + (originX + 30) + " " + (originY - 30) + " " + (width / 2 - 60) + " " + targetY + " " + width / 2 + " " + targetY);
      bridgeLength = bridge.getTotalLength();
      bridge.style.strokeDasharray = String(bridgeLength);
    };
    const finish = (keyboard = false) => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(frame);
      delete root.dataset.opening;
      if (!shown) delete root.dataset.heroEntrance;
      if (content) content.inert = false;
      if (keyboard) document.querySelector<HTMLElement>(".enter-actions a")?.focus({ preventScroll: true });
      else if (document.activeElement === el) {
        el.blur();
        if (previousFocus instanceof HTMLElement && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
      }
    };
    const skip = () => finish(true);
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); skip(); } };
    const escape = () => finish();
    const motionChanged = () => { if (reduced.matches) finish(); };
    const skipButton = el.querySelector("button")!;
    skipButton.addEventListener("click", skip);
    document.addEventListener("keydown", key);
    window.addEventListener("abitah:opening-escape", escape);
    window.addEventListener("resize", geometry);
    reduced.addEventListener("change", motionChanged);
    if (content) content.inert = true;
    el.focus({ preventScroll: true });
    geometry();
    root.dataset.opening = "playing";

    const imageReady = (image: HTMLImageElement) => {
      if (image.complete) return image.decode().catch(() => {});
      return new Promise<void>((resolve) => {
        image.addEventListener("load", () => { image.decode().catch(() => {}).then(resolve); }, { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
    };
    const logoImage = new Image();
    logoImage.src = "/images/logo.svg";
    const heroImage = document.querySelector<HTMLImageElement>(".enter-shot img");
    Promise.allSettled([document.fonts.ready, imageReady(logoImage), ...(heroImage ? [imageReady(heroImage)] : [])]).then(() => { ready = true; });

    const paint = (now: number) => {
      if (stopped) return;
      const time = now - started;
      el.dataset.time = String(Math.round(time));
      if (reduced.matches) {
        symbol.setAttribute("transform", "");
        bMask.setAttribute("y", "60"); bMask.setAttribute("height", "200");
        masks.forEach((mask, i) => mask.setAttribute("width", String(glyphs[i].width)));
        subtitle.setAttribute("width", "1080");
        if ((time > 300 && ready) || time > 1200) { finish(); return; }
        frame = requestAnimationFrame(paint);
        return;
      }
      const draw = part(time, 320, 900), reveal = part(time, 1120, 380), settle = part(time, 1450, 440);
      const s = scale + (1 - scale) * settle;
      symbol.setAttribute("transform", "translate(" + 600 * (1 - settle) + " " + 216 * (1 - settle) + ") scale(" + s + ") translate(" + -319 * (1 - settle) + " " + -157 * (1 - settle) + ")");
      path.style.strokeDashoffset = String(length * (1 - draw));
      path.style.opacity = String(time < 320 ? 0 : 1 - reveal);
      const point = path.getPointAtLength(length * draw);
      dot.setAttribute("cx", String(point.x)); dot.setAttribute("cy", String(point.y));
      dot.style.opacity = time >= 300 && time < 1500 ? "1" : "0";
      bMask.setAttribute("y", String(260 - 200 * reveal)); bMask.setAttribute("height", String(200 * reveal));
      masks.forEach((mask, i) => mask.setAttribute("width", String(glyphs[i].width * part(time, 1680 + i * 65, 240))));
      subtitle.setAttribute("width", String(1080 * part(time, 2070, 240)));
      // Hold the complete original logo for 410ms, then wait only for critical assets.
      if (handoff < 0 && time >= 2720 && (ready || time > 5700)) { handoff = time; geometry(); }
      if (handoff >= 0) {
        const elapsed = time - handoff, travel = part(elapsed, 0, 160);
        bridge.style.opacity = String(1 - part(elapsed, 160, 240));
        bridge.style.strokeDashoffset = String(bridgeLength * (1 - travel));
        const position = bridge.getPointAtLength(bridgeLength * travel);
        lead.style.opacity = "1"; lead.setAttribute("cx", String(position.x)); lead.setAttribute("cy", String(position.y));
        if (elapsed >= 160) {
          const wipe = part(elapsed, 160, 580);
          const left = width / 2 * (1 - wipe), right = width / 2 + width / 2 * wipe;
          aperture.setAttribute("x", String(left)); aperture.setAttribute("width", String(right - left + .01));
          lead.setAttribute("cx", String(right)); lead.setAttribute("cy", String(targetY));
          rule.setAttribute("d", "M" + left + " " + targetY + " H" + right);
          rule.style.opacity = String(1 - part(elapsed, 420, 320));
          if (!shown && wipe > .12) { shown = true; root.dataset.opening = "handoff"; root.dataset.heroEntrance = "play"; }
          if (wipe >= 1) { finish(); return; }
        }
      }
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);
    return () => {
      stopped = true; cancelAnimationFrame(frame);
      if (content) content.inert = false;
      skipButton.removeEventListener("click", skip);
      document.removeEventListener("keydown", key);
      window.removeEventListener("abitah:opening-escape", escape);
      window.removeEventListener("resize", geometry);
      reduced.removeEventListener("change", motionChanged);
      queueMicrotask(() => { if (!el.isConnected) { delete root.dataset.opening; delete root.dataset.heroEntrance; } });
    };
  }, []);

  return (
    <div className="brand-opening" ref={opening} tabIndex={-1} aria-label="Abertura da Abitah. Pressione Escape para pular.">
      <svg className="opening-screen" aria-hidden="true">
        <defs>
          <image id="opening-original" href="/images/logo.svg" x="15.5114" y="59.731" width="1168.978" height="288.733" />
          <clipPath id="opening-b"><rect x="240" y="260" width="160" height="0" /></clipPath>
          {glyphs.map((glyph, i) => <clipPath key={i} id={"opening-glyph-" + i}><rect className="opening-glyph-mask" x={glyph.x} y="65" width="0" height="180" /></clipPath>)}
          <clipPath id="opening-subtitle"><rect x="65" y="290" width="0" height="55" /></clipPath>
          <mask id="opening-wipe" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="white" />
            <rect className="opening-aperture" x="0" y="0" width="0" height="100%" fill="black" />
          </mask>
        </defs>
        <g mask="url(#opening-wipe)">
          <rect width="100%" height="100%" fill="#f4f3ee" />
          <svg className="opening-logo" viewBox="0 0 1200 432" overflow="visible">
            <g className="opening-symbol">
              <path className="opening-trajectory" d={trajectory} />
              <g clipPath="url(#opening-b)"><use href="#opening-original" /></g>
              <circle className="opening-dot" r="2.5" />
            </g>
            {glyphs.map((_, i) => <g key={i} clipPath={"url(#opening-glyph-" + i + ")"}><use href="#opening-original" /></g>)}
            <g clipPath="url(#opening-subtitle)"><use href="#opening-original" /></g>
          </svg>
        </g>
        <path className="opening-bridge" />
        <path className="opening-rule" />
        <circle className="opening-lead" r="2" />
      </svg>
      <button className="opening-skip" type="button">Pular abertura</button>
    </div>
  );
}