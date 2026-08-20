"use client";

/**
 * Copiado de motion-primitives-website/src/components/scroll/section-reveal.tsx
 * Adaptado: import de "motion/react" no lugar de "framer-motion",
 * threshold 0.15 para 0.2 conforme a regra do briefing.
 */

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { curva } from "@/lib/utils";

interface SectionRevealProps {
  children: React.ReactNode;
  type?: "fade" | "slide";
  className?: string;
  delay?: number;
}

export function SectionReveal({
  children,
  type = "fade",
  className,
  delay = 0,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    fade: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
    slide: {
      hidden: { opacity: 0, x: -48 },
      visible: { opacity: 1, x: 0 },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[type]}
      transition={{ duration: 0.7, ease: curva, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Filhos revelados em cascata. Stagger de 80ms, dentro da faixa do briefing. */
export function RevealLista({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: curva }}
    >
      {children}
    </motion.div>
  );
}
