import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CARROS, carroPorSlug } from "@/lib/estoque";
import { km as fmtKm, reais } from "@/lib/fmt";
import { linkDoCarro } from "@/lib/mensagens";
import { CONTATO, EMPRESA } from "@/lib/contato";
import { SITE } from "@/app/layout";
import { Conversa, Marcado, SetaEsquerda } from "@/components/icones";

export function generateStaticParams() {
  return CARROS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const carro = carroPorSlug(slug);
  if (!carro) return {};

  const ano = carro.anoTexto ?? String(carro.ano);
  const ficha = [carro.km ? fmtKm(carro.km) : "", carro.potencia ? `${carro.potencia} cv` : ""]
    .filter(Boolean)
    .join(", ");

  return {
    title: `${carro.nome} ${ano}`,
    description: `${carro.nome} ${ano} por ${reais(carro.preco)} em Aracaju${ficha ? `. ${ficha}` : ""}. Fale com Saulo Jordão pelo WhatsApp.`,
    alternates: { canonical: `/estoque/${carro.slug}` },
    openGraph: {
      title: `${carro.nome} ${ano}`,
      description: `${reais(carro.preco)}${ficha ? `, ${ficha}` : ""}. Estoque de Saulo Jordão, em Aracaju.`,
      images: [{ url: `/images/${carro.slug}-retrato-1440.webp` }],
    },
  };
}

export default async function Ficha({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const carro = carroPorSlug(slug);
  if (!carro) notFound();

  const ano = carro.anoTexto ?? String(carro.ano);
  const serie = CARROS.findIndex((c) => c.slug === carro.slug) + 1;

  /* A tabela só mostra o que a legenda do anúncio disse. Campo vazio não vira
     linha vazia: o site não deduz câmbio nem cor de carro à venda. */
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

  const fotosDaTira = Array.from(
    { length: Math.min(5, Math.max(0, carro.fotos - 1)) },
    (_, i) => i + 1,
  );

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
    image: `${SITE}/images/${carro.slug}-retrato-1440.webp`,
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

      <div className="ficha">
        <Link href="/estoque" className="volta">
          <SetaEsquerda />
          Voltar ao estoque
        </Link>

        <div className="ficha-grade">
          <div className="ficha-moldura" data-entrada-foto>
            <img
              src={`/images/${carro.slug}-retrato-720.webp`}
              srcSet={`/images/${carro.slug}-retrato-720.webp 720w, /images/${carro.slug}-retrato-1440.webp 1440w`}
              sizes="(max-width: 1080px) 92vw, 46vw"
              width={720}
              height={960}
              alt={`${carro.nome}${carro.cor ? `, cor ${carro.cor}` : ""}, foto do anúncio`}
              fetchPriority="high"
              decoding="async"
              data-foto-carro
            />
          </div>

          <div className="ficha-dados">
            {/* Sem repetir a marca, que já abre o título logo abaixo. */}
            <p className="fino serie">
              {String(serie).padStart(2, "0")}/{CARROS.length} · no estoque
            </p>
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

        {fotosDaTira.length ? (
          <section className="tira" aria-labelledby="t-tira">
            <div className="cabeca" style={{ marginBottom: 24 }}>
              <h2 id="t-tira" style={{ fontSize: "var(--t-titulo)" }}>
                Mais fotos
              </h2>
              {/* A contagem sai do dado. Escrever "cinco fotos" à mão quebraria
                  no dia em que este carro tivesse quatro. */}
              <p className="cabeca-nota">
                {fotosDaTira.length} das {carro.fotos} fotos do anúncio, sem
                retoque nem montagem. O resto Saulo manda na conversa.
              </p>
            </div>
            <div className="tira-rolo">
              {fotosDaTira.map((i) => (
                <figure key={i}>
                  <img
                    src={`/images/${carro.slug}-tira-${i}-320.webp`}
                    srcSet={`/images/${carro.slug}-tira-${i}-320.webp 320w, /images/${carro.slug}-tira-${i}-640.webp 640w`}
                    sizes="(max-width: 900px) 60vw, 320px"
                    width={320}
                    height={427}
                    alt={`${carro.modelo}, foto ${i + 1} do anúncio`}
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="serie">
                    {String(i + 1).padStart(2, "0")} de {carro.fotos}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
