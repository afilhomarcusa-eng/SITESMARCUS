"use client";

import Link from "next/link";
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
import { EMPRESA, SERVICOS, whatsapp } from "@/lib/contato";
import CartaoCarro from "./cartao-carro";

/**
 * O catálogo.
 *
 * Tem duas caras, e as duas são de verdade.
 *
 * Com carro cadastrado, é vitrine: busca, filtro por marca, câmbio,
 * combustível e faixa de preço, ordenação e contagem de resultado.
 *
 * Sem carro cadastrado, que é o estado de hoje, não finge vitrine. Mostra o
 * que é fato, que o estoque gira e ainda não está publicado, e continua
 * vendendo: os três serviços e o WhatsApp com a mensagem já escrita. Página de
 * estoque vazia com esqueleto de carro fingindo carregar é pior que honesta.
 *
 * A barra de endereço é a fonte da verdade do filtro, e não uma cópia dele.
 * useSyncExternalStore lê a fonte externa direto: sem efeito de sincronização,
 * sem renderização em cascata, e a hidratação funciona porque no servidor o
 * retorno é vazio e o HTML sai com o estoque inteiro.
 */

const FAIXAS = [
  { rotulo: "Até 50 mil", valor: 50000 },
  { rotulo: "Até 80 mil", valor: 80000 },
  { rotulo: "Até 120 mil", valor: 120000 },
  { rotulo: "Até 200 mil", valor: 200000 },
];

function assinarUrl(avisar: () => void) {
  window.addEventListener("popstate", avisar);
  window.addEventListener("dlx:filtro", avisar);
  return () => {
    window.removeEventListener("popstate", avisar);
    window.removeEventListener("dlx:filtro", avisar);
  };
}

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
      className="px-3.5 py-2 text-[0.72rem] uppercase tracking-[0.09em] transition-colors duration-200"
      style={{
        border: `1px solid ${ativo ? "var(--brasa)" : "var(--linha)"}`,
        background: ativo ? "var(--brasa)" : "transparent",
        color: ativo ? "var(--breu)" : "var(--tinta-2)",
        fontWeight: ativo ? 500 : 400,
      }}
    >
      {children}
    </button>
  );
}

