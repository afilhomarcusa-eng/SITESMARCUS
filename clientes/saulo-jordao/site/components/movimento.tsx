"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * O movimento do site inteiro, num componente só.
 *
 * Duas coisas: revelar o que entra na tela, e dar profundidade ao herói quando
 * o ponteiro anda por cima dele.
 *
 * A revelação é máscara vertical, não opacidade com translateY em tudo, que é
 * a assinatura de site gerado. Quem esconde é o CSS, e o CSS só esconde quando
 * `html[data-js="1"]`, marcado pelo script bloqueante do head. Sem JavaScript
 * nada fica escondido esperando um observador que nunca vai rodar.
 *
 * A profundidade do ponteiro é interpolada, nunca ligada direto na posição do
 * mouse, e não existe em tela de toque.
 */
export default function Movimento() {
  const rota = usePathname();

  useEffect(() => {
    const suave = matchMedia("(prefers-reduced-motion: reduce)");
    if (suave.matches) {
      document
        .querySelectorAll<HTMLElement>("[data-revelar], [data-entrada-foto]")
        .forEach((el) => {
          el.dataset.revelar = "visivel";
          if ("entradaFoto" in el.dataset) el.dataset.entradaFoto = "visivel";
        });
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if ("revelar" in el.dataset) el.dataset.revelar = "visivel";
          if ("entradaFoto" in el.dataset) el.dataset.entradaFoto = "visivel";
          observador.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    document
      .querySelectorAll<HTMLElement>("[data-revelar], [data-entrada-foto]")
      .forEach((el) => observador.observe(el));

    return () => observador.disconnect();
  }, [rota]);

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const planos = [...document.querySelectorAll<HTMLElement>("[data-plano]")];
    if (!planos.length) return;

    // Fundo anda pouco, frente anda mais. Os números são os do briefing, em
    // pixels de deslocamento máximo.
    const forca: Record<string, number> = { fundo: 4, meio: 8, frente: 16 };
    let alvoX = 0;
    let alvoY = 0;
    let x = 0;
    let y = 0;
    let quadro = 0;

    const mover = (ev: PointerEvent) => {
      alvoX = (ev.clientX / innerWidth - 0.5) * 2;
      alvoY = (ev.clientY / innerHeight - 0.5) * 2;
      if (!quadro) quadro = requestAnimationFrame(passo);
    };

    const passo = () => {
      // Amortecimento. Ligar a transformação direto na posição do ponteiro
      // deixa o movimento nervoso e denuncia o truque.
      x += (alvoX - x) * 0.07;
      y += (alvoY - y) * 0.07;

      for (const el of planos) {
        const f = forca[el.dataset.plano ?? "meio"] ?? 8;
        el.style.transform = `translate3d(${(-x * f).toFixed(2)}px, ${(-y * f).toFixed(2)}px, 0)`;
      }

      quadro =
        Math.abs(alvoX - x) > 0.001 || Math.abs(alvoY - y) > 0.001
          ? requestAnimationFrame(passo)
          : 0;
    };

    addEventListener("pointermove", mover, { passive: true });
    return () => {
      removeEventListener("pointermove", mover);
      if (quadro) cancelAnimationFrame(quadro);
      for (const el of planos) el.style.transform = "";
    };
  }, [rota]);

  return null;
}
