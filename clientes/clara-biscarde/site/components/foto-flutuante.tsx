"use client";

/**
 * Foto que flutua devagar, no lugar da massa de cor que ficava atrás dela.
 *
 * É loop ambiente, não revelação de conteúdo. Por isso não cai na regra de 400
 * a 800ms do briefing, igual ao peão da transição e ao trilho: quem decide o
 * ritmo é o próprio elemento, e nada disso carrega informação.
 *
 * Amplitude pequena de propósito. Passou de uns 12px a foto começa a brigar
 * com o texto ao lado dela e o olho percebe como bug, não como respiração.
 */

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

interface FotoFlutuanteProps {
  children: React.ReactNode;
  className?: string;
  /** Deslocamento máximo, em pixels, para cima e para baixo. */
  amplitude?: number;
  /** Ciclo completo, em segundos. */
  duracao?: number;
  /** Defasagem, para duas fotos vizinhas não subirem no mesmo instante. */
  atraso?: number;
}

export function FotoFlutuante({
  children,
  className,
  amplitude = 9,
  duracao = 7,
  atraso = 0,
}: FotoFlutuanteProps) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{
        duration: duracao,
        repeat: Infinity,
        ease: "easeInOut",
        delay: atraso,
      }}
    >
      {children}
    </motion.div>
  );
}
