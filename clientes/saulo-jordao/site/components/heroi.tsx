import Link from "next/link";
import FotoCarro from "./foto";
import { SetaDireita } from "./icones";
import { km, reais } from "@/lib/fmt";
import type { Carro, Numeros } from "@/lib/tipos";

export default function Heroi({ carro, numeros }: { carro?: Carro; numeros: Numeros }) {
  const ano = carro?.anoTexto ?? (carro ? String(carro.ano) : "");

  return (
    <section className="hero" id="conteudo" data-hero>
      <div className="hero-copy">
        <p className="kicker hero-kicker" data-hero-item>
          Corretor de veículos premium<br />Aracaju, SE · Brasil inteiro
        </p>
        <h1 className="hero-title" aria-label="Carros escolhidos um a um.">
          <span className="hero-line"><span>Carros escolhidos</span></span>
          <span className="hero-line hero-line-em"><span>um a um.</span></span>
        </h1>
        <div className="hero-bottom" data-hero-item>
          <p>Estoque selecionado em Aracaju. Se o carro não estiver aqui, Saulo procura no Brasil inteiro.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/estoque" data-acao="heroi-estoque">
              Ver os {numeros.carros} carros <SetaDireita />
            </Link>
            <Link className="text-link" href="/procuro" data-acao="heroi-procuro">Procuro um carro <SetaDireita /></Link>
          </div>
        </div>
      </div>

      {carro?.fotos[0] ? (
        <div className="hero-visual" data-hero-visual>
          <i className="hero-frame" data-depth="back" aria-hidden="true" />
          <div className="hero-photo" data-depth="photo">
            <FotoCarro
              foto={carro.fotos[0]}
              alt={`${carro.nome}${carro.cor ? `, cor ${carro.cor}` : ""}`}
              sizes="(max-width: 760px) 100vw, 58vw"
              prioridade
            />
          </div>
          <Link className="hero-spec" href={`/estoque/${carro.slug}`} data-depth="meta">
            <span className="kicker">No estoque agora</span>
            <strong>{carro.nome}</strong>
            <span className="hero-spec-row">
              <span>{ano}</span>
              {carro.km ? <span>{km(carro.km)}</span> : null}
              {carro.potencia ? <span>{carro.potencia} cv</span> : null}
            </span>
            <span className="hero-price">{reais(carro.preco)}</span>
            <span className="hero-spec-link">Ver a ficha <SetaDireita /></span>
          </Link>
          <p className="hero-index kicker">01 / Destaque</p>
        </div>
      ) : null}

      <div className="hero-tech" aria-hidden="true">
        <span>Seleção</span><i /><span>Procedência</span><i /><span>Curadoria</span>
      </div>
    </section>
  );
}
