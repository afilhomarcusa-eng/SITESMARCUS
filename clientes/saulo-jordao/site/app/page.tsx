import Link from "next/link";
import Cortina from "@/components/cortina";
import Heroi from "@/components/heroi";
import PreviewEstoque from "@/components/preview-estoque";
import { SetaDireita } from "@/components/icones";
import { lerEstoque } from "@/lib/banco";
import { destaque, numeros, seisDaHome } from "@/lib/estoque";
import { EMPRESA } from "@/lib/contato";

export const revalidate = 300;

export default async function Home() {
  const carros = await lerEstoque();
  const n = numeros(carros);
  const carroDoHeroi = destaque(carros);
  const seis = seisDaHome(carros, carroDoHeroi?.slug);

  return (
    <>
      <Cortina />
      <main>
        <Heroi carro={carroDoHeroi} numeros={n} />

        {seis.length ? (
          <section className="collection section" aria-labelledby="collection-title">
            <div className="section-heading" data-revelar>
              <p className="kicker">Seleção disponível</p>
              <h2 id="collection-title">Carros que valem<br /><em>a atenção.</em></h2>
              <p>{n.carros} veículos disponíveis em Aracaju, com ficha, quilometragem e preço.</p>
            </div>
            <PreviewEstoque carros={seis} total={n.carros} />
          </section>
        ) : null}

        <section className="about section" aria-labelledby="about-title">
          <div className="about-label kicker" data-revelar>Desde {EMPRESA.desde} · Aracaju, SE</div>
          <div className="about-copy" data-revelar>
            <h2 id="about-title">Uma negociação<br />com nome e <em>sobrenome.</em></h2>
            <p>Saulo cuida da compra, da venda e da busca do carro certo. Sem catálogo infinito, sem informação escondida e sem improviso.</p>
          </div>
          <figure className="about-photo" data-entrada-foto>
            <img
              src="/images/saulo-420.webp"
              srcSet="/images/saulo-420.webp 420w, /images/saulo-840.webp 840w"
              sizes="(max-width: 760px) 76vw, 30vw"
              width={840}
              height={1120}
              loading="lazy"
              decoding="async"
              data-nativa="900x1200"
              alt="Saulo Jordão entre veículos esportivos"
            />
            <figcaption className="kicker">Saulo Jordão · Curadoria automotiva</figcaption>
          </figure>
          <div className="about-services" data-revelar>
            <Link href="/estoque" data-porta="/estoque"><span>01</span><strong>Comprar do estoque</strong><SetaDireita /></Link>
            <Link href="/procuro" data-porta="/procuro"><span>02</span><strong>Encontrar no Brasil</strong><SetaDireita /></Link>
            <Link href="/vender" data-porta="/vender"><span>03</span><strong>Vender o seu carro</strong><SetaDireita /></Link>
          </div>
        </section>

        <section className="dark-call" aria-labelledby="dark-title">
          <p className="kicker" data-revelar>Aracaju, SE<br />Brasil inteiro</p>
          <div data-revelar>
            <h2 id="dark-title">O carro que você quer<br />não precisa estar<br /><em>no estoque.</em></h2>
            <p>Se o modelo não estiver entre os carros disponíveis, Saulo procura a configuração certa no Brasil inteiro.</p>
            <div className="dark-actions">
              <Link className="button button-light" href="/procuro" data-acao="final-procuro">Procuro um carro <SetaDireita /></Link>
              <Link className="text-link" href="/estoque" data-acao="final-estoque">Ver o estoque <SetaDireita /></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
