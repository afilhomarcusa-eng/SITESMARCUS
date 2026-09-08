"use client";

import { useMemo, useState } from "react";
import { montarMensagem, type Formulario } from "@/lib/formularios";
import { whatsapp } from "@/lib/contato";
import { Conversa } from "./icones";

/**
 * O formulário.
 *
 * Não existe servidor por trás dele e ele não finge que existe. O que a pessoa
 * digita vira uma mensagem, ela lê a mensagem inteira ao lado enquanto escreve,
 * e o botão abre o WhatsApp com o texto pronto. Nada se perde no meio, e o
 * corretor recebe todo pedido no mesmo formato.
 *
 * Nenhum campo é obrigatório. Campo em branco não vira linha, e uma linha só
 * continua sendo uma mensagem que faz sentido do outro lado.
 *
 * Sem JavaScript o botão continua funcionando: ele nasce no HTML já com a
 * mensagem de abertura, então abre uma conversa de verdade em vez de não fazer
 * nada. O que muda com script é só o texto ficar mais completo.
 */
export default function FormularioContato({ formulario }: { formulario: Formulario }) {
  const [valores, setValores] = useState<Record<string, string>>({});

  const mensagem = useMemo(
    () => montarMensagem(formulario, valores),
    [formulario, valores],
  );

  const preenchidos = Object.values(valores).filter((v) => v.trim()).length;

  return (
    <div className="form-grade">
      <form
        className="campos"
        onSubmit={(e) => e.preventDefault()}
        data-formulario={formulario.chave}
      >
        {formulario.campos.map((campo) => {
          const id = `campo-${campo.id}`;
          return (
            <div
              key={campo.id}
              className={`campo${campo.largo ? " campo-largo" : ""}`}
            >
              <label htmlFor={id}>{campo.rotulo}</label>

              {campo.tipo === "lista" ? (
                <select
                  id={id}
                  name={campo.id}
                  value={valores[campo.id] ?? ""}
                  onChange={(e) =>
                    setValores((v) => ({ ...v, [campo.id]: e.target.value }))
                  }
                >
                  <option value="">Escolher</option>
                  {campo.opcoes?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : campo.tipo === "longo" ? (
                <textarea
                  id={id}
                  name={campo.id}
                  value={valores[campo.id] ?? ""}
                  onChange={(e) =>
                    setValores((v) => ({ ...v, [campo.id]: e.target.value }))
                  }
                />
              ) : (
                <input
                  id={id}
                  name={campo.id}
                  type="text"
                  value={valores[campo.id] ?? ""}
                  onChange={(e) =>
                    setValores((v) => ({ ...v, [campo.id]: e.target.value }))
                  }
                />
              )}

              {campo.dica ? <small>{campo.dica}</small> : null}
            </div>
          );
        })}

        <div className="form-envio">
          <a
            className="acao"
            href={whatsapp(mensagem)}
            target="_blank"
            rel="noopener"
            data-conversa="formulario"
            data-enviar
          >
            <Conversa />
            {formulario.botao}
          </a>
          <span className="fino">
            {preenchidos === 0
              ? "Nenhum campo é obrigatório"
              : preenchidos === 1
                ? "1 campo preenchido"
                : `${preenchidos} campos preenchidos`}
          </span>
        </div>
      </form>

      <aside className="previa" aria-live="polite">
        <h2>A mensagem que vai chegar</h2>
        <p className="previa-texto" data-previa>
          {mensagem}
        </p>
        <p className="previa-aviso">
          Nada é enviado por este site. O botão abre a sua conversa no WhatsApp
          com esse texto já escrito, e você manda quando quiser.
        </p>
        <noscript>
          <p className="previa-aviso">
            Com o JavaScript desligado, o botão abre a conversa com a primeira
            linha. O resto você escreve direto no WhatsApp.
          </p>
        </noscript>
      </aside>
    </div>
  );
}
