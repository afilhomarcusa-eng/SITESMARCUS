"use client";

import Link from "next/link";
import { useFoto, type CarroSalvo } from "@/lib/estoque";
import { brl, km, nome } from "@/lib/fmt";

/**
 * O cartão do carro. Um só, usado na home e no catálogo.
 *
 * Não tem deslocamento vertical por índice. A versão anterior escalonava as
 * colunas para a grade não parecer planilha, e o efeito colateral era pior que
 * o problema: ao reordenar, os cartões pulavam de altura e a página parecia
 * quebrada. Numa página cujo trabalho é comparar preço, alinhar é a decisão
 * certa, e o ritmo vem da fotografia, não do desalinhamento.
 */

export default function CartaoCarro({
  carro,
  prioridade = false,
}: {
  carro: CarroSalvo;
  prioridade?: boolean;
}) {
  const src = useFoto(carro, "cartao");

  return (
    <Link
      href={`/estoque/${carro.slug}`}
      data-carro
      data-preco={carro.preco}
      className="group flex flex-col"
    >
      <div
        className="relative mb-4 overflow-hidden"
        style={{ background: "var(--nuvem)", aspectRatio: "4 / 5" }}
      >
        {src ? (
          <img
            src={src}
            alt={`${nome(carro)} ${carro.ano} fotografado no estúdio da Usados de Luxo`}
            width={1000}
            height={1250}
            loading={prioridade ? "eager" : "lazy"}
            fetchPriority={prioridade ? "high" : undefined}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
            style={{ transitionTimingFunction: "var(--e-saida)" }}
          />
        ) : (
          <span className="etiqueta absolute inset-0 flex items-center justify-center px-6 text-center">
            Foto do estúdio ainda não publicada
          </span>
        )}
        <span
          className="dado absolute left-0 top-0 px-3 py-2 text-[0.62rem] uppercase tracking-[0.14em]"
          style={{ background: "var(--branco)", color: "var(--tinta)" }}
        >
          {carro.ano}
        </span>
        {/* Alerta fica no cartão, não só na ficha. Passagem por leilão muda o
            valor do carro e quem descobre isso depois se sente enganado. */}
        {carro.alertas?.length ? (
          <span
            className="dado absolute bottom-0 left-0 right-0 px-3 py-2 text-[0.62rem] uppercase tracking-[0.12em]"
            style={{ background: "var(--tinta)", color: "var(--branco)" }}
          >
            {carro.alertas[0]}
          </span>
        ) : null}
      </div>

      <h3 className="display-leve mb-1.5 text-[clamp(1rem,1.4vw,1.22rem)]">
        {carro.marca} {carro.modelo}
      </h3>
      <p className="dado mb-4 text-[0.72rem]" style={{ color: "var(--tinta-3)" }}>
        {[carro.versao, carro.motor, `${carro.potencia} cv`].filter(Boolean).join(" · ")}
      </p>

      {/* O preço fica colado embaixo mesmo quando o nome do carro ocupa duas
          linhas. Numa grade de comparação, preço desalinhado atrapalha. */}
      <div
        className="mt-auto flex items-baseline justify-between gap-4 border-t pt-3"
        style={{ borderColor: "var(--linha)" }}
      >
        <span className="dado text-[clamp(0.95rem,1.3vw,1.1rem)]">{brl(carro.preco)}</span>
        <span className="dado text-[0.72rem]" style={{ color: "var(--tinta-3)" }}>
          {km(carro.km)}
        </span>
      </div>
    </Link>
  );
}
