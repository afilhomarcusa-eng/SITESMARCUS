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
import { IconeLocal, IconeRelogio, IconeAcesso } from "@/components/icones";

/**
 * Quatro abas de papel, empilhadas como as guias de um fichario.
 * Cada valor mostrado sai de lib/dados. Nao existe aba com texto solto,
 * e nao existe aba sobre servico que a Milleny nao tenha publicado.
 */
const abas = [
  {
    id: "onde",
    guia: "Onde",
    titulo: "No consultório, no bairro Jardins",
    Icone: IconeLocal,
    cor: "var(--cobalto)",
    corpo: (
      <>
        <p>
          O atendimento acontece presencialmente em {endereco.logradouro},{" "}
          {endereco.bairro}, {endereco.cidade}.
        </p>
        <p className="aba-fraco">
          O prédio fica a poucos minutos do Shopping Jardins. O mapa com a
          localização exata está na seção de contato.
        </p>
      </>
    ),
  },
  {
    id: "quando",
    guia: "Quando",
    titulo: `${totalDiasAbertos} dias por semana, das ${horaAbre} às ${horaFecha}`,
    Icone: IconeRelogio,
    cor: "var(--verde)",
    corpo: (
      <>
        <p>
          Atendo de {diasAbertos[0].dia.toLowerCase()} a{" "}
          {diasAbertos[diasAbertos.length - 1].dia.toLowerCase()}, das {horaAbre}{" "}
          às {horaFecha}. Sábado e domingo o consultório fica fechado.
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
    titulo: "Com hora marcada, sempre",
    Icone: IconeRelogio,
    cor: "var(--coral)",
    corpo: (
      <>
        <p>
          {agendamentoRecomendado}. A conversa começa no WhatsApp e o horário é
          acertado antes da primeira ida ao consultório.
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
    titulo: "Entrada, banheiro e estacionamento acessíveis",
    Icone: IconeAcesso,
    cor: "var(--ocre)",
    corpo: (
      <>
        <ul className="aba-lista">
          {estrutura.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </>
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
            const Icone = a.Icone;
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
                  <span className="painel-icone" aria-hidden="true">
                    <Icone />
                  </span>
                  <h3 className="painel-titulo">{a.titulo}</h3>
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
