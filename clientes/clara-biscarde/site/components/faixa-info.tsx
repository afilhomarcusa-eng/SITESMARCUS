"use client";

/**
 * Faixa de informações que separa uma seção da outra, com os peões girando
 * entre um item e o outro.
 *
 * Antes o peão vinha numa linha própria acima da faixa, e as duas coisas
 * juntas ocupavam altura demais para o que são: um respiro entre seções. Agora
 * o peão é o separador, no lugar da bolinha — a quebra virou uma tira só e o
 * peão passou a andar junto com o texto em vez de disputar espaço com ele.
 *
 * O texto corre em laço, sem começo nem fim visível. Isso não é revelação de
 * conteúdo, é enfeite contínuo, então não cai na regra de 400 a 800ms do
 * briefing.
 *
 * O truque do laço sem emenda: a lista é repetida COPIAS vezes lado a lado e o
 * conjunto anda exatamente a largura de uma cópia. Quando a animação reinicia,
 * a cópia seguinte já está no lugar exato da anterior e ninguém vê o corte. Por
 * isso o deslocamento é -100/COPIAS por cento, e não um número redondo.
 *
 * A duração acompanha a quantidade de itens para a velocidade de leitura ficar
 * igual: mais informação cadastrada não deixa a faixa mais apressada.
 *
 * Fundo creme, igual ao das outras quebras. A faixa era uma tarja em oliva de
 * apoio, mas ela cortava a página em duas e puxava atenção demais para um
 * respiro entre seções. Sem a tarja, o texto tinta sobre creme é o mesmo par
 * do corpo do site, folgado em contraste, e a faixa vira parte do papel.
 */

import Image from "next/image";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";
import { faixaInfo } from "@/lib/clara";

/** Cópias lado a lado. O bastante para passar da largura de qualquer tela. */
const COPIAS = 6;
/** Segundos por item, para a faixa correr sempre no mesmo ritmo. */
const SEGUNDOS_POR_ITEM = 7;

/** Uma passada pela lista, com um peão antes de cada informação. */
function Passada() {
  return (
    <ul className="flex shrink-0 items-center">
      {faixaInfo.map((item, i) => (
        <li key={item} className="flex items-center gap-3.5 pr-8 md:pr-10">
          {/*
            A defasagem tira o ar de engrenagem: com todos no mesmo compasso a
            faixa inteira pisca junto, e o olho lê como falha.
          */}
          <Image
            src="/marca.png"
            alt=""
            aria-hidden
            width={429}
            height={564}
            sizes="32px"
            className="peao-gira h-5 w-auto shrink-0"
            style={{ animationDelay: `${(i % 3) * -0.8}s` }}
          />
          <span className="whitespace-nowrap text-mini text-tinta">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function FaixaInfo() {
  const prefersReduced = usePrefersReducedMotion();

  if (!faixaInfo.length) return null;

  /* Parada, a faixa vira uma tira de texto centrada. Continua informando. */
  if (prefersReduced) {
    return (
      <div className="overflow-hidden bg-creme py-3">
        <div className="flex justify-center">
          <Passada />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-creme py-3">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", `${-100 / COPIAS}%`] }}
        transition={{
          duration: faixaInfo.length * SEGUNDOS_POR_ITEM,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: COPIAS }, (_, i) => (
          /* Só a primeira cópia é lida em voz alta. O resto é repetição. */
          <div key={i} aria-hidden={i > 0} className="flex shrink-0">
            <Passada />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
