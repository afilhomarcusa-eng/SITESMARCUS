"use client";

import { useEffect, useRef, useState } from "react";

const etapas = [
  ["MISSÃO TÉCNICA", "Acompanhamento de verdade", "Turma pequena e correção presente."],
  ["JORNADA PROGRESSIVA", "Do iniciante ao atleta", "O estímulo cresce com você."],
  ["LAÇO DE COMUNIDADE", "Presença cobrada com carinho", "Aqui você não passa despercebido."],
  ["ROTINA POSSÍVEL", "Treino que cabe na vida", "Consistência sem complicação."],
  ["PRÓXIMA FASE", "Evoluir em conjunto", "Cada treino deixa uma marca."],
];

export function HorizontalRoadmap() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onScroll = () => { const e = ref.current; if (!e) return; const p = Math.max(0, Math.min(1, (innerHeight * .72 - e.getBoundingClientRect().top) / Math.max(1, e.offsetHeight - innerHeight * .5))); setActive(Math.min(etapas.length - 1, Math.floor(p * etapas.length))); };
    onScroll(); addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);
  return <section className="roadmap section" ref={ref} id="evolucao"><div className="shell"><div className="roadmap-head"><span className="tag">Por que a gente existe</span><h2>Uma comunidade que te puxa<br /><em>para evoluir.</em></h2></div><div className="roadmap-scroll"><div className="roadmap-line" aria-hidden="true"><span style={{ width: `${(active / (etapas.length - 1)) * 100}%` }} /></div><div className="roadmap-items">{etapas.map((e, i) => <button type="button" className={i === active ? "roadmap-step is-active" : i < active ? "roadmap-step is-done" : "roadmap-step"} key={e[0]} onClick={() => setActive(i)}><span className="roadmap-dot">0{i + 1}</span><small>{e[0]}</small><strong>{e[1]}</strong><p>{e[2]}</p></button>)}</div></div></div></section>;
}
