"use client";

import { useId, useState } from "react";
import {
  endereco,
  estrutura,
  agendamentoRecomendado,
  diasAbertos,
  horaAbre,
  horaFecha,
  totalDiasAbertos,
} from "@/lib/dados";
import { numeroDaSecao } from "@/lib/navegacao";

/**
 * Quatro abas de papel, empilhadas como as guias de um fichario.
 * Cada valor mostrado sai de lib/dados. Nao existe aba com texto solto,
 * e nao existe aba sobre servico que a Milleny nao tenha publicado.
 *
 * A coluna da esquerda carrega o dado em tipografia grande, nao um icone
 * dentro de quadradinho: o fato E o elemento grafico.
 */
const abas = [
  {
    id: "onde",
    guia: "Onde",
    destaque: endereco.bairro,
    apoio: `${endereco.cidade}, ${endereco.estado}`,
    cor: "var(--cobalto)",
    corpo: (
      <>
        <p>
          O atendimento é presencial, em {endereco.logradouro}. O prédio fica a
          poucos minutos do Shopping Jardins.
        </p>
        <p className="aba-fraco">
          O mapa com a localização exata está na seção de contato.
        </p>
      </>
    ),
  },
  {
    id: "quando",
    guia: "Quando",
    destaque: `${horaAbre} às ${horaFecha}`,
    apoio: `${diasAbertos[0].dia} a ${diasAbertos[diasAbertos.length - 1].dia}`,
    cor: "var(--verde)",
    corpo: (
      <>
        <p>
          São {totalDiasAbertos} dias por semana. Sábado e domingo o consultório
          não abre.
        </p>
        <p className="aba-fraco">
          Dentro dessa faixa, o horário da sessão é combinado com a família.
        </p>
      </>
    ),
  },
  {
    id: "combinar",
    guia: "Como combina",
    destaque: "Hora marcada",
    apoio: "combinada antes, pelo WhatsApp",
    cor: "var(--coral)",
    corpo: (
      <>
        <p>
          {agendamentoRecomendado}, então o dia e a hora saem da conversa antes
          da primeira ida ao consultório.
        </p>
        <p className="aba-fraco">
          Assim ninguém espera com uma criança pequena no colo.
        </p>
      </>
    ),
  },
  {
    id: "acesso",
    guia: "Acessibilidade",
    destaque: "Cadeira de rodas",
    apoio: "acesso ao prédio",
    cor: "var(--ocre)",
    corpo: (
      <ul className="aba-lista">
        {estrutura.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ),
  },
];

export function Atendimento() {
  const [ativa, setAtiva] = useState(abas[0].id);
  const prefixo = useId();

  return (
    <section className="secao secao-atendimento" id="atendimento">
      <div className="envelope">
        <div className="cabeca-secao">
          <p className="rotulo">
            <span className="numero">{numeroDaSecao("atendimento")}</span> Atendimento
          </p>
          <h2 className="titulo-secao">
            O que está combinado
            <em> antes de vocês chegarem</em>
          </h2>
          <p className="texto-grande limitado">
            Onde fica, que dias abre e como o horário é combinado, para você não
            descobrir isso no dia.
          </p>
        </div>

        <div className="fichario">
          <div className="fichario-guias" role="tablist" aria-label="Detalhes do atendimento">
            {abas.map((a) => (
              <button
                key={a.id}
                type="button"
                role="tab"
                id={`${prefixo}-guia-${a.id}`}
                aria-selected={ativa === a.id}
                aria-controls={`${prefixo}-painel-${a.id}`}
                tabIndex={ativa === a.id ? 0 : -1}
                className={`guia ${ativa === a.id ? "guia-ativa" : ""}`}
                style={{ "--guia-cor": a.cor } as React.CSSProperties}
                onClick={() => setAtiva(a.id)}
                onKeyDown={(e) => {
                  const i = abas.findIndex((x) => x.id === ativa);
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const p = abas[(i + 1) % abas.length];
                    setAtiva(p.id);
                    document.getElementById(`${prefixo}-guia-${p.id}`)?.focus();
                  }
                  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const p = abas[(i - 1 + abas.length) % abas.length];
                    setAtiva(p.id);
                    document.getElementById(`${prefixo}-guia-${p.id}`)?.focus();
                  }
                }}
              >
                {a.guia}
              </button>
            ))}
          </div>

          {abas.map((a) => {
            return (
              <div
                key={a.id}
                role="tabpanel"
                id={`${prefixo}-painel-${a.id}`}
                aria-labelledby={`${prefixo}-guia-${a.id}`}
                hidden={ativa !== a.id}
                className="fichario-painel"
                style={{ "--guia-cor": a.cor } as React.CSSProperties}
              >
                <div className="painel-lado">
                  <h3 className="painel-destaque">
                    {a.destaque}
                    <span>{a.apoio}</span>
                  </h3>
                </div>
                <div className="painel-corpo">{a.corpo}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
