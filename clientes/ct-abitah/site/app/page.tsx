"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Footer, Header, Instagram, useReveal } from "@/components/chrome";
import { MapaUnidades } from "@/components/mapa-unidades";


import { BrandOpening } from "@/components/preloader";
import { ImmersiveHero } from "@/components/immersive-hero";
import { PremiumRoadmap } from "@/components/premium-roadmap";
import { FaqIndex } from "@/components/faq-index";
import { modalidades, rede } from "@/lib/unidades";

export default function Home() {
  useReveal();
  const [mod, setMod] = useState(0);

  return (
    <main className="home">
      <BrandOpening />
      <div data-opening-content>
      <Header sobreFoto />

      <ImmersiveHero />

      <section className="section on-dark" id="metodo">
        <div className="shell">
          <div className="head" data-reveal>
            <div>
              <span className="tag">O método</span>
              <h2><span>Seis formas de treinar.</span><span>Uma só forma <span className="keep-together">de acompanhar.</span></span></h2>
            </div>
            <p>
              Turmas limitadas e professor presente, do iniciante ao atleta. O que muda de uma modalidade para outra é o
              estímulo, não o cuidado. Passe por elas.
            </p>
          </div>

          <div className="mods mods-editorial" data-reveal>
            <div className="mods-list" role="tablist" aria-label="Modalidades" aria-orientation="vertical">
              {modalidades.map((m, i) => (
                <button
                  key={m.nome}
                  type="button"
                  role="tab"
                  id={`modalidade-${i}`}
                  aria-controls="modalidade-painel"
                  tabIndex={mod === i ? 0 : -1}
                  onKeyDown={(event) => {
                    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
                    if (!direction && event.key !== "Home" && event.key !== "End") return;
                    event.preventDefault();
                    const next = event.key === "Home" ? 0 : event.key === "End" ? modalidades.length - 1 : (i + direction + modalidades.length) % modalidades.length;
                    setMod(next);
                    document.getElementById(`modalidade-${next}`)?.focus();
                  }}
                  aria-selected={mod === i}
                  className={mod === i ? "mod-row is-on" : "mod-row"}
                  onClick={() => setMod(i)}
                >
                  <i>0{i + 1} —</i>
                  <b>{m.nome}</b>
                  <span>Conhecer <ArrowUpRight /></span>
                </button>
              ))}
            </div>

            <div className="mods-stage" id="modalidade-painel" role="tabpanel" aria-labelledby={`modalidade-${mod}`} tabIndex={0}>
              <div className="mods-shot">
                {modalidades.map((m, i) => (
                  <img key={m.nome} src={m.foto} alt="" className={mod === i ? "is-on" : undefined} loading="lazy" />
                ))}
              </div>
              <div className="mods-text"><p>{modalidades[mod].texto}</p><a href="#unidades">Conhecer <ArrowUpRight /></a></div>
            </div>
          </div>
        </div>
      </section>

<PremiumRoadmap />
      <section className="map-section section" id="unidades">
        <div className="shell">
          <div className="head" data-reveal>
            <div>
              <span className="tag">Onde treinar</span>
              <h2>Oito endereços. Escolha o seu.</h2>
            </div>
            <p>
              Cada unidade tem equipe, horário e WhatsApp próprios. Toque num ponto do mapa ou na lista para ver os
              detalhes e falar direto com quem atende ali.
            </p>
          </div>
          <MapaUnidades />
        </div>
      </section>

<section className="social-feed section" id="instagram">
        <div className="shell">
          <div className="social-feed-head" data-reveal>
            <div><span className="tag">Nos siga no Instagram</span><h2><a href={rede.instagram} target="_blank" rel="noreferrer">@ctabitah</a></h2></div>
          </div>
          <div className="social-grid" data-reveal>
            {["hero.jpg", "kettlebell.jpg", "sala.jpg", "recepcao.jpg"].map((foto, i) => (
              <a href={rede.instagram} target="_blank" rel="noreferrer" key={foto}>
                <img src={`/images/${foto}`} alt={`Momento de treino Abitah ${i + 1}`} loading="lazy" decoding="async" />
                <span><Instagram /> Ver no Instagram</span>
              </a>
            ))}
          </div>
        </div>
      </section>

<FaqIndex />

      <section className="section final-cta">
        <div className="shell head" data-reveal><div><span className="tag">O próximo passo</span><h2>Marque sua aula experimental.</h2></div><div><p>Venha sentir o método na prática, no seu ritmo.</p><p style={{ marginTop: 24 }}><Link className="btn btn--brand" href="/aula-experimental">Escolher uma unidade <ArrowRight /></Link></p></div></div>
      </section>

      <Footer />
      </div>
    </main>
  );
}
