"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import CartaoCarro from "./cartao-carro";
import { Fechar, SetaDiagonal } from "./icones";
import { marcasDe } from "@/lib/estoque";
import type { Carro } from "@/lib/tipos";
import {
  ORDENS,
  aplicar,
  escreverSelecao,
  lerSelecao,
  quantosFiltros,
  tetosDePreco,
  type Ordem,
  type Selecao,
} from "@/lib/filtros";
import { reais } from "@/lib/fmt";

/**
 * O catálogo com filtros.
 *
 * O estado inteiro mora na barra de endereço, e quem lê a barra é este
 * componente, direto. Não existe cópia do estado aqui dentro: sem cópia não
 * existe efeito de sincronização, não existe divergência de hidratação, e
 * qualquer seleção vira um link que pode ser mandado por mensagem.
 *
 * O HTML sai do servidor com a lista já filtrada, então abrir um link filtrado
 * mostra a lista filtrada no primeiro quadro, sem piscar.
 */

const EVENTO = "sj:url";

function assinar(avisar: () => void) {
  addEventListener("popstate", avisar);
  addEventListener(EVENTO, avisar);
  return () => {
    removeEventListener("popstate", avisar);
    removeEventListener(EVENTO, avisar);
  };
}

export default function Catalogo({
  carros,
  consultaInicial,
}: {
  carros: Carro[];
  consultaInicial: string;
}) {
  const inicial = useRef(consultaInicial);
  const MARCAS = useMemo(() => marcasDe(carros), [carros]);

  const consulta = useSyncExternalStore(
    assinar,
    () => location.search.replace(/^\?/, ""),
    () => inicial.current,
  );

  const selecao = useMemo(() => lerSelecao(new URLSearchParams(consulta)), [consulta]);
  const lista = useMemo(() => aplicar(selecao, carros), [selecao, carros]);
  const tetos = useMemo(() => tetosDePreco(carros), [carros]);
  const ativos = quantosFiltros(selecao);

  function mudar(parcial: Partial<Selecao>) {
    const nova = { ...selecao, ...parcial };
    history.replaceState(null, "", `/estoque${escreverSelecao(nova)}`);
    dispatchEvent(new Event(EVENTO));
  }

  return (
    <>
      <div className="filters-shell">
        <div className="filtros-linha">
          <div className="busca">
            <label className="so-leitor" htmlFor="busca">
              Buscar no estoque
            </label>
            <input
              id="busca"
              type="search"
              placeholder="Buscar por marca, modelo ou ano"
              value={selecao.busca}
              onChange={(e) => mudar({ busca: e.target.value })}
              data-busca
            />
            {selecao.busca ? (
              <button type="button" onClick={() => mudar({ busca: "" })} aria-label="Limpar a busca">
                <Fechar />
              </button>
            ) : null}
          </div>

          {/* Uma marca só não vira filtro: botão que não separa nada é promessa
              que a grade não cumpre. */}
          {MARCAS.length > 1 ? (
            <div className="pilulas" role="group" aria-label="Filtrar por marca">
              {MARCAS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className="pilula"
                  aria-pressed={selecao.marca === m}
                  onClick={() => mudar({ marca: selecao.marca === m ? "" : m })}
                  data-marca={m}
                >
                  {m}
                </button>
              ))}
            </div>
          ) : null}

          {tetos.length > 1 ? (
            <div className="pilulas" role="group" aria-label="Filtrar por preço">
              {tetos.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="pilula"
                  aria-pressed={selecao.ate === t}
                  onClick={() => mudar({ ate: selecao.ate === t ? null : t })}
                  data-ate={t}
                >
                  até {reais(t)}
                </button>
              ))}
            </div>
          ) : null}

          <div className="ordenar">
            <label className="fino" htmlFor="ordem">
              Ordenar
            </label>
            <select
              id="ordem"
              value={selecao.ordem}
              onChange={(e) => mudar({ ordem: e.target.value as Ordem })}
              data-ordem
            >
              {ORDENS.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="faixa">
        <div className="contagem">
          <p className="fino fino-tinta" data-contagem>
            {lista.length === carros.length
              ? `${carros.length} carros no estoque`
              : `${lista.length} de ${carros.length} carros`}
          </p>
          {ativos > 0 ? (
            <button
              type="button"
              className="limpar"
              onClick={() =>
                mudar({ busca: "", marca: "", ate: null })
              }
              data-limpar
            >
              Limpar {ativos === 1 ? "o filtro" : `os ${ativos} filtros`}
            </button>
          ) : null}
        </div>

        {lista.length ? (
          <div className="editorial-grid catalog-grid medida" data-grade>
            {lista.map((carro, i) => (
              <CartaoCarro
                key={carro.slug}
                carro={carro}
                prioridade={i < 4}
                destaque={i % 5 === 0}
              />
            ))}
          </div>
        ) : (
          <div className="vazio medida">
            <h2>{carros.length ? "Nenhum carro com esse filtro." : "O próximo carro pode ser o que você procura."}</h2>
            {/* Nada de "o estoque muda toda semana": nenhuma fonte diz isso.
                O que dá para afirmar é o que ele mesmo escreve, que procura o
                carro em qualquer lugar do Brasil. */}
            <p>
              O que não está aqui, Saulo procura no Brasil inteiro.
            </p>
            <div className="heroi-acoes" style={{ marginTop: 0 }}>
              {carros.length > 0 && <button type="button" className="acao" onClick={() => mudar({ busca: "", marca: "", ate: null })}>
                Ver os {carros.length} carros
              </button>}
              <Link className="acao acao-vazada" href="/procuro">
                Procuro um carro
                <SetaDiagonal />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
