"use client";
import { useEffect } from "react";

// Controlador único de cena. Um só laço de rAF escreve variáveis CSS e o resto do
// movimento acontece em transform e opacity no CSS. Padrão adaptado de
// motion-primitives-website/src/components/scroll/scroll-orchestrator.tsx e de
// effects/mouse-parallax.tsx, sem trazer a dependência de animação junto: o
// herói precisa de um valor compartilhado por várias camadas, não de uma mola
// por componente.
export function SceneMotion() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(pointer: fine) and (min-width: 761px)");
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>(".hero");
    const strip = document.querySelector<HTMLElement>(".running-strip");
    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    // Alvo do ponteiro e valor amortecido. A posição crua nunca vai direto para o
    // transform: cada plano multiplica esse valor pelo próprio fator de profundidade.
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let frame = 0;

    const showAll = () => reveals.forEach(item => item.classList.add("is-in"));

    const clear = () => {
      hero?.style.removeProperty("--cam");
      hero?.style.removeProperty("--px");
      hero?.style.removeProperty("--py");
      showAll();
    };

    // Se qualquer conta desta cena falhar, o texto continua sendo texto: o laço
    // desliga e tudo que dependia dele aparece. Nenhuma frase do site fica presa
    // esperando uma animação que quebrou.
    const tick = () => {
      try { paint(); } catch { clear(); frame = 0; }
    };

    const paint = () => {
      frame = 0;
      if (reduce.matches) { clear(); return; }

      if (hero) {
        const height = hero.offsetHeight || 1;
        // Passado o herói inteiro, --cam já saturou: continuar escrevendo o mesmo
        // valor a cada quadro só invalida a camada de graça.
        const cam = Math.min(Math.max(window.scrollY / height, 0), 1.15);
        if (cam < 1.15 || hero.style.getPropertyValue("--cam") !== "1.1500") {
          hero.style.setProperty("--cam", cam.toFixed(4));
        }
        currentX += (targetX - currentX) * 0.075;
        currentY += (targetY - currentY) * 0.075;
        hero.style.setProperty("--px", currentX.toFixed(4));
        hero.style.setProperty("--py", currentY.toFixed(4));
      }

      // Revelação medida no mesmo quadro. Sem observer paralelo, então nada fica
      // preso invisível se um disparo se perder.
      for (let i = reveals.length - 1; i >= 0; i--) {
        if (reveals[i].getBoundingClientRect().top < innerHeight * 0.9) {
          reveals[i].classList.add("is-in");
          reveals.splice(i, 1);
        }
      }

      if (Math.abs(targetX - currentX) > 0.0006 || Math.abs(targetY - currentY) > 0.0006) request();
    };

    const request = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const onMove = (event: MouseEvent) => {
      if (!fine.matches || reduce.matches) return;
      targetX = (event.clientX / innerWidth - 0.5) * 2;
      targetY = (event.clientY / innerHeight - 0.5) * 2;
      request();
    };
    const onLeave = () => { targetX = 0; targetY = 0; request(); };
    const onPreference = () => { targetX = 0; targetY = 0; currentX = 0; currentY = 0; request(); };

    // A marquise é a única animação infinita do site. Longe da tela ela para:
    // é um translate de largura dupla rodando a 60fps sem ninguém olhando.
    let watcher: IntersectionObserver | undefined;
    if (strip) {
      watcher = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) strip.removeAttribute("data-idle");
        else strip.setAttribute("data-idle", "");
      }, { rootMargin: "120px" });
      watcher.observe(strip);
    }

    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request, { passive: true });
    addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("mouseleave", onLeave);
    reduce.addEventListener("change", onPreference);
    fine.addEventListener("change", onPreference);
    request();

    return () => {
      cancelAnimationFrame(frame);
      watcher?.disconnect();
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
      removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      reduce.removeEventListener("change", onPreference);
      fine.removeEventListener("change", onPreference);
    };
  }, []);
  return null;
}
