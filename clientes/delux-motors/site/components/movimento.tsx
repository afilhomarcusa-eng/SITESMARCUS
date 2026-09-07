"use client";

import { useLayoutEffect } from "react";
import Lenis from "lenis";

/**
 * Motor de movimento.
 *
 * A ordem aqui não é detalhe. O CSS só esconde elemento de revelação quando o
 * html tem data-motion="on", e quem liga isso é este componente. Sem JS, ou se
 * este componente quebrar, nada nunca fica escondido.
 *
 * Roda em useLayoutEffect e marca o que já está na tela antes do primeiro
 * quadro, senão o conteúdo do topo aparece e some.
 */
export default function Movimento() {
  useLayoutEffect(() => {
    const raiz = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raiz.dataset.motion = "off";
      return;
    }

    raiz.dataset.motion = "on";

    const alvos = Array.from(
      document.querySelectorAll<HTMLElement>("[data-revela], .mascara"),
    );
    const altura = window.innerHeight;
    for (const el of alvos) {
      if (el.getBoundingClientRect().top < altura * 0.92) el.classList.add("dentro");
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("dentro");
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    for (const el of alvos) if (!el.classList.contains("dentro")) obs.observe(el);

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      autoRaf: true,
    });

    function onClique(ev: MouseEvent) {
      // Pega tanto "#secao" quanto "/#secao". O menu usa a forma absoluta para
      // funcionar a partir de /estoque.
      const alvo = (ev.target as HTMLElement).closest?.("a[href*='#']");
      if (!alvo) return;
      const href = alvo.getAttribute("href") ?? "";
      const id = href.slice(href.indexOf("#") + 1);
      if (!id) return;
      // Seção que não existe nesta página é link para outra rota. Deixa navegar.
      const destino = document.getElementById(id);
      if (!destino) return;
      ev.preventDefault();
      lenis.scrollTo(destino, { offset: -70 });
      history.pushState(null, "", `#${id}`);
      destino.setAttribute("tabindex", "-1");
      destino.focus({ preventScroll: true });
    }
    document.addEventListener("click", onClique);

    return () => {
      obs.disconnect();
      document.removeEventListener("click", onClique);
      lenis.destroy();
      delete raiz.dataset.motion;
    };
  }, []);

  return null;
}
