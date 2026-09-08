"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CONTATO, whatsapp } from "@/lib/contato";
import { opcoes } from "@/lib/filtros";
import { CARROS_INICIAIS } from "@/lib/carros";
import { useEstoque } from "@/lib/estoque";
import { brl } from "@/lib/fmt";

/**
 * Diga o que você procura.
 *
 * Este formulário não envia nada para lugar nenhum, e isso é de propósito.
 *
 * A loja não tem servidor nem CRM. Um formulário que diz "enviado com sucesso"
 * e não manda nada é pior do que não existir: o cliente perde o contato e nunca
 * fica sabendo. Então aqui os campos montam uma mensagem, o visitante lê a
 * mensagem inteira antes de mandar, e o botão abre o WhatsApp com ela pronta.
 *
 * Nada é obrigatório. Quem quiser escrever só uma linha manda só uma linha; a
 * mensagem se ajusta e continua fazendo sentido. Campo obrigatório em
 * formulário de interesse só serve para o visitante desistir no meio.
 *
 * Sem JavaScript, o botão vira um link para a conversa em branco e o número
 * aparece escrito, então ninguém fica sem caminho.
 */

const FAIXAS = [
  "Até 50 mil",
  "De 50 a 80 mil",
  "De 80 a 120 mil",
  "De 120 a 200 mil",
  "Acima de 200 mil",
];

const PAGAMENTOS = ["À vista", "Financiado", "Com entrada e financiamento", "Ainda decidindo"];

const campo =
  "w-full bg-transparent px-4 py-3 text-[0.92rem] outline-none transition-colors duration-200";

function Campo({
  rotulo,
  dica,
  children,
}: {
  rotulo: string;
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="etiqueta mb-2 block">{rotulo}</span>
      {children}
      {dica ? (
        <span className="mt-1.5 block text-[0.72rem]" style={{ color: "var(--tinta-3)" }}>
          {dica}
        </span>
      ) : null}
    </label>
  );
}

