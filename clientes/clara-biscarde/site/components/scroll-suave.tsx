"use client";

/** Lenis. Marcado no Bloco 6 do briefing. Desliga em prefers-reduced-motion. */

import { useEffect } from "react";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export function ScrollSuave() {
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });

    let frame = 0;
    const loop = (tempo: number) => {
      lenis.raf(tempo);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [prefersReduced]);

  return null;
}
