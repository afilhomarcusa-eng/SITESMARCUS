"use client";

import { useId, useState } from "react";
import { ArrowUpRight } from "./chrome";

const questions = [
  ["Posso trocar de modalidade?", "Modalidades", "Você pode experimentar Funcional, Performance, Spinning, Corrida, Weekend e Abitah Day. A disponibilidade varia por unidade."],
  ["Como escolho minha unidade?", "Primeiro passo", "Compare localização, estrutura e horários na seção de unidades e fale diretamente com a equipe."],
  ["Preciso já treinar para começar?", "Para quem começa", "Não. A aula experimental é adaptada ao seu nível e acompanhada de perto."],
  ["Como funciona a aula experimental?", "Primeiro encontro", "Você conhece o espaço, conversa com a equipe e realiza uma experiência orientada."],
  ["O que preciso levar?", "Dia de treino", "Roupas confortáveis, tênis e uma garrafinha de água. Chegue alguns minutos antes."],
];

export function FaqEntries({ entries = questions }: { entries?: string[][] }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  return <div className="faq-index-list">
    {entries.map(([question, context, answer], i) => {
      const expanded = open === i;
      const trigger = `${id}-question-${i}`, panel = `${id}-answer-${i}`;
      return <div className={expanded ? "faq-index-row is-open" : "faq-index-row"} key={question}>
        <h3>
          <button className="faq-index-trigger" type="button" id={trigger} aria-expanded={expanded} aria-controls={panel} onClick={() => setOpen(expanded ? null : i)}>
            <span className="faq-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="faq-question"><strong>{question}</strong><small>{context}</small></span>
            <ArrowUpRight />
          </button>
        </h3>
        <div className="faq-collapse" id={panel} role="region" aria-labelledby={trigger} aria-hidden={!expanded} inert={!expanded}>
          <div><div className="faq-index-answer"><span>{context}</span><p>{answer}</p></div></div>
        </div>
      </div>;
    })}
  </div>;
}

export function FaqIndex() {
  return <section className="faq-index section" id="perguntas" aria-labelledby="faq-heading"><div className="shell">
    <header className="faq-index-head">
      <div><span className="tag">Perguntas frequentes</span><h2 id="faq-heading">Dúvidas antes<br />do primeiro treino.</h2></div>
      <span className="faq-count">01 — 05<br /><small>ABITAH / FAQ</small></span>
    </header>
    <FaqEntries />
  </div></section>;
}
