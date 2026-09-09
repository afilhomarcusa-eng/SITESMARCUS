"use client";

import { useState } from "react";
import {
  endereco,
  contato,
  horarios,
  estrutura,
  linkWhatsApp,
} from "@/lib/dados";
import { numeroDaSecao } from "@/lib/navegacao";
import {
  IconeLocal,
  IconeRelogio,
  IconeAcesso,
  IconeInstagram,
  Seta,
} from "@/components/icones";

/**
 * Nao existe servidor por tras deste site, entao o formulario nao finge que
 * envia: ele monta a mensagem e abre o WhatsApp com ela pronta, visivel ao
 * lado enquanto a pessoa digita.
 *
 * Nenhum campo e obrigatorio. Campo vazio some da mensagem, e a mensagem
 * continua fazendo sentido com uma linha so.
 *
 * Nenhum campo pergunta sintoma, diagnostico, medicacao ou historico. Isso
 * nao se escreve em formulario aberto de site.
 *
 * Para plugar um destino de verdade depois, troque so a funcao montaMensagem
 * e o href do botao de envio.
 */
const periodos = ["Manhã", "Tarde", "Tanto faz"] as const;

export function Contato() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [periodo, setPeriodo] = useState<string>("");

  const linhas = [
    "Olá, Milleny. Vim pelo site.",
    nome.trim() && `Meu nome é ${nome.trim()}.`,
    idade.trim() && `A criança tem ${idade.trim()}.`,
    periodo && `O melhor período para mim é: ${periodo.toLowerCase()}.`,
    "Gostaria de saber sobre horários para atendimento.",
  ].filter(Boolean) as string[];

  const mensagem = linhas.join(" ");

  return (
    <section className="secao secao-contato" id="contato">
      <div className="envelope">
        <div className="cabeca-secao">
          <p className="rotulo">
            <span className="numero">{numeroDaSecao("contato")}</span> Contato
          </p>
          <h2 className="titulo-secao">
            Onde fica e
            <em> como falar comigo</em>
          </h2>
        </div>

        <div className="contato-grade">
          {/* -------- coluna de dados -------- */}
          <div className="contato-dados">
            <div className="dado">
              <span className="dado-icone" aria-hidden="true"><IconeLocal /></span>
              <div>
                <h3>Endereço</h3>
                <p>
                  {endereco.logradouro}
                  <br />
                  {endereco.bairro}, {endereco.cidade}, {endereco.estado}
                  <br />
                  CEP {endereco.cep}
                </p>
                <a
                  className="link-sublinhado"
                  href={contato.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir no Google Maps
                  <Seta className="seta" />
                </a>
              </div>
            </div>

            <div className="dado">
              <span className="dado-icone" aria-hidden="true"><IconeRelogio /></span>
              <div>
                <h3>Horário</h3>
                <table className="tabela-horario">
                  <tbody>
                    {horarios.map((h) => (
                      <tr key={h.dia} className={h.abre ? "" : "dia-fechado"}>
                        <th scope="row">{h.dia}</th>
                        <td>{h.abre ? `${h.abre} às ${h.fecha}` : "Fechado"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="dado">
              <span className="dado-icone" aria-hidden="true"><IconeAcesso /></span>
              <div>
                <h3>Acessibilidade</h3>
                <ul className="lista-simples">
                  {estrutura.map((e) => <li key={e}>{e}</li>)}
                </ul>
              </div>
            </div>

            <div className="dado">
              <span className="dado-icone" aria-hidden="true"><IconeInstagram /></span>
              <div>
                <h3>Instagram</h3>
                <a
                  className="link-sublinhado"
                  href={contato.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{contato.instagramUsuario}
                  <Seta className="seta" />
                </a>
              </div>
            </div>
          </div>

          {/* -------- formulario que monta a mensagem -------- */}
          <div className="contato-forma">
            <h3 className="forma-titulo">Monte sua mensagem</h3>
            <p className="forma-nota">
              Nada é obrigatório. O que você deixar em branco simplesmente não
              entra no texto.
            </p>

            <div className="campo">
              <label htmlFor="c-nome">Seu nome</label>
              <input
                id="c-nome"
                name="nome"
                type="text"
                autoComplete="name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="campo">
              <label htmlFor="c-idade">Idade da criança</label>
              <input
                id="c-idade"
                name="idade"
                type="text"
                inputMode="text"
                placeholder="4 anos"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
              />
            </div>

            <fieldset className="campo campo-periodo">
              <legend>Melhor período para conversar</legend>
              <div className="periodo-opcoes">
                {periodos.map((p) => (
                  <label key={p} className={periodo === p ? "periodo-ativo" : ""}>
                    <input
                      type="radio"
                      name="periodo"
                      value={p}
                      checked={periodo === p}
                      onChange={() => setPeriodo(p)}
                    />
                    {p}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="previa" aria-live="polite">
              <span className="rotulo">Vai chegar assim</span>
              <p>{mensagem}</p>
            </div>

            <a
              data-cta="formulario"
              className="btn btn-primario btn-largo"
              href={linkWhatsApp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir o WhatsApp com esse texto
              <Seta className="seta" />
            </a>

            <p className="forma-aviso">
              A mensagem abre no seu WhatsApp para você ler antes de enviar.
              Nada é gravado neste site. Não escreva aqui sintoma, diagnóstico
              ou histórico de saúde.
            </p>
          </div>
        </div>

        {/* mapa: carrega so quando chega perto, e nao vira imagem cinza */}
        <div className="mapa">
          <iframe
            title={`Mapa com a localização do consultório em ${endereco.bairro}`}
            src={`https://www.google.com/maps?q=${endereco.latitude},${endereco.longitude}&hl=pt-BR&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
