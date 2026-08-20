"use client";

/**
 * Formulário que monta a mensagem e abre o WhatsApp já preenchido.
 *
 * Não existe backend aqui e nem precisa: o envio é um link wa.me com o texto
 * pronto. A pessoa revisa no próprio WhatsApp antes de mandar, o que costuma
 * dar mais confiança do que um formulário que responde "enviado com sucesso" e
 * some.
 *
 * Enquanto o número dela não estiver em lib/clara.ts, o botão não inventa
 * destino: avisa que o canal ainda não foi cadastrado. Campo de contato nunca
 * é chutado neste projeto.
 *
 * Os campos usam texto de 16px de propósito. Abaixo disso o iOS dá zoom
 * sozinho ao focar, e o celular é a maior parte do público aqui.
 */

import { useId, useState } from "react";
import { clara } from "@/lib/clara";

const ATENDIMENTOS = ["Criança", "Adolescente", "Ainda não sei"];

const campo =
  "mt-2 w-full rounded-campo border border-borda bg-creme px-4 py-3 " +
  "text-base text-tinta placeholder:text-tinta-media/55 " +
  "transition-colors duration-200 focus:border-oliva";

const rotulo = "block text-micro uppercase tracking-[0.16em] text-tinta-media";

export function FormularioContato() {
  const base = useId();
  const [pendente, setPendente] = useState(false);

  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clara.whatsapp) {
      setPendente(true);
      return;
    }

    const dados = new FormData(e.currentTarget);
    const valor = (nome: string) => String(dados.get(nome) ?? "").trim();

    /* Os dados viram um bloco só, e o recado fica separado dele por uma linha
       em branco. Montar tudo numa lista única não dá: o separador vazio cai
       no filter junto com os campos que a pessoa deixou em branco. */
    const identificacao = [
      `Nome: ${valor("nome")}`,
      valor("atendimento") && `Atendimento: ${valor("atendimento")}`,
      valor("whatsapp") && `WhatsApp: ${valor("whatsapp")}`,
      valor("email") && `E-mail: ${valor("email")}`,
    ].filter(Boolean);

    const blocos = ["Oi Clara, vim pelo site.", identificacao.join("\n")];
    const recado = valor("mensagem");
    if (recado) blocos.push(recado);

    const url = `https://wa.me/${clara.whatsapp}?text=${encodeURIComponent(
      blocos.join("\n\n"),
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={enviar} className="mt-8 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${base}-nome`} className={rotulo}>
            Nome
          </label>
          <input
            id={`${base}-nome`}
            name="nome"
            type="text"
            required
            autoComplete="name"
            placeholder="Seu nome completo"
            className={campo}
          />
        </div>

        <div>
          <label htmlFor={`${base}-whatsapp`} className={rotulo}>
            WhatsApp
          </label>
          <input
            id={`${base}-whatsapp`}
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="DDD e número"
            className={campo}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${base}-email`} className={rotulo}>
            E-mail
          </label>
          <input
            id={`${base}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            className={campo}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${base}-atendimento`} className={rotulo}>
            Para quem é o atendimento
          </label>
          <div className="relative">
            <select
              id={`${base}-atendimento`}
              name="atendimento"
              defaultValue=""
              className={`${campo} appearance-none pr-11`}
            >
              <option value="" disabled>
                Selecione…
              </option>
              {ATENDIMENTOS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-tinta-media"
            >
              <path
                d="M3 6l5 5 5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${base}-mensagem`} className={rotulo}>
            Mensagem{" "}
            <span className="normal-case tracking-normal">(opcional)</span>
          </label>
          <textarea
            id={`${base}-mensagem`}
            name="mensagem"
            rows={4}
            placeholder="Conte em duas linhas o que está acontecendo."
            className={`${campo} resize-y`}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col items-start gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2.5 rounded-botao bg-coral px-7 py-3.5 text-mini font-semibold uppercase tracking-[0.1em] text-tinta transition-transform duration-300 hover:scale-[1.03]"
        >
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4">
            <path
              d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Enviar via WhatsApp
        </button>

        {pendente && (
          <p
            role="status"
            className="max-w-[46ch] text-mini leading-[1.7] text-coral-texto"
          >
            O WhatsApp da Clara ainda não foi cadastrado em{" "}
            <code>lib/clara.ts</code>. Assim que o número entrar, este botão
            abre a conversa com a mensagem já escrita.
          </p>
        )}
      </div>
    </form>
  );
}
