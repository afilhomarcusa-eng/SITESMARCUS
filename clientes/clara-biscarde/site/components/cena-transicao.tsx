"use client";

/**
 * Cena de transição entre seções, com o peão da marca atravessando o caminho.
 *
 * O peão é o próprio símbolo cerebral do logo, recortado do arquivo original e
 * usado sem alterar cor nenhuma, como manda a página 03 do manual. Ele anda da
 * esquerda para a direita conforme a pessoa rola a página, e gira devagar no
 * caminho.
 *
 * O movimento é preso ao scroll, não tem duração fixa. Por isso não cai na
 * regra de 400 a 800ms do briefing: quem controla o andamento é a pessoa, e
 * parar de rolar para o peão no lugar.
 *
 * Os marcos do cenário (árvore, banco, casinha) ficam parados. Só o peão anda.
 */

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { traco } from "@/components/desenhos";

const HORIZONTE_D = "M0,92 C 60,78 120,90 180,84 S 300,72 400,80";

type Variante = "inicio" | "meio" | "fim";

export function CenaTransicao({ variante }: { variante: Variante }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const suave = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
  });

  /* Atravessa de ponta a ponta, com folga nas bordas para não encostar. */
  const x = useTransform(suave, [0, 1], ["4%", "84%"]);

  /* Sobe e desce de leve, acompanhando a ondulação do horizonte. */
  const y = useTransform(suave, [0, 0.35, 0.7, 1], [0, -7, 4, -3]);

  /* Peão gira. Uma volta e meia na travessia inteira. */
  const giro = useTransform(suave, [0, 1], [0, 540]);

  return (
    <div ref={ref} className="flex justify-center py-10 md:py-14">
      <div className="relative w-full max-w-[26rem] md:max-w-[32rem]">
        <svg
          viewBox="0 0 400 120"
          className="h-auto w-full text-oliva-apoio"
          aria-hidden
        >
          <path
            d={HORIZONTE_D}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            opacity={0.6}
          />

          {/* Rastro pontilhado, mesma linguagem da trilha da jornada */}
          <path
            d="M20,96 C 110,86 240,98 380,88"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray="2 12"
            opacity={0.75}
          />

          {variante === "inicio" && (
            <g {...traco} stroke="currentColor">
              {/* árvore pequena, começo do caminho */}
              <path d="M70,92v-26" />
              <path d="M56,68c-5,-8,3,-16,11,-13c2,-10,16,-10,18,0c8,-3,13,8,5,14c-6,5,-28,5,-34,-1z" />
            </g>
          )}

          {variante === "meio" && (
            <g {...traco} stroke="currentColor">
              {/* árvore maior e banco, uma pausa no meio do caminho */}
              <path d="M210,90v-30" />
              <path d="M190,62c-6,-10,4,-20,14,-16c2,-12,20,-12,22,0c10,-4,16,10,6,18c-8,6,-34,6,-42,-2z" />
              <path d="M186,96h48" />
              <path d="M190,96v8M230,96v8" />
              <path d="M190,96v-14M210,96v-14M230,96v-14" />
            </g>
          )}

          {variante === "fim" && (
            <>
              <g {...traco} stroke="currentColor">
                {/* casinha, a chegada, logo antes do convite pra conversar */}
                <path d="M300,92 L332,60 L364,92" />
                <path d="M306,92v20h52v-20" />
                <path d="M324,112v-14h16v14" />
              </g>
              <circle cx="352" cy="76" r="1.6" fill="currentColor" stroke="none" />
            </>
          )}
        </svg>

        {/*
          O peão. Sem filtro de cor nenhum: entra exatamente como está no logo.
          Posicionado sobre a linha do horizonte, que fica a 92 de 120 do
          viewBox, ou seja 76% da altura da caixa.
        */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-[76%] w-[9%] min-w-[26px] -translate-y-full md:w-[8%]"
          style={
            prefersReduced
              ? { left: "44%" }
              : { left: x, y, rotate: giro }
          }
        >
          <Image
            src="/marca.png"
            sizes="64px"
            alt=""
            width={429}
            height={564}
            className="h-auto w-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
