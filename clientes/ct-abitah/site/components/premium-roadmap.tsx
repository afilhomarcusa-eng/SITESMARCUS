"use client";

import { useEffect, useRef } from "react";

const etapas = [
  ["01", "MISSÃO TÉCNICA", "Acompanhamento de verdade", "Turma pequena e correção presente."],
  ["02", "JORNADA PROGRESSIVA", "Do iniciante ao atleta", "O estímulo cresce com você."],
  ["03", "LAÇO DE COMUNIDADE", "Presença cobrada com carinho", "Aqui você não passa despercebido."],
  ["04", "ROTINA POSSÍVEL", "Treino que cabe na vida", "Consistência sem complicação."],
  ["05", "PRÓXIMA FASE", "Evoluir em conjunto", "Cada treino deixa uma marca."],
];

export function PremiumRoadmap() {
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const svg = el.querySelector("svg")!;
    const track = el.querySelector<SVGPathElement>(".journey-track")!;
    const progressPath = el.querySelector<SVGPathElement>(".journey-progress")!;
    const marker = el.querySelector<SVGCircleElement>(".journey-marker")!;
    const points = [...el.querySelectorAll<SVGCircleElement>(".journey-anchor")];
    const steps = [...el.querySelectorAll<HTMLElement>(".journey-step")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let anchors: number[] = [];
    let total = 0;
    let progress = 0;
    let revealed = 0;
    let selectedStage: number | null = null;
    let frame = 0;
    let mobile = false;

    const paint = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // The line follows scroll in both directions; already revealed text stays visible.
      const next = (innerHeight * .86 - rect.top) / Math.max(1, rect.height - innerHeight * .12);
      progress = reduced.matches ? 1 : Math.min(1, Math.max(0, next));
      revealed = Math.max(revealed, progress);
      progressPath.style.strokeDashoffset = String(1 - progress);
      const current = track.getPointAtLength(total * progress);
      marker.setAttribute("cx", String(current.x));
      marker.setAttribute("cy", String(current.y));
      marker.style.opacity = progress > 0 && progress < 1 ? "1" : "0";
      const currentStage = (reduced.matches ? selectedStage : null) ?? anchors.reduce((last, anchor, i) => progress >= anchor - .001 ? i : last, -1);
      steps.forEach((step, i) => {
        step.classList.toggle("is-current", i === currentStage);
        const active = revealed >= anchors[i] - .001;
        step.classList.toggle("is-on", active);
        points[i].classList.toggle("is-on", progress >= anchors[i] - .001);
        const button = step.querySelector("button")!;
        if (i === currentStage) button.setAttribute("aria-current", "step");
        else button.removeAttribute("aria-current");
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };

    const layout = () => {
      const rect = el.getBoundingClientRect();
      mobile = matchMedia("(max-width: 899px)").matches;
      svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
      const upperRight = Math.max(174, steps[3].offsetHeight + 28);
      const upperLeft = Math.max(steps[1].offsetHeight + 42, upperRight + 48);
      const heights = [upperLeft + 42, upperLeft, upperLeft + 108, upperRight, upperRight + 60];
      steps.forEach((step, i) => {
        step.style.marginTop = mobile || i === 1 || i === 3 ? "0px" : `${heights[i] + 32}px`;
      });
      const coords = steps.map((step, i) => {
        const r = step.getBoundingClientRect();
        return mobile
          ? { x: [14, 30, 18, 34, 22][i], y: r.top - rect.top + 32 }
          : { x: r.left - rect.left + Math.min(r.width * .34, 64), y: heights[i] };
      });
      let d = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 1; i < coords.length; i++) {
        const a = coords[i - 1], b = coords[i];
        const delta = mobile ? (b.y - a.y) * .5 : (b.x - a.x) * .48;
        d += mobile
          ? ` C ${a.x} ${a.y + delta}, ${b.x} ${b.y - delta}, ${b.x} ${b.y}`
          : ` C ${a.x + delta} ${a.y}, ${b.x - delta} ${b.y}, ${b.x} ${b.y}`;
      }
      track.setAttribute("d", d);
      progressPath.setAttribute("d", d);
      total = track.getTotalLength();
      // Invert the monotonic axis to find exact distances on the actual rendered path.
      anchors = coords.map((coord, i) => {
        let lo = 0, hi = total;
        for (let j = 0; j < 32; j++) {
          const mid = (lo + hi) / 2;
          const p = track.getPointAtLength(mid);
          if ((mobile ? p.y : p.x) < (mobile ? coord.y : coord.x)) lo = mid;
          else hi = mid;
        }
        const length = i === 0 ? 0 : i === coords.length - 1 ? total : (lo + hi) / 2;
        const point = track.getPointAtLength(length);
        points[i].setAttribute("cx", String(point.x));
        points[i].setAttribute("cy", String(point.y));
        points[i].dataset.length = String(length);
        return length / total;
      });
      if (reduced.matches) delete el.dataset.motion;
      else el.dataset.motion = "";
      paint();
    };
    const navigate = (event: MouseEvent) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-journey-stage]");
      if (!button) return;
      const i = Number(button.dataset.journeyStage);
      selectedStage = i;
      const rect = el.getBoundingClientRect();
      const top = scrollY + rect.top - innerHeight * .86 + (anchors[i] + .002) * Math.max(1, rect.height - innerHeight * .12);
      window.scrollTo({ top, behavior: reduced.matches ? "instant" : "smooth" });
      if (reduced.matches) paint();
    };
    el.addEventListener("click", navigate);
    const observer = new ResizeObserver(layout);
    observer.observe(el);
    steps.forEach(step => observer.observe(step));
    layout();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", layout);
    reduced.addEventListener("change", layout);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener("click", navigate);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", layout);
      reduced.removeEventListener("change", layout);
    };
  }, []);

  return (
    <section className="premium-roadmap section" id="evolucao" aria-labelledby="journey-heading">
      <div className="shell">
        <header className="premium-roadmap-head">
          <span className="tag">Por que a gente existe</span>
          <h2 id="journey-heading">Uma comunidade que te puxa <em>para evoluir.</em></h2>
        </header>
        <div className="journey-canvas" ref={canvas}>
          <svg className="journey-svg" viewBox="0 0 1200 560" aria-hidden="true">
            <path className="journey-track" d="M60 264 C150 264 170 222 280 222 C390 222 400 330 520 330 C650 330 670 174 800 174 C940 174 960 234 1100 234" />
            <path className="journey-progress" pathLength="1" strokeDasharray="1" d="M60 264 C150 264 170 222 280 222 C390 222 400 330 520 330 C650 330 670 174 800 174 C940 174 960 234 1100 234" />
            {etapas.map((e, i) => <circle key={e[0]} className="journey-anchor" cx={[60, 280, 520, 800, 1100][i]} cy={[264, 222, 330, 174, 234][i]} r="3" />)}
            <circle className="journey-marker" cx="60" cy="264" r="3.5" style={{ opacity: 0 }} />
          </svg>
          <ol className="journey-steps">
            {etapas.map((e, i) => (
              <li className="journey-step" key={e[0]}>
                <button className="journey-number" type="button" data-journey-stage={i} aria-label={e[2]}>{e[0]}</button>
                <small>{e[1]}</small>
                <div className="journey-copy"><h3>{e[2]}</h3><p>{e[3]}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
