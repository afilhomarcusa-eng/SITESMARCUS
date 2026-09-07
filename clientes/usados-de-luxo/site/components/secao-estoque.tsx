"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Carro } from "@/lib/carros";
import { useEstoque, useFoto, type CarroSalvo } from "@/lib/estoque";
import { brl, km, nome } from "@/lib/fmt";

/**
 * O estoque.
 *
 * Grade escalonada de propósito: coluna do meio desce, as laterais sobem. Uma
 * grade perfeitamente alinhada é o que faz site de revenda parecer planilha.
 */

function Cartao({ carro, i }: { carro: CarroSalvo; i: number }) {
  const src = useFoto(carro, "1000");
  const desloca = i % 3 === 1 ? "md:mt-20" : i % 3 === 2 ? "md:mt-10" : "";

  return (
    <Link
      href={`/estoque/${carro.slug}`}
      data-carro
      className={`group block ${desloca}`}
      data-revela="sobe"
    >
      <div
        className="relative mb-5 overflow-hidden"
        style={{ background: "var(--fumaca)", aspectRatio: "4 / 5" }}
      >
        {src ? (
          <img
            src={src}
            alt={`${nome(carro)} ${carro.ano} fotografado no estúdio da Usados de Luxo`}
            width={1000}
            height={1250}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.045]"
            style={{ transitionTimingFunction: "var(--e-saida)" }}
          />
        ) : (
          <span className="etiqueta absolute inset-0 flex items-center justify-center px-6 text-center">
            Foto do estúdio ainda não publicada
          </span>
        )}
        <span
          aria-hidden="true"
          className="dado absolute left-0 top-0 px-3 py-2 text-[0.62rem] uppercase tracking-[0.16em]"
          style={{ background: "var(--preto)", color: "var(--latao)" }}
        >
          {carro.ano}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="display-solto mb-1.5 text-[clamp(1.05rem,1.5vw,1.3rem)]">
            {carro.marca} {carro.modelo}
          </h3>
          <p className="dado text-[0.72rem]" style={{ color: "var(--tinta-3)" }}>
            {carro.versao} · {carro.motor} · {carro.potencia} cv
          </p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: "var(--latao)", transitionTimingFunction: "var(--e-saida)" }}
        >
          &rarr;
        </span>
      </div>

      <div
        className="mt-4 flex items-baseline justify-between gap-4 border-t pt-3"
        style={{ borderColor: "var(--linha)" }}
      >
        <span className="dado text-[clamp(0.95rem,1.3vw,1.1rem)]">
          {brl(carro.preco)}
        </span>
        <span className="dado text-[0.72rem]" style={{ color: "var(--tinta-3)" }}>
          {km(carro.km)}
        </span>
      </div>
    </Link>
  );
}

const ORDENS = [
  { id: "recentes", rotulo: "Como chegaram" },
  { id: "maior", rotulo: "Maior preço" },
  { id: "menor", rotulo: "Menor preço" },
  { id: "km", rotulo: "Menor km" },
] as const;

export default function SecaoEstoque({ inicial }: { inicial: Carro[] }) {
  const lista = useEstoque(inicial);
  const [ordem, setOrdem] = useState<(typeof ORDENS)[number]["id"]>("recentes");

  const ordenada = useMemo(() => {
    const c = [...lista];
    if (ordem === "maior") c.sort((a, b) => b.preco - a.preco);
    if (ordem === "menor") c.sort((a, b) => a.preco - b.preco);
    if (ordem === "km") c.sort((a, b) => a.km - b.km);
    return c;
  }, [lista, ordem]);

  return (
    <section id="estoque" className="secao">
      <div className="casca">
        <div className="risco mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pt-7 md:mb-16">
          <div>
            <p className="etiqueta mb-4">Estoque</p>
            {/* O carro do herói já foi mostrado acima, então este número é o
                resto. Dizer "12" aqui e listar 11 seria contar errado. */}
            <h2 className="display max-w-[16ch] text-[clamp(2rem,5vw,4rem)]">
              Mais {lista.length} na mesma sala
            </h2>
          </div>

          <div
            role="group"
            aria-label="Ordenar o estoque"
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {ORDENS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOrdem(o.id)}
                aria-pressed={ordem === o.id}
                className="dado py-1 text-[0.68rem] uppercase tracking-[0.14em] transition-colors duration-200"
                style={{
                  color: ordem === o.id ? "var(--latao)" : "var(--tinta-3)",
                  borderBottom: `1px solid ${ordem === o.id ? "var(--latao)" : "transparent"}`,
                }}
              >
                {o.rotulo}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {ordenada.map((c, i) => (
            <Cartao key={c.slug} carro={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
