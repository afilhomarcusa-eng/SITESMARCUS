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

import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { cn, curva } from "@/lib/utils";
import {
  Conversa,
  Casa,
  Ponte,
  Bussola,
  Bandeira,
  Trilha,
} from "@/components/desenhos";
import { TrilhaDragao } from "@/components/trilha-dragao";

export interface ParadaJornada {
  desenho: "conversa" | "casa" | "ponte" | "bussola" | "bandeira";
  tipo: string;
  rotulo: string;
  titulo: string;
  texto: string;
  /** Opcional: a copy da Clara descreve o passo sem desdobrar em lista. */
  dicas?: string[];
}

const desenhos = {
  conversa: Conversa,
  casa: Casa,
  ponte: Ponte,
  bussola: Bussola,
  bandeira: Bandeira,
};

/* O tipo da parada já aparece no seletor, acima. Não repete aqui. */
function Painel({ parada }: { parada: ParadaJornada }) {
  return (
    <div>
      <h3 className="max-w-[26ch] font-display text-grande leading-[1.2] text-oliva-texto">
        {parada.titulo}
      </h3>

      <p className="mt-4 max-w-[62ch] leading-[1.7] text-tinta-media">
        {parada.texto}
      </p>

      {parada.dicas?.length ? (
      <ul className="mt-7 space-y-3.5">
        {(parada.dicas ?? []).map((dica) => (
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
      ) : null}
    </div>
  );
}

export function Jornada({ paradas }: { paradas: ParadaJornada[] }) {
  const [ativa, setAtiva] = useState(0);
  const base = useId();
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div>
      {/* ── Trilha horizontal, do tablet para cima ── */}
      <div className="hidden md:block">
        <div className="relative">
          <Trilha className="absolute inset-x-0 top-0 h-[4.5rem] w-full" />
          <TrilhaDragao className="absolute inset-x-0 top-0 h-[4.5rem] w-full" />

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

        {/* min-h calibrado para o texto mais longo dos passos, para o
           painel não pular de tamanho ao trocar de passo, sem sobrar o
           vão vazio que 20rem deixava nos passos mais curtos. */}
        <div className="mt-14 min-h-[11rem] border-l-2 border-coral pl-8">
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

      {/*
        ── Mobile ──
        Empilhado e fechado. Com as seis paradas abertas a seção passava de
        3.300px, um terço da página inteira num aparelho de 812px de altura.
        Aqui a pessoa toca na parada que interessa.
      */}
      <ol className="md:hidden">
        {paradas.map((p, i) => {
          const Desenho = desenhos[p.desenho];
          const aberta = i === ativa;
          const idPainel = `${base}-parada-${i}`;

          return (
            <li key={p.rotulo} className="fio first:border-t-0">
              <button
                type="button"
                aria-expanded={aberta}
                aria-controls={idPainel}
                onClick={() => setAtiva(aberta ? -1 : i)}
                className="flex w-full items-center gap-4 py-4 text-left"
              >
                {/* Ícone no fluxo, não deslocado para fora: no celular a
                    posição absoluta jogava o círculo para fora da tela. */}
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-creme transition-colors",
                    aberta
                      ? "border-coral text-coral-texto"
                      : "border-borda text-oliva"
                  )}
                >
                  <Desenho className="h-6 w-6" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-micro uppercase tracking-[0.14em] text-coral-texto">
                    {p.tipo}
                  </span>
                  <span className="mt-0.5 block font-display text-medio leading-[1.25] text-oliva-texto">
                    {p.rotulo}
                  </span>
                </span>

                {/* Cruz que vira traço, igual ao acordeão da outra seção */}
                <span
                  aria-hidden
                  className="relative block h-3.5 w-3.5 shrink-0"
                >
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-coral-texto" />
                  <motion.span
                    className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-coral-texto"
                    animate={{ scaleY: aberta ? 0 : 1 }}
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                    }
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {aberta && (
                  <motion.div
                    id={idPainel}
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
                    <div className="pb-8 pl-16">
                      <Painel parada={p} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