/** O estado vazio. É a tela que mais vai aparecer até o estoque ser cadastrado. */
function Vazio({ filtrando, limpar }: { filtrando: boolean; limpar: () => void }) {
  return (
    <div className="py-6">
      <p className="etiqueta mb-5">
        {filtrando ? "Nada com esses filtros" : "Estoque ainda não publicado aqui"}
      </p>
      <h2 className="display mb-5 max-w-[18ch] text-[clamp(1.6rem,3.4vw,2.6rem)]">
        {filtrando
          ? "Nenhum carro bate com essa busca"
          : "O jeito mais rápido é perguntar"}
      </h2>
      <p className="corpo mb-9 max-w-[50ch]">
        {filtrando
          ? "Tire um filtro para ver mais, ou diga o que você procura e a equipe avisa quando entrar."
          : `O estoque da loja gira toda semana e o que entra aparece primeiro no Instagram, em @${EMPRESA.instagram}. Diga o que você procura no WhatsApp e a resposta vem com o que tem no pátio hoje.`}
      </p>

      <div className="mb-12 flex flex-wrap gap-4">
        {filtrando ? (
          <button
            type="button"
            onClick={limpar}
            className="px-5 py-3.5 text-[0.74rem] uppercase tracking-[0.13em]"
            style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
          >
            Limpar filtros
          </button>
        ) : null}
        <a
          data-cta="vazio"
          href={whatsapp(
            "Olá! Vim pelo site e queria saber quais carros vocês têm disponíveis agora.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 text-[0.74rem] font-medium uppercase tracking-[0.13em]"
          style={{ background: "var(--brasa)", color: "var(--breu)" }}
        >
          Dizer o que procuro
        </a>
      </div>

      {/* A página de estoque não pode ser um beco sem saída. Se não tem carro
          para mostrar, ela mostra as outras duas portas do negócio. */}
      <div
        className="grid gap-px border-t sm:grid-cols-3"
        style={{ background: "var(--linha)", borderColor: "var(--linha)" }}
      >
        {SERVICOS.map((s) => (
          <a
            key={s.id}
            data-cta={`vazio-${s.id}`}
            href={whatsapp(s.mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-0 py-7 sm:px-6"
            style={{ background: "var(--breu)" }}
          >
            <p className="etiqueta mb-2">{s.verbo}</p>
            <p className="display-leve mb-2 text-[1.05rem]">{s.titulo}</p>
            <p className="text-[0.86rem]" style={{ color: "var(--tinta-2)" }}>
              {s.resumo}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
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
    window.dispatchEvent(new Event("dlx:filtro"));
  }, []);

  const op = useMemo(() => opcoes(estoque), [estoque]);
  const resultado = useMemo(() => aplicar(estoque, filtro), [estoque, filtro]);
  const ativos = quantosAtivos(filtro);
  const semEstoque = estoque.length === 0;

  const alterna = (campo: "marcas" | "cambios" | "combustiveis", valor: string) =>
    trocar({
      ...filtro,
      [campo]: filtro[campo].includes(valor)
        ? filtro[campo].filter((x) => x !== valor)
        : [...filtro[campo], valor],
    });

  const limpar = () => trocar({ ...FILTRO_VAZIO, ordem: filtro.ordem });

  return (
    <div className="casca">
      {/* ------------------------------------------------------------- topo */}
      <div
        className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b pb-7"
        style={{ borderColor: "var(--linha)" }}
      >
        <div>
          {/* A etiqueta não repete a palavra do título nem a do menu. */}
          <p className="etiqueta mb-4">
            {EMPRESA.bairro} · {EMPRESA.cidade}
          </p>
          <h1 className="display text-[clamp(2rem,5vw,3.8rem)]">
            {semEstoque
              ? "Estoque da loja"
              : `${estoque.length} ${estoque.length === 1 ? "carro" : "carros"} à venda`}
          </h1>
          <p className="corpo mt-4 max-w-[50ch]">
            {semEstoque
              ? `Compra, venda e consignação na Boca do Rio, em ${EMPRESA.cidade}.`
              : `De ${brl(op.precoMin)} a ${brl(op.precoMax)}, na Boca do Rio, em ${EMPRESA.cidade}.`}
          </p>
        </div>

        {!semEstoque ? (
          <label className="w-full max-w-sm">
            <span className="so-leitor">Buscar por marca, modelo ou versão</span>
            <input
              type="search"
              value={filtro.busca}
              onChange={(e) => trocar({ ...filtro, busca: e.target.value })}
              placeholder="Buscar marca, modelo ou versão"
              className="dado w-full bg-transparent px-4 py-3 text-[0.86rem] outline-none"
              style={{ border: "1px solid var(--linha)" }}
            />
          </label>
        ) : null}
      </div>

      {semEstoque ? (
        <div className="pt-10">
          <Vazio filtrando={false} limpar={limpar} />
        </div>
      ) : (
        <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-14">
          {/* --------------------------------------------------------- filtros */}
          <div>
            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={abertoNoCelular}
              aria-controls="painel-filtros"
              className="mb-5 flex w-full items-center justify-between px-4 py-3 text-[0.74rem] uppercase tracking-[0.13em] lg:hidden"
              style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
            >
              Filtrar {ativos ? `(${ativos})` : ""}
              <span aria-hidden="true">{abertoNoCelular ? "−" : "+"}</span>
            </button>

            <div
              id="painel-filtros"
              className={`${abertoNoCelular ? "grid" : "hidden"} gap-8 lg:sticky lg:top-24 lg:grid`}
            >
              {[
                { t: "Marca", campo: "marcas" as const, itens: op.marcas },
                { t: "Câmbio", campo: "cambios" as const, itens: op.cambios },
                { t: "Combustível", campo: "combustiveis" as const, itens: op.combustiveis },
              ].map((g) => (
                <div key={g.campo}>
                  <p className="etiqueta mb-3">{g.t}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.itens.map((i) => (
                      <Pilula
                        key={i}
                        ativo={filtro[g.campo].includes(i)}
                        onClick={() => alterna(g.campo, i)}
                      >
                        {i}
                      </Pilula>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <p className="etiqueta mb-3">Preço</p>
                <div className="flex flex-wrap gap-2">
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
                </div>
              </div>

              {ativos > 0 ? (
                <button
                  type="button"
                  onClick={limpar}
                  className="justify-self-start text-[0.72rem] uppercase tracking-[0.11em] underline underline-offset-4"
                  style={{ color: "var(--tinta-3)" }}
                >
                  Limpar {ativos} {ativos === 1 ? "filtro" : "filtros"}
                </button>
              ) : null}
            </div>
          </div>

          {/* ------------------------------------------------------ resultado */}
          <div>
            <div
              className="mb-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b pb-5"
              style={{ borderColor: "var(--linha)" }}
            >
              {/* A contagem é o que prova que o filtro fez alguma coisa. */}
              <p aria-live="polite" className="dado text-[0.84rem]">
                <strong style={{ color: "var(--brasa)", fontWeight: 500 }}>
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
                    className="py-1 text-[0.72rem] uppercase tracking-[0.09em] transition-colors duration-200"
                    style={{
                      color: filtro.ordem === o.id ? "var(--brasa)" : "var(--tinta-3)",
                      borderBottom: `1px solid ${filtro.ordem === o.id ? "var(--brasa)" : "transparent"}`,
                    }}
                  >
                    {o.rotulo}
                  </button>
                ))}
              </div>
            </div>

            {resultado.length === 0 ? (
              <Vazio filtrando limpar={limpar} />
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                {resultado.map((c, i) => (
                  <CartaoCarro key={c.slug} carro={c} prioridade={i < 3} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <p className="mt-14 text-[0.8rem]" style={{ color: "var(--tinta-3)" }}>
        Também compramos e recebemos em consignação.{" "}
        <Link href="/#servicos" className="underline underline-offset-4 hover:text-[var(--brasa)]">
          Ver como funciona
        </Link>
        .
      </p>
    </div>
  );
}
