"use client";

import { useLayoutEffect } from "react";

/**
 * Marca os elementos .revela quando eles entram na tela.
 * Se o JavaScript nao rodar, o CSS de fallback abaixo deixa tudo visivel:
 * conteudo nunca espera por uma camada opcional.
 */
export function Revelacao() {
  useLayoutEffect(() => {
    // So a partir daqui o CSS pode esconder .revela. Se este componente nao
    // rodar (bundle quebrado, JS fora), o conteudo fica visivel do mesmo jeito.
    document.documentElement.setAttribute("data-revelar", "ativo");
    const alvos = document.querySelectorAll<HTMLElement>(".revela");
    if (alvos.length === 0) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido) {
      alvos.forEach((a) => a.setAttribute("data-visivel", "true"));
      return;
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.setAttribute("data-visivel", "true");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px", threshold: 0 },
    );
    alvos.forEach((a) => obs.observe(a));
    return () => obs.disconnect();
  }, []);

  return null;
}
