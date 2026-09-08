"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CONTATO, whatsapp } from "@/lib/contato";
import { FORMULARIOS, montarMensagem, type Campo, type Formulario } from "@/lib/formularios";
import { opcoes } from "@/lib/filtros";
import { CARROS_INICIAIS } from "@/lib/carros";
import { useEstoque } from "@/lib/estoque";

/**
 * O formulário, um só para os três serviços.
 *
 * Quem descreve os campos é lib/formularios.ts. Aqui é só o desenho e o
 * comportamento, que são iguais nos três: nada obrigatório, a mensagem se monta
 * enquanto a pessoa digita, e o botão abre o WhatsApp com o texto pronto.
 *
 * As abas no topo são links de verdade, não estado. Assim a barra de endereço
 * sempre diz qual serviço está aberto, o botão de voltar funciona, o link é
 * compartilhável e cada serviço tem a própria página para o Google. Trocar de
 * aba limpa o que foi digitado, e por isso a escolha do serviço vem antes de
 * qualquer campo: a ordem natural é escolher e depois preencher.
 *
 * Sem JavaScript, os campos aparecem e o botão vira um link para a conversa em
 * branco, com o número escrito ao lado. Ninguém fica sem caminho.
 */

const CAIXA =
  "w-full bg-transparent px-4 py-3 text-[0.92rem] outline-none transition-colors duration-200";

function Rotulo({ campo, children }: { campo: Campo; children: React.ReactNode }) {
  return (
    <label className={campo.metade ? "block" : "block sm:col-span-2"}>
      <span className="etiqueta mb-2 block">{campo.rotulo}</span>
      {children}
      {campo.dica ? (
        <span className="mt-1.5 block text-[0.72rem]" style={{ color: "var(--tinta-3)" }}>
          {campo.dica}
        </span>
      ) : null}
    </label>
  );
}

export default function FormularioServico({
  form,
  carroInicial,
}: {
  form: Formulario;
  /** Quando a pessoa vem da ficha de um carro, ele já chega escrito. */
  carroInicial?: string;
}) {
  const estoque = useEstoque(CARROS_INICIAIS);
  const marcas = useMemo(() => opcoes(estoque).marcas, [estoque]);

  const [v, setV] = useState<Record<string, string>>(() => {
    const inicio: Record<string, string> = {};
    for (const c of form.campos) inicio[c.id] = "";
    if (carroInicial) {
      // Na compra o carro entra como o que a pessoa procura; nos outros dois é
      // o carro dela mesma.
      inicio[form.id === "comprar" ? "procura" : "carro"] = carroInicial;
    }
    return inicio;
  });

  const muda = (id: string) => (e: { target: { value: string } }) =>
    setV((x) => ({ ...x, [id]: e.target.value }));

  const mensagem = useMemo(() => montarMensagem(form, v), [form, v]);
  const preencheu = Object.values(v).some((x) => x.trim());

  return (
    <div className="casca">
      {/* ---------------------------------------------------------- as abas */}
      {/* inline-flex, e não flex: o fundo aqui é a cor da linha, que aparece
          entre as abas pelo gap de 1px. Esticado na largura toda ele virava um
          retângulo cinza sobrando à direita das três abas. */}
      <nav
        aria-label="Serviços"
        className="mb-10 inline-flex max-w-full flex-wrap gap-px"
        style={{ background: "var(--linha)" }}
      >
        {FORMULARIOS.map((f) => {
          const atual = f.id === form.id;
          return (
            <Link
              key={f.id}
              href={f.rota}
              data-aba={f.id}
              aria-current={atual ? "page" : undefined}
              className="px-5 py-3 text-[0.74rem] uppercase tracking-[0.13em] transition-colors duration-200"
              style={{
                background: atual ? "var(--tinta)" : "var(--branco)",
                color: atual ? "var(--branco)" : "var(--tinta-2)",
              }}
            >
              {f.aba}
            </Link>
          );
        })}
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        {/* ------------------------------------------------------ os campos */}
        <div>
          <p className="etiqueta mb-4">{form.titulo}</p>
          <h1 className="display mb-5 max-w-[18ch] text-[clamp(2rem,4.6vw,3.4rem)]">
            {form.chamada}
          </h1>
          <p className="corpo mb-4 max-w-[48ch]">{form.intro}</p>
          <p className="corpo mb-10 max-w-[48ch]" style={{ color: "var(--tinta-3)" }}>
            Nada aqui é obrigatório. Preencha só o que fizer sentido.
          </p>

          <form
            className="grid gap-6 sm:grid-cols-2"
            onSubmit={(e) => e.preventDefault()}
            aria-describedby="como-funciona"
          >
            {form.campos.map((c) => (
              <Rotulo key={c.id} campo={c}>
                {c.tipo === "area" ? (
                  <textarea
                    name={c.id}
                    rows={3}
                    value={v[c.id] ?? ""}
                    onChange={muda(c.id)}
                    className={CAIXA}
                    style={{ border: "1px solid var(--linha)", resize: "vertical" }}
                  />
                ) : c.tipo === "escolha" ? (
                  <select
                    name={c.id}
                    value={v[c.id] ?? ""}
                    onChange={muda(c.id)}
                    className={CAIXA}
                    style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
                  >
                    <option value="">{c.vazio}</option>
                    {(c.opcoesDoEstoque ? marcas : (c.opcoes ?? [])).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                    {c.opcoesDoEstoque ? <option value="Outra">Outra</option> : null}
                  </select>
                ) : (
                  <input
                    name={c.id}
                    type="text"
                    inputMode={c.tipo === "numero" ? "numeric" : undefined}
                    autoComplete={c.id === "nome" ? "name" : "off"}
                    value={v[c.id] ?? ""}
                    onChange={muda(c.id)}
                    className={CAIXA}
                    style={{ border: "1px solid var(--linha)" }}
                  />
                )}
              </Rotulo>
            ))}
          </form>
        </div>

        {/* --------------------------------------------------- a mensagem */}
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
              data-cta="formulario"
              data-envio={form.id}
              href={whatsapp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-6 px-6 py-5 text-[0.78rem] font-medium uppercase tracking-[0.14em]"
              style={{ background: "var(--tinta)", color: "var(--branco)" }}
            >
              {preencheu ? form.botao : "Abrir o WhatsApp"}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                style={{ transitionTimingFunction: "var(--e-saida)" }}
              >
                &rarr;
              </span>
            </a>

            <p id="como-funciona" className="mt-4 text-[0.8rem]" style={{ color: "var(--tinta-3)" }}>
              O botão abre a conversa com o texto acima já escrito. Você confere
              e envia. Nada sai daqui antes disso.
            </p>

            <noscript>
              <p className="mt-4 text-[0.85rem]" style={{ color: "var(--tinta-2)" }}>
                Os campos acima precisam de JavaScript para montar a mensagem.
                Chame direto no {CONTATO.exibicao} e diga o que precisa.
              </p>
            </noscript>
          </div>

          <p className="mt-6 text-[0.85rem]" style={{ color: "var(--tinta-2)" }}>
            {form.id === "comprar" ? (
              <>
                Prefere ver o que já está na loja?{" "}
                <Link href="/estoque" className="underline underline-offset-4 hover:text-[var(--tinta)]">
                  São {estoque.length} carros no estoque
                </Link>
                .
              </>
            ) : (
              <>
                A loja fica na Av. Octávio Mangabeira, na Boca do Rio.{" "}
                <Link href="/#local" className="underline underline-offset-4 hover:text-[var(--tinta)]">
                  Ver no mapa
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
