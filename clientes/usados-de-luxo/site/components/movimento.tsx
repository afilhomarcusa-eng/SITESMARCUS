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
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduzido) {
      raiz.dataset.motion = "off";
      return;
    }

    raiz.dataset.motion = "on";

    const alvos = Array.from(
      document.querySelectorAll<HTMLElement>("[data-revela], .mascara"),
    );

    // Antes de pintar: o que já está visível entra sem transição.
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

    // Rolagem suave. Inércia curta: o site tem que responder à roda, não brigar
    // com ela. Âncora, teclado e barra de rolagem continuam funcionando.
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      autoRaf: true,
    });

    function onClique(ev: MouseEvent) {
      // Pega tanto "#secao" quanto "/#secao". O menu usa a forma absoluta para
      // funcionar a partir de /estoque, e sem isto ela deixaria de rolar suave
      // quando o visitante já está na home.
      const alvo = (ev.target as HTMLElement).closest?.("a[href*='#']");
      if (!alvo) return;
      const href = alvo.getAttribute("href") ?? "";
      const id = href.slice(href.indexOf("#") + 1);
      if (!id) return;
      // Se a seção não existe nesta página, o link é para outra rota. Deixa o
      // navegador navegar.
      const destino = document.getElementById(id);
      if (!destino) return;
      ev.preventDefault();
      lenis.scrollTo(destino, { offset: -72 });
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
