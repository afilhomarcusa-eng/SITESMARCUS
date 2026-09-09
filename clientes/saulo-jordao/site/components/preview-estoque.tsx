"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CartaoCarro from "./cartao-carro";
import { SetaDireita } from "./icones";
import { marcasDe } from "@/lib/estoque";
import type { Carro } from "@/lib/tipos";

export default function PreviewEstoque({ carros, total }: { carros: Carro[]; total: number }) {
  const [marca, setMarca] = useState("Todos");
  const marcas = useMemo(() => marcasDe(carros), [carros]);
  const lista = marca === "Todos" ? carros : carros.filter((carro) => carro.marca === marca);

  return (
    <>
      <div className="quick-filters" role="group" aria-label="Filtrar seleção por marca">
        {["Todos", ...marcas].map((item) => (
          <button key={item} type="button" aria-pressed={marca === item} onClick={() => setMarca(item)}>{item}</button>
        ))}
      </div>
      <div className="editorial-grid" data-grade>
        {lista.map((carro, i) => <CartaoCarro key={carro.slug} carro={carro} prioridade={i < 2} destaque={i === 0} />)}
      </div>
      <Link className="collection-link text-link" href="/estoque">Ver todos os {total} carros <SetaDireita /></Link>
    </>
  );
}
