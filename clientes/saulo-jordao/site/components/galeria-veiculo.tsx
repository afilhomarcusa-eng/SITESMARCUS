"use client";

import { useEffect, useState } from "react";
import FotoCarro from "./foto";
import type { Foto } from "@/lib/tipos";

export default function GaleriaVeiculo({ fotos, nome }: { fotos: Foto[]; nome: string }) {
  const [aberta, setAberta] = useState<number | null>(null);
  useEffect(() => {
    if (aberta === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberta(null);
      if (e.key === "ArrowRight") setAberta((aberta + 1) % fotos.length);
      if (e.key === "ArrowLeft") setAberta((aberta - 1 + fotos.length) % fotos.length);
    };
    document.body.style.overflow = "hidden";
    addEventListener("keydown", tecla);
    return () => { document.body.style.overflow = ""; removeEventListener("keydown", tecla); };
  }, [aberta, fotos.length]);

  return (
    <>
      <div className="vehicle-gallery">
        {fotos.map((foto, i) => (
          <button type="button" className={`gallery-item gallery-item-${i % 5}`} key={foto.fontes[0].url} onClick={() => setAberta(i)} aria-label={`Ampliar foto ${i + 1} de ${fotos.length}`} data-entrada-foto>
            <FotoCarro foto={foto} alt={`${nome}, foto ${i + 1}`} sizes={i % 5 === 0 ? "(max-width:760px) 100vw, (max-width:1240px) 66vw, 800px" : "(max-width:760px) 100vw, 34vw"} prioridade={i === 0} />
            <span>{String(i + 1).padStart(2, "0")} / {String(fotos.length).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
      {aberta !== null ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`Galeria de ${nome}`} onClick={() => setAberta(null)}>
          <button type="button" className="lightbox-close" onClick={() => setAberta(null)} aria-label="Fechar">×</button>
          <button type="button" className="lightbox-prev" onClick={(e) => { e.stopPropagation(); setAberta((aberta - 1 + fotos.length) % fotos.length); }} aria-label="Foto anterior">←</button>
          <FotoCarro foto={fotos[aberta]} alt={`${nome}, foto ampliada ${aberta + 1}`} sizes="100vw" prioridade />
          <button type="button" className="lightbox-next" onClick={(e) => { e.stopPropagation(); setAberta((aberta + 1) % fotos.length); }} aria-label="Próxima foto">→</button>
          <span>{aberta + 1} / {fotos.length}</span>
        </div>
      ) : null}
    </>
  );
}
