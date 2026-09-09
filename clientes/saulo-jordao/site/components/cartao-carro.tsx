"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import FotoCarro from "./foto";
import { SetaDireita } from "./icones";
import { km as fmtKm, reais } from "@/lib/fmt";
import type { Carro } from "@/lib/tipos";

export default function CartaoCarro({ carro, prioridade = false, destaque = false }: { carro: Carro; prioridade?: boolean; destaque?: boolean }) {
  const [foto, setFoto] = useState(0);
  const toque = useRef(0);
  const ano = carro.anoTexto ?? String(carro.ano);
  const ficha = [ano, carro.km ? fmtKm(carro.km) : "", carro.potencia ? `${carro.potencia} cv` : ""].filter(Boolean).join(" · ");
  const total = carro.fotos.length;
  const mudar = (direcao: number) => setFoto((atual) => (atual + direcao + total) % total);

  return (
    <article className={`vehicle-card${destaque ? " vehicle-card-featured" : ""}`}>
      <div className="vehicle-media" onTouchStart={(e) => { toque.current = e.touches[0].clientX; }} onTouchEnd={(e) => { const delta = e.changedTouches[0].clientX - toque.current; if (Math.abs(delta) > 42) mudar(delta < 0 ? 1 : -1); }}>
        {carro.fotos[foto] ? <FotoCarro foto={carro.fotos[foto]} alt={`${carro.nome}, foto ${foto + 1}`} sizes={destaque ? "(max-width:760px) 100vw, (max-width:1520px) 55vw, 800px" : "(max-width:760px) 100vw, 34vw"} prioridade={prioridade} /> : null}
        {total > 1 ? (
          <>
            <button className="photo-zone photo-prev" type="button" onClick={() => mudar(-1)} aria-label="Foto anterior" />
            <button className="photo-zone photo-next" type="button" onClick={() => mudar(1)} aria-label="Próxima foto" />
            <span className="photo-count">{foto + 1} / {total}</span>
          </>
        ) : null}
        {carro.nota ? <p className="vehicle-note">{carro.nota}</p> : null}
      </div>
      <Link href={`/estoque/${carro.slug}`} className="vehicle-info" data-carro={carro.slug}>
        <span className="kicker">{carro.marca}</span>
        <h3>{carro.modelo}</h3>
        <span className="vehicle-meta">{ficha}</span>
        <strong>{reais(carro.preco)}</strong>
        <span className="vehicle-open">Ver ficha <SetaDireita /></span>
      </Link>
    </article>
  );
}
