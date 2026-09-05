"use client";

import { useEffect, useRef } from "react";
import { fotosUnidades } from "@/lib/fotos-unidades";
import { ArrowRight } from "./chrome";

export function ImmersiveHero() {
  const foto = fotosUnidades["vilas-roof-top"];
  const hero = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = hero.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const paint = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      el.style.setProperty("--hero-drift", reduced.matches ? "0px" : `${progress * 48}px`);
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    addEventListener("scroll", update, { passive: true });
    reduced.addEventListener("change", paint);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      reduced.removeEventListener("change", paint);
    };
  }, []);

  return (
    <section className="enter" id="topo" ref={hero}>
      <div className="enter-shot">
        <img src={foto.src} srcSet={foto.srcSet} sizes="100vw" width={foto.width} height={foto.height} alt="Área de treino do CT Abitah Rooftop" fetchPriority="high" />
      </div>
      <div className="shell enter-in">
        <span className="hero-thread" aria-hidden="true" />
        <span className="tag tag--plain enter-tag">Centro de treinamento · Bahia</span>
        <h1><span className="hero-first">Liberte o atleta que </span><em>Abitah</em><span className="hero-ending"> em você.</span></h1>
        <p>
          Oito unidades entre Salvador, Lauro de Freitas e Feira de Santana. Turma pequena, professor por perto e um
          lugar onde a presença é cobrada com carinho.
        </p>
        <div className="enter-actions">
          <a className="btn btn--brand" href="#unidades">Escolher unidade <ArrowRight /></a>
          <a className="btn btn--line" href="#metodo">O método</a>
        </div>
      </div>
      <div className="shell enter-foot">
        <a href="#metodo"><span>Aqui você não desiste</span><ArrowRight /></a>
      </div>
    </section>
  );
}
