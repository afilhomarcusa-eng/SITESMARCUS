"use client";

/**
 * Copiado de motion-primitives-website/src/components/effects/magnetic-button.tsx
 * Adaptado: vira âncora no lugar de button, cores saem dos tokens,
 * import de "motion/react", movimento desligado em prefers-reduced-motion.
 */

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

interface MagneticLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  strength?: number;
  mass?: number;
}

export function MagneticLink({
  children,
  href,
  className,
  strength = 0.28,
  mass = 0.6,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150 * (1 / mass), damping: 15 * mass, mass };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const innerX = useTransform(springX, (v) => v * -0.3);
  const innerY = useTransform(springY, (v) => v * -0.3);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current || prefersReduced) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "inline-flex items-center gap-3 rounded-botao bg-tinta px-8 py-4 text-papel " +
    "font-medium tracking-tight transition-colors duration-300 hover:bg-sage-escuro";

  if (prefersReduced) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(base, className)}
      >
        {children}
      </a>
    );
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(base, className)}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span
        className="relative z-10 flex items-center gap-3"
        style={{ x: innerX, y: innerY }}
      >
        {children}
      </motion.span>
    </motion.a>
  );
}
