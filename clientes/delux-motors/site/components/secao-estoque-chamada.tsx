"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { Carro } from "@/lib/carros";
import { useEstoque } from "@/lib/estoque";
import { EMPRESA } from "@/lib/contato";
import { brl } from "@/lib/fmt";
import CartaoCarro from "./cartao-carro";

/**
 * O estoque na home.
 *
 * Vitrine, não catálogo: mostra o que tem e manda para a página que filtra.
 * Busca, filtro e ordenação moram em /estoque, que é a página feita para isso.
 *
 * Enquanto não houver carro cadastrado, esta faixa não finge vitrine: diz o
 * que é verdade e oferece o WhatsApp.
 */

export default function SecaoEstoqueChamada({ inicial }: { inicial: Carro[] }) {
  const estoque = useEstoque(inicial);
  const total = estoque.length;

  const { menor, maior } = useMemo(() => {
    if (!total) return { menor: 0, maior: 0 };
    const precos = estoque.map((c) => c.preco);
    return { menor: Math.min(...precos), maior: Math.max(...precos) };
  }, [estoque, total]);

  return (
    <section
      id="estoque"
      className="secao"
      style={{ background: "var(--nuvem)" }}
      aria-labelledby="titulo-estoque"
    >
      <div className="casca">
        <div
          className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b pb-7 md:mb-16"
          style={{ borderColor: "var(--linha)" }}
        >
          <div>
            <p className="etiqueta mb-4">Na loja agora</p>
            <h2
              id="titulo-estoque"
              className="display max-w-[16ch] text-[clamp(1.9rem,4.4vw,3.4rem)]"
              data-revela
            >
              {total
                ? `${total} ${total === 1 ? "carro" : "carros"} à venda`
                : "O estoque gira toda semana"}
            </h2>
            {total ? (
              <p className="corpo mt-4 max-w-[46ch]">
                De {brl(menor)} a {brl(maior)}, com a ficha completa de cada um.
              </p>
            ) : null}
          </div>

          {total ? (
            <Link
              data-cta="ver-estoque"
              href="/estoque"
              className="group inline-flex items-center gap-3 px-5 py-3.5 text-[0.74rem] uppercase tracking-[0.13em]"
              style={{ border: "1px solid var(--tinta)", color: "var(--tinta)" }}
            >
              Ver todos, com filtro
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                style={{ transitionTimingFunction: "var(--e-saida)" }}
              >
                &rarr;
              </span>
            </Link>
          ) : null}
        </div>

        {total ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {estoque.slice(0, 6).map((c) => (
              <div key={c.slug} data-revela>
                <CartaoCarro carro={c} />
              </div>
            ))}
          </div>
        ) : (
          <div data-revela>
            <p className="corpo mb-8 max-w-[46ch]">
              Carro bom não fica parado. O que entrou nesta semana sai primeiro
              no Instagram, em @{EMPRESA.instagram}, e quem pergunta no WhatsApp
              descobre antes de todo mundo.
            </p>
            <Link
              data-cta="estoque-whatsapp"
              href="/comprar"
              className="inline-flex items-center gap-3 px-6 py-4 text-[0.76rem] font-medium uppercase tracking-[0.13em]"
              style={{ background: "var(--tinta)", color: "var(--branco)" }}
            >
              Dizer o que procuro
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}

        {total ? (
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-16">
            <Link
              data-cta="estoque-whatsapp"
              href="/comprar"
              className="group inline-flex items-center gap-3 px-6 py-4 text-[0.76rem] font-medium uppercase tracking-[0.13em]"
              style={{ background: "var(--tinta)", color: "var(--branco)" }}
            >
              Não achou? Diga o que procura
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                style={{ transitionTimingFunction: "var(--e-saida)" }}
              >
                &rarr;
              </span>
            </Link>
            <p className="text-[0.84rem]" style={{ color: "var(--tinta-2)" }}>
              O estoque gira toda semana, e o que entra sai primeiro no
              Instagram.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
