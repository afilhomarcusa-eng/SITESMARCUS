"use client";

/**
 * A jornada. Trilha pontilhada com paradas ilustradas.
 *
 * Castelo e bandeira marcam conquista, dragão marca o momento difícil, ponte
 * marca travessia, bússola marca preparo. Clicar numa parada abre o painel com
 * o texto e as recomendações.
 *
 * Os desenhos são SVG de traço, nunca emoji, e conversam com o rabisco do
 * cérebro que já existe no logo. Vira lista empilhada no mobile.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn, curva } from "@/lib/utils";
import {
  Castelo,
  Dragao,
  Ponte,
  Bussola,
  Bandeira,
  Trilha,
} from "@/components/desenhos";

export interface ParadaJornada {
  desenho: "castelo" | "dragao" | "ponte" | "bussola" | "bandeira";
  tipo: string;
  rotulo: string;
  titulo: string;
  texto: string;
  dicas: string[];
}

const desenhos = {
  castelo: Castelo,
  dragao: Dragao,
  ponte: Ponte,
  bussola: Bussola,
  bandeira: Bandeira,
};

function Painel({ parada }: { parada: ParadaJornada }) {
  return (
    <div>
      <p className="text-micro uppercase tracking-[0.18em] text-coral-texto">
        {parada.tipo}
      </p>

      <h3 className="mt-3 max-w-[26ch] font-display text-grande leading-[1.2] text-oliva-texto">
        {parada.titulo}
      </h3>

      <p className="mt-4 max-w-[62ch] leading-[1.7] text-tinta-media">
        {parada.texto}
      </p>

      <ul className="mt-7 space-y-3.5">
        {parada.dicas.map((dica) => (
          <li key={dica} className="flex gap-3.5">
            {/* marcador de traço, não bolinha de lista padrão */}
            <span
              aria-hidden
              className="mt-[0.65em] h-px w-4 shrink-0 bg-coral"
            />
            <span className="max-w-[58ch] text-mini leading-[1.7] text-tinta-media">
              {dica}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Jornada({ paradas }: { paradas: ParadaJornada[] }) {
  const [ativa, setAtiva] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div>
      {/* ── Trilha horizontal, do tablet para cima ── */}
      <div className="hidden md:block">
        <div className="relative">
          <Trilha className="absolute inset-x-0 top-0 h-[4.5rem] w-full" />

          <ol className="relative flex items-start justify-between gap-2">
            {paradas.map((p, i) => {
              const Desenho = desenhos[p.desenho];
              const atual = i === ativa;

              return (
                <li key={p.rotulo} className="flex-1">
                  <button
                    type="button"
                    onClick={() => setAtiva(i)}
                    aria-current={atual ? "step" : undefined}
                    className="group flex w-full flex-col items-center gap-3 px-1"
                  >
                    <motion.span
                      className={cn(
                        "flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border bg-creme transition-colors",
                        atual
                          ? "border-coral text-coral-texto"
                          : "border-borda text-oliva group-hover:border-oliva group-hover:text-tinta-media"
                      )}
                      animate={
                        prefersReduced ? undefined : { scale: atual ? 1.1 : 1 }
                      }
                      transition={{ duration: 0.3, ease: curva }}
                    >
                      <Desenho className="h-10 w-10" />
                    </motion.span>

                    <span className="flex flex-col items-center gap-1">
                      <span
                        className={cn(
                          "text-micro uppercase tracking-[0.14em] transition-colors",
                          atual ? "text-coral-texto" : "text-tinta-media"
                        )}
                      >
                        {p.tipo}
                      </span>
                      <span
                        className={cn(
                          "max-w-[15ch] text-center text-mini leading-[1.3] transition-colors",
                          atual ? "text-tinta" : "text-tinta-media"
                        )}
                      >
                        {p.rotulo}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-14 min-h-[20rem] border-l-2 border-coral pl-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={ativa}
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: curva }}
            >
              <Painel parada={paradas[ativa]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Empilhado no mobile, tudo aberto ── */}
      <ol className="space-y-12 md:hidden">
        {paradas.map((p, i) => {
          const Desenho = desenhos[p.desenho];
          return (
            <li
              key={p.rotulo}
              className="relative border-l border-dashed border-oliva pb-2 pl-8"
            >
              <span className="absolute -left-[1.6rem] top-0 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border border-coral bg-creme text-coral-texto">
                <Desenho className="h-7 w-7" />
              </span>
              <div className="pt-16">
                <p className="text-micro uppercase tracking-[0.14em] text-tinta-media">
                  {p.tipo} · parada {i + 1}
                </p>
                <Painel parada={p} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
