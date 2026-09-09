import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GaleriaVeiculo from "@/components/galeria-veiculo";
import { Conversa, Marcado, SetaEsquerda } from "@/components/icones";
import { lerEstoque } from "@/lib/banco";
import { acharCarro } from "@/lib/estoque";
import { km as fmtKm, reais } from "@/lib/fmt";
import { linkDoCarro } from "@/lib/mensagens";
import { CONTATO, EMPRESA } from "@/lib/contato";
import { SITE } from "@/app/layout";

export const revalidate = 300;

/**
 * Nada de generateStaticParams: o estoque agora vive no banco, e uma lista de
 * endereços congelada no build ficaria velha no primeiro carro que o Saulo
 * cadastrasse. As páginas continuam sendo servidas prontas, com validade de
 * cinco minutos, e a gerência derruba esse cache quando salva.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const carro = acharCarro(await lerEstoque(), slug);
  if (!carro) return {};

  const ano = carro.anoTexto ?? String(carro.ano);
  const ficha = [carro.km ? fmtKm(carro.km) : "", carro.potencia ? `${carro.potencia} cv` : ""]
    .filter(Boolean)
    .join(", ");
  const capa = carro.fotos[0]?.fontes.at(-1)?.url;

  return {
    title: `${carro.nome} ${ano}`,
    description: `${carro.nome} ${ano} por ${reais(carro.preco)} em Aracaju${ficha ? `. ${ficha}` : ""}. Fale com Saulo Jordão pelo WhatsApp.`,
    alternates: { canonical: `/estoque/${carro.slug}` },
    openGraph: capa
      ? {
          title: `${carro.nome} ${ano}`,
          description: `${reais(carro.preco)}${ficha ? `, ${ficha}` : ""}. Estoque de Saulo Jordão, em Aracaju.`,
          images: [{ url: capa }],
        }
      : undefined,
  };
}

export default async function Ficha({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const carros = await lerEstoque();
  const carro = acharCarro(carros, slug);
  if (!carro) notFound();

  const ano = carro.anoTexto ?? String(carro.ano);

  /* A tabela só mostra o que o anúncio disse. Campo vazio não vira linha vazia:
     o site não deduz câmbio nem cor de carro que está à venda. */
  const linhas: [string, string][] = [
    ["Ano", ano],
    ...(carro.km ? ([["Quilometragem", fmtKm(carro.km)]] as [string, string][]) : []),
    ...(carro.potencia ? ([["Potência", `${carro.potencia} cv`]] as [string, string][]) : []),
    ...(carro.motor ? ([["Motor", carro.motor]] as [string, string][]) : []),
    ...(carro.cambio ? ([["Câmbio", carro.cambio]] as [string, string][]) : []),
    ...(carro.tracao ? ([["Tração", carro.tracao]] as [string, string][]) : []),
    ...(carro.cor ? ([["Cor", carro.cor]] as [string, string][]) : []),
    ...(carro.interior ? ([["Interior", carro.interior]] as [string, string][]) : []),
  ];

  const capa = carro.fotos[0];

  const dadosEstruturados = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${carro.nome} ${ano}`,
    brand: { "@type": "Brand", name: carro.marca },
    model: carro.modelo,
    vehicleModelDate: String(carro.ano),
    ...(carro.km
      ? {
          mileageFromOdometer: {
            "@type": "QuantitativeValue",
            value: carro.km,
            unitCode: "KMT",
          },
        }
      : {}),
    ...(carro.cor ? { color: carro.cor } : {}),
    ...(capa ? { image: new URL(capa.fontes.at(-1)!.url, SITE).toString() } : {}),
    offers: {
      "@type": "Offer",
      price: carro.preco,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: EMPRESA.assinatura,
        telephone: `+${CONTATO.e164}`,
        areaServed: "BR",
      },
    },
  };

  return (
    <main id="conteudo">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />

      <div className="ficha vehicle-page">
        <Link href="/estoque" className="volta">
          <SetaEsquerda />
          Voltar ao estoque
        </Link>

        <div className="ficha-grade">
          {carro.fotos.length ? <GaleriaVeiculo fotos={carro.fotos} nome={carro.nome} /> : null}
          <div className="ficha-dados">
            {/* Sem repetir a marca, que já abre o título logo abaixo. */}
            <p className="kicker serie">Disponível agora · Aracaju, SE</p>
            <h1>{carro.nome}</h1>

            <p className="ficha-preco serie">
              {reais(carro.preco)}
              <span className="fino" style={{ letterSpacing: "0.12em" }}>
                {ano}
                {carro.km ? ` · ${fmtKm(carro.km)}` : ""}
              </span>
            </p>

            {carro.nota ? <p className="ficha-nota">{carro.nota}</p> : null}

            <dl className="tabela">
              {linhas.map(([rotulo, valor]) => (
                <div key={rotulo} style={{ display: "contents" }}>
                  <dt>{rotulo}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>

            {carro.conferido.length ? (
              <>
                <p className="fino" style={{ marginTop: 32 }}>
                  O que já está resolvido
                </p>
                <ul className="conferido">
                  {carro.conferido.map((item) => (
                    <li key={item}>
                      <Marcado />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            {carro.itens.length ? (
              <>
                <p className="fino" style={{ marginTop: 32 }}>
                  Equipamentos, como estão no anúncio
                </p>
                <ul className="itens">
                  {carro.itens.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {!carro.conferido.length && !carro.itens.length ? (
              <p style={{ marginTop: 24, color: "var(--tinta-media)", maxWidth: "44ch" }}>
                O anúncio deste carro não trouxe ficha detalhada. Quilometragem,
                histórico e opcionais Saulo passa na conversa, sem chute.
              </p>
            ) : null}

            <div className="ficha-acoes">
              <a
                className="acao"
                href={linkDoCarro(carro)}
                target="_blank"
                rel="noopener"
                data-conversa="carro"
                data-acao="ficha-whatsapp"
              >
                <Conversa />
                Falar sobre este carro
              </a>
              <Link className="acao acao-vazada" href="/procuro">
                Procuro outro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