export default function Procuro() {
  const estoque = useEstoque(CARROS_INICIAIS);
  const marcas = useMemo(() => opcoes(estoque).marcas, [estoque]);

  const [f, setF] = useState({
    nome: "",
    procura: "",
    marca: "",
    faixa: "",
    ano: "",
    pagamento: "",
    troca: "",
    observacao: "",
  });

  const muda = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((x) => ({ ...x, [k]: e.target.value }));

  /**
   * A mensagem.
   *
   * Só entra no texto o que foi preenchido. Uma mensagem cheia de "não
   * informado" faz o visitante parecer desorganizado e a loja perder tempo
   * lendo linha vazia.
   */
  const mensagem = useMemo(() => {
    const linhas: string[] = [];
    linhas.push(
      f.nome.trim()
        ? `Olá! Aqui é ${f.nome.trim()}, vim pelo site da Delux Motors.`
        : "Olá! Vim pelo site da Delux Motors.",
    );
    linhas.push("");

    if (f.procura.trim()) linhas.push(`Procuro: ${f.procura.trim()}`);
    if (f.marca) linhas.push(`Marca de preferência: ${f.marca}`);
    if (f.faixa) linhas.push(`Faixa de preço: ${f.faixa}`);
    if (f.ano.trim()) linhas.push(`Ano a partir de: ${f.ano.trim()}`);
    if (f.pagamento) linhas.push(`Pagamento: ${f.pagamento}`);
    if (f.troca.trim()) linhas.push(`Tenho para dar na troca: ${f.troca.trim()}`);
    if (f.observacao.trim()) {
      linhas.push("");
      linhas.push(f.observacao.trim());
    }

    // Ninguém preencheu nada: a mensagem ainda precisa abrir uma conversa.
    if (linhas.length === 2) {
      linhas.push("Queria ver os carros que vocês têm disponíveis.");
    }

    return linhas.join("\n");
  }, [f]);

  const preencheu = Object.values(f).some((v) => v.trim());

  return (
    <div className="casca">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        {/* ------------------------------------------------------ formulário */}
        <div>
          <p className="etiqueta mb-4">Diga o que procura</p>
          <h1 className="display mb-5 max-w-[16ch] text-[clamp(2rem,4.6vw,3.4rem)]">
            A gente procura o carro por você
          </h1>
          <p className="corpo mb-10 max-w-[48ch]">
            O estoque gira toda semana e nem tudo chega a ser publicado. Diga o
            que você quer e a equipe avisa quando entrar. Nada aqui é
            obrigatório: preencha só o que fizer sentido.
          </p>

          <form
            className="grid gap-6"
            onSubmit={(e) => e.preventDefault()}
            aria-describedby="como-funciona"
          >
            <Campo rotulo="Seu nome" dica="Só para a equipe saber como te chamar.">
              <input
                type="text"
                value={f.nome}
                onChange={muda("nome")}
                autoComplete="name"
                className={campo}
                style={{ border: "1px solid var(--linha)" }}
              />
            </Campo>

            <Campo
              rotulo="O que você procura"
              dica="Pode ser um modelo, um tipo de carro ou só o uso: SUV para a família, picape para trabalho."
            >
              <textarea
                rows={3}
                value={f.procura}
                onChange={muda("procura")}
                className={campo}
                style={{ border: "1px solid var(--linha)", resize: "vertical" }}
              />
            </Campo>

            <div className="grid gap-6 sm:grid-cols-2">
              <Campo rotulo="Marca de preferência">
                <select
                  value={f.marca}
                  onChange={muda("marca")}
                  className={campo}
                  style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
                >
                  <option value="">Tanto faz</option>
                  {marcas.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="Outra">Outra</option>
                </select>
              </Campo>

              <Campo rotulo="Faixa de preço">
                <select
                  value={f.faixa}
                  onChange={muda("faixa")}
                  className={campo}
                  style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
                >
                  <option value="">Ainda não sei</option>
                  {FAIXAS.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Campo rotulo="Ano a partir de">
                <input
                  type="text"
                  inputMode="numeric"
                  value={f.ano}
                  onChange={muda("ano")}
                  placeholder="2018"
                  className={campo}
                  style={{ border: "1px solid var(--linha)" }}
                />
              </Campo>

              <Campo rotulo="Como pretende pagar">
                <select
                  value={f.pagamento}
                  onChange={muda("pagamento")}
                  className={campo}
                  style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
                >
                  <option value="">Prefiro falar depois</option>
                  {PAGAMENTOS.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>

            <Campo
              rotulo="Tem carro para dar na troca"
              dica="Modelo, ano e quilometragem já ajudam a equipe a fazer a conta."
            >
              <input
                type="text"
                value={f.troca}
                onChange={muda("troca")}
                className={campo}
                style={{ border: "1px solid var(--linha)" }}
              />
            </Campo>

            <Campo rotulo="Mais alguma coisa">
              <textarea
                rows={3}
                value={f.observacao}
                onChange={muda("observacao")}
                className={campo}
                style={{ border: "1px solid var(--linha)", resize: "vertical" }}
              />
            </Campo>
          </form>
        </div>

        {/* ------------------------------------------------------- a mensagem */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="p-6 md:p-8" style={{ background: "var(--nuvem)" }}>
            <p className="etiqueta mb-4">A mensagem que vai ser enviada</p>

            {/* O visitante lê antes de mandar. Nada é enviado sem ele ver. */}
            <pre
              data-previa
              className="mb-7 max-h-[42svh] overflow-auto whitespace-pre-wrap break-words text-[0.9rem] leading-relaxed"
              style={{ color: "var(--tinta-2)", fontFamily: "inherit", margin: 0 }}
            >
              {mensagem}
            </pre>

            <a
              data-cta="procuro"
              href={whatsapp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-6 px-6 py-5 text-[0.78rem] font-medium uppercase tracking-[0.14em]"
              style={{ background: "var(--tinta)", color: "var(--branco)" }}
            >
              {preencheu ? "Enviar no WhatsApp" : "Abrir o WhatsApp"}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                style={{ transitionTimingFunction: "var(--e-saida)" }}
              >
                &rarr;
              </span>
            </a>

            <p id="como-funciona" className="mt-4 text-[0.8rem]" style={{ color: "var(--tinta-3)" }}>
              O botão abre a conversa com o texto acima já escrito. Você confere e
              envia. Nada sai daqui antes disso.
            </p>

            <noscript>
              <p className="mt-4 text-[0.85rem]" style={{ color: "var(--tinta-2)" }}>
                Os campos acima precisam de JavaScript para montar a mensagem.
                Chame direto no {CONTATO.exibicao} e diga o que procura.
              </p>
            </noscript>
          </div>

          <p className="mt-6 text-[0.85rem]" style={{ color: "var(--tinta-2)" }}>
            Prefere ver o que já está na loja?{" "}
            <Link
              href="/estoque"
              className="underline underline-offset-4 hover:text-[var(--tinta)]"
            >
              São {estoque.length} carros no estoque
            </Link>
            {estoque.length ? (
              <>
                , de {brl(Math.min(...estoque.map((c) => c.preco)))} a{" "}
                {brl(Math.max(...estoque.map((c) => c.preco)))}
              </>
            ) : null}
            .
          </p>
        </div>
      </div>
    </div>
  );
}
