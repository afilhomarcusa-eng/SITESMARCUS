import Link from "next/link";
import Cortina from "@/components/cortina";
import Heroi from "@/components/heroi";
import CartaoCarro from "@/components/cartao-carro";
import { SetaDiagonal, SetaDireita } from "@/components/icones";
import { CARROS_DA_HOME, MARCAS, NUMEROS } from "@/lib/estoque";
import { EMPRESA } from "@/lib/contato";
import { milhoes, reais } from "@/lib/fmt";

const PORTAS = [
  {
    href: "/estoque",
    titulo: "Comprar do estoque",
    texto:
      "Cada carro tem página própria, com as fotos do anúncio, a ficha inteira e o que já está pago: IPVA, garantia, revisões e proteção de pintura.",
  },
  {
    href: "/procuro",
    titulo: "Procurar um carro",
    texto:
      "Diga marca, modelo, ano e faixa de preço. Saulo procura e avalia o carro em qualquer lugar do Brasil, e volta com as opções.",
  },
  {
    href: "/vender",
    titulo: "Vender o seu",
    texto:
      "Quem quer se desfazer de um carro premium com segurança manda a ficha por aqui. Saulo avalia e conduz a venda.",
  },
];

export default function Home() {
  return (
    <>
      <Cortina />
      <main>
        <Heroi />

        {/* --- o estoque, logo depois do herói: quem entra quer ver carro --- */}
        <section className="secao" aria-labelledby="t-estoque">
          <div className="medida">
            <div className="cabeca">
              <div>
                <p className="fino" data-revelar>
                  O estoque de hoje
                </p>
                <h2 id="t-estoque" data-revelar style={{ marginTop: 12 }}>
                  Seis dos {NUMEROS.carros} carros
                </h2>
              </div>
              <p className="cabeca-nota" data-revelar>
                Do mais caro ao mais acessível, para você ver a faixa inteira.{" "}
                <Link href="/estoque" className="link-corre">
                  Ver os {NUMEROS.carros} com filtros
                  <SetaDiagonal />
                </Link>
              </p>
            </div>

            <div className="grade">
              {CARROS_DA_HOME.map((carro, i) => (
                <div
                  key={carro.slug}
                  data-revelar
                  style={{ "--atraso": `${i * 70}ms` } as React.CSSProperties}
                >
                  <CartaoCarro carro={carro} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- quem é Saulo: texto curto e números que se calculam sozinhos --- */}
        <section className="secao secao-fundo" aria-labelledby="t-quem">
          <div className="medida quem">
            <div className="quem-texto">
              <p className="fino" style={{ marginBottom: 20 }}>
                Quem é Saulo
              </p>
              <h2 id="t-quem" className="so-leitor">
                Quem é Saulo Jordão
              </h2>
              <p data-revelar>
                Saulo Jordão é aracajuano e trabalha como corretor de veículos
                premium desde {EMPRESA.desde}.
              </p>
              <p data-revelar style={{ "--atraso": "80ms" } as React.CSSProperties}>
                O trabalho tem dois lados. Um é cuidar da venda de quem quer se
                desfazer de um carro premium com segurança e rapidez. O outro é
                procurar e avaliar o modelo que o cliente quer, em qualquer lugar
                do Brasil, incluindo importação.
              </p>
              <p data-revelar style={{ "--atraso": "160ms" } as React.CSSProperties}>
                As fotos deste site são as dos anúncios dele, quase todas feitas
                no mesmo trecho de calçada de Aracaju, sempre com o carro em pé,
                na luz do dia. É por isso que o site inteiro é feito de retratos
                verticais: o layout foi desenhado em cima do que existe.
              </p>
            </div>

            <div className="numeros" data-revelar>
              <div>
                <strong className="serie">{NUMEROS.carros}</strong>
                <span>carros no estoque hoje</span>
              </div>
              <div>
                <strong className="serie">{NUMEROS.marcas}</strong>
                <span>
                  marcas, de {MARCAS[0]} a {MARCAS[MARCAS.length - 1]}
                </span>
              </div>
              <div>
                <strong className="serie">R$ {milhoes(NUMEROS.somaPrecos)} mi</strong>
                <span>somados nos anúncios de hoje</span>
              </div>
              <div>
                <strong className="serie">{NUMEROS.fotos}</strong>
                <span>fotos dos carros, todas do anúncio original</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- as três portas --- */}
        <section className="secao" aria-labelledby="t-portas">
          <div className="medida">
            <div className="cabeca">
              <div>
                <p className="fino" data-revelar>
                  Por onde começar
                </p>
                <h2 id="t-portas" data-revelar style={{ marginTop: 12 }}>
                  Três caminhos
                </h2>
              </div>
            </div>

            <div className="portas">
              {PORTAS.map((p, i) => (
                <Link key={p.href} href={p.href} className="porta" data-porta={p.href}>
                  <span className="porta-numero">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </span>
                  <SetaDiagonal className="porta-seta" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- chamada final: a moldura da abertura volta, agora parada --- */}
        <section className="final secao-tinta" aria-labelledby="t-final">
          <div className="final-moldura" aria-hidden="true" />
          <div className="final-conteudo">
            <p className="fino">
              {EMPRESA.cidade}, {EMPRESA.uf}. Atendimento em todo o Brasil
            </p>
            <h2 id="t-final">O carro que você quer não precisa estar aqui.</h2>
            <p>
              Se estiver no estoque, a ficha inteira já está na tela, de{" "}
              {reais(NUMEROS.menorPreco)} a {reais(NUMEROS.maiorPreco)}. Se não
              estiver, Saulo procura.
            </p>
            <div className="final-acoes">
              <Link className="acao acao-clara" href="/estoque" data-acao="final-estoque">
                Ver o estoque
                <SetaDireita />
              </Link>
              <Link
                className="acao"
                href="/procuro"
                style={{
                  background: "transparent",
                  color: "var(--papel)",
                  borderColor: "rgba(244,242,237,0.3)",
                }}
                data-acao="final-procuro"
              >
                Procuro um carro
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
