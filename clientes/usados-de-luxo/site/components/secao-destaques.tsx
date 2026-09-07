"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Carro } from "@/lib/carros";
import { useEstoque } from "@/lib/estoque";
import { anoNumero } from "@/lib/filtros";
import CartaoCarro from "./cartao-carro";

/**
 * O estoque na home.
 *
 * Vem logo depois do herói de propósito. Quem chega no site de uma revenda
 * quer ver carro, e a história da loja só interessa depois que algum carro
 * chamou atenção. A versão anterior colocava o manifesto do estúdio aqui e
 * empurrava o estoque para a terceira tela.
 *
 * Aqui é vitrine, não catálogo: seis carros e a porta para os outros. Filtro,
 * busca e ordenação moram em /estoque, que é a página feita para isso.
 */

export default function SecaoDestaques({
  inicial,
  total,
}: {
  inicial: Carro[];
  total: number;
}) {
  const estoque = useEstoque(inicial);

  const seis = useMemo(
    () =>
      [...estoque]
        .sort((a, b) => anoNumero(b.ano) - anoNumero(a.ano))
        .slice(0, 6),
    [estoque],
  );

  return (
    <section id="estoque" className="secao" style={{ background: "var(--fumaca)" }}>
      <div className="casca">
        <div
          className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b pb-7 md:mb-16"
          style={{ borderColor: "var(--linha)" }}
        >
          <div>
            <p className="etiqueta mb-4">No estoque</p>
            <h2 className="display max-w-[18ch] text-[clamp(2rem,4.6vw,3.6rem)]">
              Os que entraram por último
            </h2>
          </div>

          <Link
            data-cta="ver-estoque"
            href="/estoque"
            className="dado group inline-flex items-center gap-3 px-5 py-3.5 text-[0.72rem] uppercase tracking-[0.14em]"
            style={{ border: "1px solid var(--latao)", color: "var(--latao)" }}
          >
            Ver os {total} carros
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              style={{ transitionTimingFunction: "var(--e-saida)" }}
            >
              &rarr;
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {seis.map((c) => (
            <div key={c.slug} data-revela="sobe">
              <CartaoCarro carro={c} />
            </div>
          ))}
        </div>

        <Link
          href="/estoque"
          className="dado mt-12 flex items-center justify-center gap-3 py-5 text-[0.74rem] uppercase tracking-[0.16em] transition-colors duration-300 hover:text-[var(--latao)] md:mt-16"
          style={{ border: "1px solid var(--linha)", color: "var(--tinta-2)" }}
        >
          Ver o estoque completo, com filtro por marca e preço
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
