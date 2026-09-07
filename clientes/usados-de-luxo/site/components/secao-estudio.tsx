"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A sala, explicada.
 *
 * Esta seção já foi uma cena grudada de 240vh que gastava duas telas e meia de
 * rolagem para aumentar uma foto. Não pagava a altura que ocupava, deixava
 * metade da tela vazia em 1920 e, no meio do caminho, a foto passava por cima
 * do título. Virou o que deveria ter sido desde o começo: uma tela, composição
 * editorial, texto de um lado e a foto sangrando do outro.
 *
 * O que sobrou de movimento é o que tem função: a foto anda mais devagar que a
 * página. Dois planos em velocidades diferentes é profundidade de verdade, e
 * custa uma linha.
 */

type Props = { src: string; alt: string; total: number };

const ITENS = [
  { t: "Parede preta", d: "Fundo escuro para a cor da lataria aparecer como ela é." },
  { t: "Luz montada", d: "Sempre a mesma, entrando de lado, marcando os vincos." },
  { t: "Piso claro", d: "Reflexo embaixo do carro, que mostra a altura e as rodas." },
  { t: "Placa da casa", d: "No lugar da placa real, para não expor o dono anterior." },
];

export default function SecaoEstudio({ src, alt, total }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [desloca, setDesloca] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const medir = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const meio = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      // A foto anda ao contrário da página, devagar. Só isso.
      setDesloca(Math.max(-1, Math.min(1, meio)) * -5);
    };
    const agendar = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, []);

  return (
    <section
      id="estudio"
      ref={ref}
      className="secao relative overflow-hidden"
      style={{ background: "var(--fumaca)" }}
    >
      <div className="casca">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.06fr)] lg:gap-16">
          <div>
            <p className="etiqueta mb-6">O estúdio</p>
            {/* A medida fica no próprio elemento em display: ch é relativo à
                fonte de quem tem a classe, e no pai valeria a do corpo. */}
            <p
              data-frase
              className="display mb-8 max-w-[11ch] text-[clamp(2rem,4.8vw,4.2rem)]"
              data-revela="sobe"
            >
              Toda foto do estoque sai da mesma sala
            </p>

            <p className="corpo mb-10 max-w-[46ch]" data-revela="sobe">
              Foto de celular no pátio esconde amassado, arranhado e cor real.
              Por isso os {total} carros do estoque passam pela mesma sala, com o
              mesmo ajuste, antes de entrar no site. Quem está em outro estado
              precisa conseguir confiar no que está vendo.
            </p>

            <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {ITENS.map((i) => (
                <div key={i.t} data-revela="sobe">
                  <dt className="display-solto mb-2 flex items-center gap-3 text-[0.95rem]">
                    <span
                      aria-hidden="true"
                      className="inline-block h-px w-5 shrink-0"
                      style={{ background: "var(--latao)" }}
                    />
                    {i.t}
                  </dt>
                  <dd
                    className="text-[0.86rem] leading-relaxed"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    {i.d}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* A foto sangra até a borda da tela. É o que usa a largura que sobra
              em 1920, em vez de deixar um vazio do lado direito. */}
          <div
            className="relative lg:-mr-[calc((100vw-var(--casca))/2)]"
            style={{ transform: `translate3d(0, ${desloca}%, 0)` }}
          >
            <img
              data-foto-sala
              src={src}
              alt={alt}
              width={1440}
              height={1800}
              loading="lazy"
              decoding="async"
              className="h-[52svh] w-full object-cover object-center lg:h-[78svh]"
            />
            <p className="etiqueta mt-3">
              BMW M4 Coupé, fotografado na sala, sem retoque de cor
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
