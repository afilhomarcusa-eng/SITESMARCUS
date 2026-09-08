import Link from "next/link";
import type { Carro } from "@/lib/estoque";
import { CARROS } from "@/lib/estoque";
import { km as fmtKm, reais } from "@/lib/fmt";
import { SetaDireita } from "./icones";

/**
 * O cartão do carro.
 *
 * O número da série sai da posição do carro no estoque, não da posição dele na
 * lista filtrada: filtrar não pode renumerar o acervo. E a grade é alinhada, com
 * altura igual em todos os cartões, porque cartão deslocado por índice faz a
 * grade pular de altura quando a ordenação muda, e isso é lido como filtro
 * quebrado mesmo quando o filtro está certo.
 */
export default function CartaoCarro({
  carro,
  prioridade = false,
}: {
  carro: Carro;
  prioridade?: boolean;
}) {
  const serie = CARROS.findIndex((c) => c.slug === carro.slug) + 1;
  const ano = carro.anoTexto ?? String(carro.ano);
  const ficha = [ano, carro.km ? fmtKm(carro.km) : "", carro.potencia ? `${carro.potencia} cv` : ""]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <Link href={`/estoque/${carro.slug}`} className="cartao" data-carro={carro.slug}>
      <div className="cartao-moldura">
        <span className="cartao-serie serie">
          {String(serie).padStart(2, "0")}/{CARROS.length}
        </span>
        <img
          src={`/images/${carro.slug}-capa-420.webp`}
          srcSet={`/images/${carro.slug}-capa-420.webp 420w, /images/${carro.slug}-capa-840.webp 840w`}
          sizes="(max-width: 620px) 46vw, (max-width: 1100px) 32vw, 24vw"
          width={420}
          height={560}
          alt={`${carro.nome}${carro.cor ? `, cor ${carro.cor}` : ""}`}
          loading={prioridade ? "eager" : "lazy"}
          fetchPriority={prioridade ? "high" : "auto"}
          decoding="async"
        />
        {carro.nota ? <p className="cartao-nota">{carro.nota}</p> : null}
      </div>

      <div className="cartao-topo">
        <h3>{carro.modelo}</h3>
        <span className="cartao-marca">{carro.marca}</span>
      </div>

      <p className="cartao-ficha serie">{ficha}</p>

      <p className="cartao-preco serie">
        {reais(carro.preco)}
        <SetaDireita />
      </p>
    </Link>
  );
}
