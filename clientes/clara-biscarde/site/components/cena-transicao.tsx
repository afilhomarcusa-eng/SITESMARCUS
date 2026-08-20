/**
 * Cena ilustrada entre seções — substitui a linha fina com marcador.
 * Aparece só em 3 quebras da página (não em todas): início, meio, chegada.
 * Mesmo traço à mão de desenhos.tsx, mas vinheta própria, não repete os
 * ícones da jornada (castelo/dragão/ponte/bússola/bandeira ficam exclusivos
 * daquela seção). Sem "use client": só compõe SectionReveal, que já cuida
 * da entrada em fade e do corte por prefers-reduced-motion.
 */

import { SectionReveal } from "@/components/section-reveal";
import { traco } from "@/components/desenhos";

const HORIZONTE_D = "M0,92 C 60,78 120,90 180,84 S 300,72 400,80";

type Variante = "inicio" | "meio" | "fim";

export function CenaTransicao({ variante }: { variante: Variante }) {
  return (
    <SectionReveal className="flex justify-center py-10 md:py-14">
      <svg
        viewBox="0 0 400 120"
        className="h-auto w-full max-w-[26rem] text-oliva-apoio md:max-w-[32rem]"
        aria-hidden
      >
        <path
          d={HORIZONTE_D}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          opacity={0.6}
        />

        {variante === "inicio" && (
          <>
            <g {...traco} stroke="currentColor">
              {/* árvore pequena, começo do caminho */}
              <path d="M70,92v-26" />
              <path d="M56,68c-5,-8,3,-16,11,-13c2,-10,16,-10,18,0c8,-3,13,8,5,14c-6,5,-28,5,-34,-1z" />
            </g>
            {/* pegadas pontilhadas, mesma linguagem da Trilha da jornada */}
            <path
              d="M110,94 C 160,86 210,96 260,88"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="2 12"
            />
          </>
        )}

        {variante === "meio" && (
          <g {...traco} stroke="currentColor">
            {/* árvore maior e banco, uma pausa no meio do caminho */}
            <path d="M210,90v-30" />
            <path d="M190,62c-6,-10,4,-20,14,-16c2,-12,20,-12,22,0c10,-4,16,10,6,18c-8,6,-34,6,-42,-2z" />
            <path d="M186,96h48" />
            <path d="M190,96v8M230,96v8" />
            <path d="M190,96v-14M210,96v-14M230,96v-14" />
            <path d="M320,40c5,-5,10,-5,15,0c5,-5,10,-5,15,0" />
          </g>
        )}

        {variante === "fim" && (
          <>
            <g {...traco} stroke="currentColor">
              {/* casinha, a chegada, logo antes do convite pra conversar */}
              <path d="M270,92 L305,58 L340,92" />
              <path d="M276,92v22h58v-22" />
              <path d="M296,114v-16h16v16" />
            </g>
            <circle cx="330" cy="76" r="1.6" fill="currentColor" stroke="none" />
            <path
              d="M120,96 C 170,88 220,98 260,90"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeDasharray="2 12"
            />
          </>
        )}
      </svg>
    </SectionReveal>
  );
}
