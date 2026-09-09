"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Movimento() {
  const rota = usePathname();

  useEffect(() => {
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduz) {
      document.querySelectorAll<HTMLElement>("[data-revelar], [data-entrada-foto]").forEach((el) => {
        el.dataset.revelar = "visivel";
        if ("entradaFoto" in el.dataset) el.dataset.entradaFoto = "visivel";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const contexto = gsap.context(() => {
      document.querySelectorAll<HTMLElement>("[data-revelar]").forEach((el) => {
        gsap.fromTo(el, { y: 26, opacity: 0 }, {
          y: 0, opacity: 1, duration: .72, ease: "power3.out", immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      document.querySelectorAll<HTMLElement>("[data-entrada-foto]").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, {
          clipPath: "inset(0% 0 0 0)", duration: .9, ease: "power4.out", immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (hero) {
        const espera = document.documentElement.dataset.abrir === "1" ? .92 : 0.04;
        const timeline = gsap.timeline({ delay: espera });
        timeline
          .fromTo(".hero-kicker", { opacity: 0, letterSpacing: ".22em" }, { opacity: 1, letterSpacing: ".12em", duration: .65, ease: "power3.out" })
          .fromTo(".hero-line > span", { yPercent: 112, filter: "blur(5px)" }, { yPercent: 0, filter: "blur(0px)", duration: .9, stagger: .12, ease: "power4.out" }, "-=.35")
          .fromTo(".hero-photo", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.35, ease: "power4.out" }, "-=.72")
          .fromTo(".hero-photo img", { scale: 1.07, filter: "blur(4px)" }, { scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out" }, "<")
          .fromTo(".hero-bottom", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7, ease: "power3.out" }, "-=.85")
          .fromTo(".hero-spec", { opacity: 0, x: 35 }, { opacity: 1, x: 0, duration: .75, ease: "power3.out" }, "-=.72")
          .fromTo(".hero-tech", { scaleX: 0 }, { scaleX: 1, duration: .8, ease: "expo.out" }, "-=.5");

        const foto = hero.querySelector<HTMLElement>(".hero-photo");
        if (foto) gsap.to(foto, { yPercent: -7, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      }
    });

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const planos = hero ? [...hero.querySelectorAll<HTMLElement>("[data-depth]")] : [];
    let frame = 0;
    const mover = (event: PointerEvent) => {
      if (!hero || matchMedia("(pointer: coarse)").matches) return;
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => planos.forEach((el) => {
        const f = el.dataset.depth === "back" ? 5 : el.dataset.depth === "photo" ? 10 : 16;
        gsap.to(el, { x: x * f, y: y * f, duration: 1.2, ease: "power3.out", overwrite: true });
      }));
    };
    hero?.addEventListener("pointermove", mover, { passive: true });

    return () => {
      hero?.removeEventListener("pointermove", mover);
      cancelAnimationFrame(frame);
      contexto.revert();
    };
  }, [rota]);

  return null;
}
