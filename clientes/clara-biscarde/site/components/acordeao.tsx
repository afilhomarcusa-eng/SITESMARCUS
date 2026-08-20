"use client";

/**
 * Copiado de motion-primitives-website/src/components/layout/premium-layouts.tsx
 * (função Accordion).
 *
 * Adaptado: import de "motion/react", cores dos tokens no lugar do zinc,
 * acessibilidade completa (button, aria-expanded, aria-controls, região
 * rotulada) e desligamento em prefers-reduced-motion.
 *
 * Os 300ms ficam fora da faixa de 400 a 800ms do briefing de propósito: aquela
 * regra vale para revelação no scroll. Abrir e fechar por clique precisa
 * responder rápido, igual à transição do cabeçalho.
 */

import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

export interface ItemAcordeao {
  titulo: string;
  texto: string;
  faixa?: string;
  /** Situação que pede atendimento imediato. Ganha marcação em coral. */
  alerta?: boolean;
}

export function Acordeao({
  itens,
  abrirVarios = false,
}: {
  itens: ItemAcordeao[];
  abrirVarios?: boolean;
}) {
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const base = useId();
  const prefersReduced = usePrefersReducedMotion();

  const alternar = (chave: string) =>
    setAbertos((antes) => {
      const novo = new Set(antes);
      if (novo.has(chave)) {
        novo.delete(chave);
      } else {
        if (!abrirVarios) novo.clear();
        novo.add(chave);
      }
      return novo;
    });

  return (
    <div>
      {itens.map((item, i) => {
        const aberto = abertos.has(item.titulo);
        const idPainel = `${base}-painel-${i}`;
        const idBotao = `${base}-botao-${i}`;

        return (
          <div key={item.titulo} className="fio first:border-t-0">
            <h3>
              <button
                type="button"
                id={idBotao}
                aria-expanded={aberto}
                aria-controls={idPainel}
                onClick={() => alternar(item.titulo)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span>
                  {(item.faixa || item.alerta) && (
                    <span
                      className={
                        item.alerta
                          ? "mb-2 inline-block rounded-marca bg-coral px-2 py-0.5 text-micro uppercase tracking-[0.16em] text-tinta"
                          : "mb-2 block text-micro uppercase tracking-[0.16em] text-tinta-media"
                      }
                    >
                      {item.alerta ? "Procure ajuda agora" : item.faixa}
                    </span>
                  )}
                  <span className="block font-display text-grande leading-[1.25] text-oliva-texto transition-colors group-hover:text-tinta">
                    {item.titulo}
                  </span>
                </span>

                {/* Cruz que vira traço. Sem seta de template. */}
                <span
                  aria-hidden
                  className="relative mt-2 block h-3.5 w-3.5 shrink-0"
                >
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-coral-texto" />
                  <motion.span
                    className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-coral-texto"
                    animate={{ scaleY: aberto ? 0 : 1 }}
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                    }
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {aberto && (
                <motion.div
                  id={idPainel}
                  role="region"
                  aria-labelledby={idBotao}
                  initial={prefersReduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={prefersReduced ? undefined : { height: 0, opacity: 0 }}
                  transition={
                    prefersReduced
                      ? { duration: 0 }
                      : { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                  }
                  className="overflow-hidden"
                >
                  <p className="max-w-[52ch] pb-7 leading-[1.7] text-tinta-media">
                    {item.texto}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
