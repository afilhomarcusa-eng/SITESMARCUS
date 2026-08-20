"use client";

/**
 * Copiado de motion-primitives-website/src/components/scroll/parallax-scroll.tsx
 * Adaptado: import de "motion/react", gsap removido (não é usado aqui),
 * desliga em prefers-reduced-motion.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
}

export function Parallax({
  children,
  className,
  speed = 0.5,
  direction = "up",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const multiplier = direction === "up" ? -1 : 1;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * speed * multiplier, -100 * speed * multiplier]
  );
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  if (prefersReduced) {
    return (
      <div ref={ref} className={cn("relative", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{ y: smoothY }}
    >
      {children}
    </motion.div>
  );
}
