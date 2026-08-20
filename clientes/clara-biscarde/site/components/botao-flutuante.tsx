"use client";

/**
 * Botão flutuante de agendar.
 *
 * Decisão do Bloco 8: pílula coral com texto no lugar do círculo verde do
 * WhatsApp que as duas referências usam. O círculo verde é reconhecido como
 * plugin instalado em meio segundo.
 *
 * Física magnética copiada de
 * motion-primitives-website/src/components/effects/magnetic-button.tsx
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { curva } from "@/lib/utils";

export function BotaoFlutuante({ href }: { href: string }) {
  const [visivel, setVisivel] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mola = { stiffness: 250, damping: 9, mass: 0.6 };
  const sx = useSpring(x, mola);
  const sy = useSpring(y, mola);
  const ix = useTransform(sx, (v) => v * -0.3);
  const iy = useTransform(sy, (v) => v * -0.3);

  /*
    Acompanha o site inteiro. O único trecho em que ele não aparece é a capa,
    onde já existe um "Agendar pelo WhatsApp" do mesmo tamanho a dois palmos
    de distância — dois botões iguais na mesma tela viram ruído. Meia tela de
    scroll já libera, então na prática ele está sempre lá.
  */
  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.6);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const mover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current || prefersReduced) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };

  const classe =
    "fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 rounded-botao " +
    "bg-coral px-6 py-3.5 text-mini font-semibold uppercase tracking-[0.1em] " +
    "text-tinta shadow-[0_6px_24px_rgba(46,43,33,0.18)]";

  return (
    <AnimatePresence>
      {visivel && (
        <motion.a
          ref={ref}
          href={href}
          /* Sem canal cadastrado o destino é a própria seção de contato, e
             âncora interna não abre aba nova. */
          {...(href.startsWith("#")
            ? {}
            : { target: "_blank", rel: "noopener noreferrer" })}
          className={classe}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: curva }}
          style={prefersReduced ? undefined : { x: sx, y: sy }}
          onMouseMove={mover}
          onMouseLeave={() => {
            x.set(0);
            y.set(0);
          }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            className="flex items-center gap-2.5"
            style={prefersReduced ? undefined : { x: ix, y: iy }}
          >
            Agendar consulta
          </motion.span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
