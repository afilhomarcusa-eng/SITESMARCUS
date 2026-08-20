"use client";

/**
 * Dragãozinho ambiente que sobrevoa devagar a Trilha da jornada, no lugar
 * do carrinho. Puramente atmosférico — não reage a clique nem à parada
 * ativa, por isso <animateMotion> nativo do SVG, não motion/react (que é
 * reservado a revelação/interação).
 *
 * Reaproveita TRILHA_D e traco de components/desenhos.tsx. Silhueta própria
 * e menor que o Dragao da jornada (aquele fica no chão, em pé; este voa).
 */

import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { traco, TRILHA_D } from "@/components/desenhos";

export function TrilhaDragao({ className }: { className?: string }) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) return null;

  return (
    <svg
      viewBox="0 0 1000 72"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <g className="text-coral-texto/70">
        {/*
          Arte pequena e centrada perto da origem local, porque animateMotion
          desliza o ponto (0,0) deste grupo ao longo do path.
        */}
        <g {...traco} stroke="currentColor" strokeWidth={1.4}>
          <path d="M-9,-6c3,-3,5,1,8,-2c2,-2,4,0,5,-2" />
          <path d="M-3,-8c1,-3,4,-4,6,-3" />
        </g>
        <circle cx="5.5" cy="-9" r="0.7" fill="currentColor" stroke="none" />
        <animateMotion
          dur="26s"
          repeatCount="indefinite"
          rotate="auto"
          path={TRILHA_D}
        />
      </g>
    </svg>
  );
}
