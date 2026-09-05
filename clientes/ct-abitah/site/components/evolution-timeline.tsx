"use client";

import { useEffect, useState } from "react";

const milestones = [
  ["MISSÃO TÉCNICA", "ACOMPANHAMENTO DE VERDADE", "HABILIDADE: DESBLOQUEADA", "♙"],
  ["JORNADA PROGRESSIVA", "DO INICIANTE AO ATLETA", "NÍVEL DE ATLETA: MULTI-NÍVEL ATIVO", "↗"],
  ["LAÇO DE COMUNIDADE", "PRESENÇA COBRADA COM CARINHO", "ENGAJAMENTO: ALTO", "♧"],
];

export function EvolutionTimeline() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.getElementById("evolucao");
      if (!el) return;
      const r = el.getBoundingClientRect();
      setProgress(Math.max(0, Math.min(1, (window.innerHeight * 0.72 - r.top) / (r.height - window.innerHeight * 0.35))));
    };
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <section className="evolution section" id="evolucao"><div className="shell"><header className="evolution-head"><span className="tag">Por que a gente existe</span><h2>Uma comunidade que te puxa<br /><em>para evoluir.</em></h2><span className="evolution-mark">EVOLUTION</span></header><div className="evolution-track"><svg viewBox="0 0 700 1200" preserveAspectRatio="none" aria-hidden="true"><path className="evolution-path-bg" d="M350 0 C150 180 560 300 350 500 S150 760 370 880 S570 1080 350 1200" /><path className="evolution-path" pathLength="1" style={{ strokeDashoffset: 1 - progress }} d="M350 0 C150 180 560 300 350 500 S150 760 370 880 S570 1080 350 1200" /></svg>{milestones.map((m, i) => <article className={`evolution-card evolution-card--${i + 1} ${progress > (i + 1) / 4 ? "is-active" : ""}`} key={m[0]}><span className="evolution-icon">{m[3]}</span><small>{m[0]}</small><h3>{m[1]}</h3><b>{m[2]}</b></article>)}<div className="evolution-avatar" style={{ top: `${Math.min(90, progress * 100)}%` }}>●</div></div><div className="evolution-hud"><span>HUB STATUS: ACTIVE</span><strong>TOTAL EVOLUTIONS<br />∞</strong></div><div className="evolution-foot"><span>PRÓXIMO PASSO: INICIAR TREINO</span><span>FALE COM O TREINADOR ↗</span></div></div></section>;
}
