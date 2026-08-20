"use client";

/**
 * Entrada do hero. Roda uma vez no carregamento, não no scroll.
 * Faixa de 0 a 10% da coreografia do briefing.
 */

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { curva } from "@/lib/utils";

export function Entrada({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: curva, delay }}
    >
      {children}
    </motion.div>
  );
}
