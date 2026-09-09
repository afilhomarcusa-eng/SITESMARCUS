"use client";

import { useState } from "react";
import {
  endereco,
  contato,
  agendamentoRecomendado,
  diasAbertos,
  horaAbre,
  horaFecha,
  estrutura,
} from "@/lib/dados";
import { numeroDaSecao } from "@/lib/navegacao";
import { IconeMais } from "@/components/icones";

/**
 * Caixa de perguntas. Cartoes de papel levemente desalinhados; o escolhido
 * vem para a frente e a resposta se desdobra.
 *
 * Todas as perguntas sao logisticas. Nenhuma responde por elegibilidade
 * clinica, sintoma ou diagnostico: o site nao e instrumento de avaliacao.
 */
const perguntas = [
  {
    p: "Como faço para marcar?",
    r: `Pelo WhatsApp ${contato.telefoneExibicao}. ${agendamentoRecomendado}, então a primeira ida ao consultório já sai com dia e hora combinados.`,
  },
  {
    p: "Onde fica o consultório?",
    r: `${endereco.logradouro}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}. O mapa com a localização exata está logo abaixo, na seção de contato.`,
  },
  {
    p: "Quais dias e horários estão abertos?",
    r: `De ${diasAbertos[0].dia.toLowerCase()} a ${diasAbertos[diasAbertos.length - 1].dia.toLowerCase()}, das ${horaAbre} às ${horaFecha}. Sábado e domingo o consultório não abre.`,
  },
  {
    p: "O prédio é acessível?",
    r: `Sim. ${estrutura.join(". ")}.`,
  },
  {
    p: "Preciso contar o motivo pelo WhatsApp?",
    r: "Não. Basta dizer a idade da criança e que você quer um horário. O resto da conversa é melhor pessoalmente, no consultório.",
  },
  {
    p: "Tem atendimento online?",
    r: `Os horários publicados são do consultório, no ${endereco.bairro}. Se você precisa de outro formato, pergunte no WhatsApp: é o tipo de coisa que se responde melhor caso a caso.`,
  },
];

export function Duvidas() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section className="secao secao-duvidas" id="duvidas">
      <div className="envelope">
        <div className="cabeca-secao">
          <p className="rotulo">
            <span className="numero">{numeroDaSecao("duvidas")}</span> Dúvidas
          </p>
          <h2 className="titulo-secao">
            A caixa de
            <em> perguntas</em>
          </h2>
          <p className="texto-grande limitado">
            {perguntas.length} coisas que é melhor saber antes de mandar a
            primeira mensagem.
          </p>
        </div>

        <div className="caixa-perguntas">
          {perguntas.map((q, i) => {
            const ativa = aberta === i;
            return (
              <div
                key={q.p}
                className={`cartao ${ativa ? "cartao-aberto" : ""}`}
                style={{ "--giro": `${(i % 3) - 1}deg` } as React.CSSProperties}
              >
                <h3>
                  <button
                    type="button"
                    className="cartao-botao"
                    aria-expanded={ativa}
                    aria-controls={`resposta-${i}`}
                    onClick={() => setAberta(ativa ? null : i)}
                  >
                    <span>{q.p}</span>
                    <IconeMais className="cartao-mais" />
                  </button>
                </h3>
                <div id={`resposta-${i}`} className="cartao-resposta" hidden={!ativa}>
                  <p>{q.r}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
