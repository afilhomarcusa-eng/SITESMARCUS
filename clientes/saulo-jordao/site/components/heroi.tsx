import Link from "next/link";
import { CARROS, NUMEROS, carroPorSlug, DESTAQUE } from "@/lib/estoque";
import { EMPRESA } from "@/lib/contato";
import { km as fmtKm, reais } from "@/lib/fmt";
import { SetaDiagonal, SetaDireita } from "./icones";

/**
 * O herói.
 *
 * Três planos de verdade: o nome em corpo monumental no fundo, o retrato no
 * meio, e a etiqueta do carro passando na frente da foto. O nome pode ser
 * coberto porque é decoração e se repete no cabeçalho; nenhum texto que só
 * existe aqui fica atrás de coisa nenhuma.
 *
 * A foto está pintada em opacidade cheia desde o primeiro quadro. Quem esconde
 * o site no começo é a cortina, que cobre por cima, e é por isso que a abertura
 * pode durar quase três segundos sem entrar na conta do carregamento.
 */
export default function Heroi() {
  const carro = carroPorSlug(DESTAQUE) ?? CARROS[0];
  const ficha = [
    carro.anoTexto ?? String(carro.ano),
    carro.km ? fmtKm(carro.km) : "",
    carro.potencia ? `${carro.potencia} cv` : "",
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <section className="heroi" id="conteudo">
      <div className="heroi-grade">
        <div className="heroi-texto">
          <p className="fino">
            {EMPRESA.atividade} desde {EMPRESA.desde}
          </p>

          <h1>
            Compra, venda e importação de carros premium <em>em Aracaju</em>.
          </h1>

          <p className="heroi-linha">
            Cada carro do estoque tem ficha, quilometragem e preço na tela. O
            que não está aqui, Saulo procura no Brasil inteiro.
          </p>

          <div className="heroi-acoes">
            <Link className="acao" href="/estoque" data-acao="heroi-estoque">
              Ver os {NUMEROS.carros} carros
              <SetaDireita />
            </Link>
            <Link
              className="acao acao-vazada"
              href="/procuro"
              data-acao="heroi-procuro"
            >
              Procuro um carro
            </Link>
          </div>
        </div>

        <div className="heroi-retrato">
          {/* A moldura vazia da abertura, agora parada, atrás do retrato. */}
          <i className="heroi-mont" data-plano="fundo" aria-hidden="true" />

          <div className="heroi-moldura" data-plano="meio" data-entrada-foto>
            <img
              src="/images/heroi-760.webp"
              srcSet="/images/heroi-760.webp 760w, /images/heroi-1520.webp 1520w"
              sizes="(max-width: 900px) 92vw, 420px"
              width={760}
              height={1013}
              alt="Chevrolet Corvette Stingray vermelho, de frente, na calçada em Aracaju"
              fetchPriority="high"
              decoding="async"
              data-foto-heroi
            />
          </div>

          <Link
            href={`/estoque/${carro.slug}`}
            className="heroi-etiqueta"
            data-plano="frente"
          >
            <span className="fino">No estoque agora</span>
            <strong>{carro.modelo}</strong>
            <span
              className="serie"
              style={{ color: "var(--tinta-media)", fontSize: "0.88rem" }}
            >
              {ficha}
            </span>
            <span className="preco serie">{reais(carro.preco)}</span>
            <span
              className="link-corre fino fino-tinta"
              style={{ marginTop: 4 }}
            >
              Ver a ficha
              <SetaDiagonal />
            </span>
          </Link>
        </div>

        <div className="heroi-dados">
          <div>
            <strong className="serie">{NUMEROS.carros}</strong>
            <span className="fino">carros no estoque</span>
          </div>
          <div>
            <strong className="serie">{NUMEROS.marcas}</strong>
            <span className="fino">marcas</span>
          </div>
          <div>
            <strong className="serie">
              {reais(NUMEROS.menorPreco)} a {reais(NUMEROS.maiorPreco)}
            </strong>
            <span className="fino">faixa de preço de hoje</span>
          </div>
        </div>
      </div>
    </section>
  );
}
