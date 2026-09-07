"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { Carro } from "@/lib/carros";
import { useEstoque } from "@/lib/estoque";
import {
  FILTRO_VAZIO,
  ORDENS,
  aplicar,
  daQuery,
  opcoes,
  paraQuery,
  quantosAtivos,
  type Filtro,
} from "@/lib/filtros";
import { brl } from "@/lib/fmt";
import { whatsapp } from "@/lib/contato";
import CartaoCarro from "./cartao-carro";

/**
 * O catálogo.
 *
 * É a página que vende. Tudo aqui responde a uma pergunta de quem está
 * comprando: quanto custa, quantos existem, o que sobra quando eu filtro.
 *
 * O estado vive na barra de endereço, então uma seleção é um link que pode ser
 * mandado no WhatsApp. Como isso funciona está explicado logo acima de
 * assinarUrl.
 */

const FAIXAS = [
  { rotulo: "Até 100 mil", valor: 100000 },
  { rotulo: "Até 150 mil", valor: 150000 },
  { rotulo: "Até 200 mil", valor: 200000 },
  { rotulo: "Até 300 mil", valor: 300000 },
];

function Pilula({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className="dado px-3.5 py-2 text-[0.7rem] uppercase tracking-[0.1em] transition-colors duration-200"
      style={{
        border: `1px solid ${ativo ? "var(--latao)" : "var(--linha)"}`,
        background: ativo ? "var(--latao)" : "transparent",
        color: ativo ? "var(--preto)" : "var(--tinta-2)",
        fontWeight: ativo ? 500 : 400,
      }}
    >
      {children}
    </button>
  );
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="etiqueta mb-3">{titulo}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/**
 * A barra de endereço é a fonte da verdade do filtro, e não uma cópia dele.
 *
 * A primeira versão guardava o filtro em estado e sincronizava com a URL em
 * dois efeitos: um lia na montagem, outro escrevia a cada mudança. Isso gera
 * renderização em cascata e duas versões da mesma verdade que podem discordar.
 *
 * useSyncExternalStore existe exatamente para ler uma fonte externa mutável.
 * Ele também resolve a hidratação: no servidor o retorno é vazio, então o HTML
 * sai com o estoque inteiro, e o filtro do link entra depois sem divergência.
 */
function assinarUrl(avisar: () => void) {
  window.addEventListener("popstate", avisar);
  window.addEventListener("udl:filtro", avisar);
  return () => {
    window.removeEventListener("popstate", avisar);
    window.removeEventListener("udl:filtro", avisar);
  };
}

export default function Catalogo({ inicial }: { inicial: Carro[] }) {
  const estoque = useEstoque(inicial);
  const [abertoNoCelular, setAberto] = useState(false);

  const query = useSyncExternalStore(
    assinarUrl,
    () => window.location.search,
    () => "",
  );
  const filtro = useMemo(() => daQuery(query), [query]);

  const trocar = useCallback((proximo: Filtro) => {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${paraQuery(proximo)}`,
    );
    window.dispatchEvent(new Event("udl:filtro"));
  }, []);

  const op = useMemo(() => opcoes(estoque), [estoque]);
  const resultado = useMemo(() => aplicar(estoque, filtro), [estoque, filtro]);
  const ativos = quantosAtivos(filtro);

  const alterna = (campo: "marcas" | "cambios" | "combustiveis", valor: string) =>
    trocar({
      ...filtro,
      [campo]: filtro[campo].includes(valor)
        ? filtro[campo].filter((x) => x !== valor)
        : [...filtro[campo], valor],
    });

  return (
    <>
      {/* ------------------------------------------------------------ topo */}
      <div className="casca">
        <div
          className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b pb-7"
          style={{ borderColor: "var(--linha)" }}
        >
          <div>
            <p className="etiqueta mb-4">Estoque</p>
            <h1 className="display text-[clamp(2rem,5vw,4rem)]">
              {estoque.length} carros à venda
            </h1>
            <p className="corpo mt-4 max-w-[52ch]">
              De {brl(op.precoMin)} a {brl(op.precoMax)}. Todos fotografados no
              nosso estúdio em Goiânia, com entrega para todo o Brasil.
            </p>
          </div>

          <label className="w-full max-w-sm">
            <span className="so-leitor">Buscar por marca, modelo ou versão</span>
            <input
              type="search"
              value={filtro.busca}
              onChange={(e) => trocar({ ...filtro, busca: e.target.value })}
              placeholder="Buscar marca, modelo ou versão"
              className="dado w-full bg-transparent px-4 py-3 text-[0.85rem] outline-none"
              style={{ border: "1px solid var(--linha)" }}
            />
          </label>
        </div>
      </div>

      {/* --------------------------------------------------------- filtros */}
      <div className="casca">
        <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-14">
          <div>
            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={abertoNoCelular}
              aria-controls="painel-filtros"
              className="dado mb-5 flex w-full items-center justify-between px-4 py-3 text-[0.72rem] uppercase tracking-[0.14em] lg:hidden"
              style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
            >
              Filtrar {ativos ? `(${ativos})` : ""}
              <span aria-hidden="true">{abertoNoCelular ? "−" : "+"}</span>
            </button>

            <div
              id="painel-filtros"
              className={`${abertoNoCelular ? "grid" : "hidden"} gap-8 lg:grid lg:sticky lg:top-28`}
            >
              <Grupo titulo="Marca">
                {op.marcas.map((m) => (
                  <Pilula
                    key={m}
                    ativo={filtro.marcas.includes(m)}
                    onClick={() => alterna("marcas", m)}
                  >
                    {m}
                  </Pilula>
                ))}
              </Grupo>

              <Grupo titulo="Câmbio">
                {op.cambios.map((c) => (
                  <Pilula
                    key={c}
                    ativo={filtro.cambios.includes(c)}
                    onClick={() => alterna("cambios", c)}
                  >
                    {c}
                  </Pilula>
                ))}
              </Grupo>

              <Grupo titulo="Combustível">
                {op.combustiveis.map((c) => (
                  <Pilula
                    key={c}
                    ativo={filtro.combustiveis.includes(c)}
                    onClick={() => alterna("combustiveis", c)}
                  >
                    {c}
                  </Pilula>
                ))}
              </Grupo>

              <Grupo titulo="Preço">
                {FAIXAS.filter((f) => f.valor < op.precoMax).map((f) => (
                  <Pilula
                    key={f.valor}
                    ativo={filtro.precoMax === f.valor}
                    onClick={() =>
                      trocar({
                        ...filtro,
                        precoMax: filtro.precoMax === f.valor ? null : f.valor,
                      })
                    }
                  >
                    {f.rotulo}
                  </Pilula>
                ))}
              </Grupo>

              {ativos > 0 ? (
                <button
                  type="button"
                  onClick={() => trocar({ ...FILTRO_VAZIO, ordem: filtro.ordem })}
                  className="dado justify-self-start text-[0.7rem] uppercase tracking-[0.12em] underline underline-offset-4"
                  style={{ color: "var(--tinta-3)" }}
                >
                  Limpar {ativos} {ativos === 1 ? "filtro" : "filtros"}
                </button>
              ) : null}
            </div>
          </div>

          {/* ---------------------------------------------------- resultado */}
          <div>
            <div
              className="mb-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b pb-5"
              style={{ borderColor: "var(--linha)" }}
            >
              {/* A contagem é o que diz que o filtro funcionou. Sem ela, mexer
                  num filtro que não muda muito parece que não fez nada. */}
              <p aria-live="polite" className="dado text-[0.82rem]">
                <strong style={{ color: "var(--latao)", fontWeight: 500 }}>
                  {resultado.length}
                </strong>{" "}
                {resultado.length === 1 ? "carro" : "carros"}
                {ativos > 0 ? ` de ${estoque.length}` : ""}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="etiqueta">Ordenar</span>
                {ORDENS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => trocar({ ...filtro, ordem: o.id })}
                    aria-pressed={filtro.ordem === o.id}
                    className="dado py-1 text-[0.7rem] uppercase tracking-[0.1em] transition-colors duration-200"
                    style={{
                      color: filtro.ordem === o.id ? "var(--latao)" : "var(--tinta-3)",
                      borderBottom: `1px solid ${filtro.ordem === o.id ? "var(--latao)" : "transparent"}`,
                    }}
                  >
                    {o.rotulo}
                  </button>
                ))}
              </div>
            </div>

            {resultado.length === 0 ? (
              <div
                className="px-6 py-16 text-center"
                style={{ border: "1px solid var(--linha)" }}
              >
                <p className="display-solto mb-3 text-[1.3rem]">
                  Nenhum carro com esses filtros
                </p>
                <p className="corpo mx-auto mb-7 max-w-[42ch] text-[0.92rem]">
                  O estoque gira toda semana. Diga o que você procura e a equipe
                  avisa quando entrar, ou tire um filtro para ver mais.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => trocar({ ...FILTRO_VAZIO, ordem: filtro.ordem })}
                    className="dado px-5 py-3 text-[0.72rem] uppercase tracking-[0.14em]"
                    style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
                  >
                    Limpar filtros
                  </button>
                  <a
                    data-cta="vazio"
                    href={whatsapp(
                      "Olá! Não achei no site o que eu procuro. Vocês conseguem me avisar quando entrar?",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dado px-5 py-3 text-[0.72rem] uppercase tracking-[0.14em]"
                    style={{ background: "var(--latao)", color: "var(--preto)", fontWeight: 500 }}
                  >
                    Pedir no WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {resultado.map((c, i) => (
                  <CartaoCarro key={c.slug} carro={c} prioridade={i < 3} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
