import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navegacao from "@/components/navegacao";
import Movimento from "@/components/movimento";
import SecaoFinal from "@/components/secao-final";
import { CARROS_INICIAIS } from "@/lib/carros";
import { EMPRESA, TELEFONE, whatsapp } from "@/lib/contato";
import { brl, km, nome } from "@/lib/fmt";

/** Só o carro em destaque tem galeria de ângulos capturada. */
const GALERIAS: Record<string, { arquivo: string; alt: string }[]> = {
  "bmw-m4-coupe-2016": [
    { arquivo: "bmw-m4-coupe-0", alt: "de frente em três quartos, no estúdio" },
    { arquivo: "bmw-m4-coupe-1", alt: "de frente, centralizado" },
    { arquivo: "bmw-m4-coupe-2", alt: "de perfil, com o reflexo no piso" },
    { arquivo: "bmw-m4-coupe-3", alt: "traseira em três quartos" },
    { arquivo: "bmw-m4-coupe-4", alt: "traseira, com o difusor e os quatro escapes" },
    { arquivo: "bmw-m4-coupe-5", alt: "interior, bancos esportivos M em couro vermelho" },
  ],
};

export function generateStaticParams() {
  return CARROS_INICIAIS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const carro = CARROS_INICIAIS.find((c) => c.slug === slug);
  if (!carro) return {};
  const titulo = `${nome(carro)} ${carro.ano}`;
  return {
    title: `${titulo} por ${brl(carro.preco)}`,
    description: `${titulo} com ${km(carro.km)}, ${carro.motor} de ${carro.potencia} cv. ${brl(carro.preco)} na Usados de Luxo, ${EMPRESA.cidade}. Entrega em todo o Brasil.`,
    alternates: { canonical: `/estoque/${carro.slug}` },
    openGraph: { title: titulo, description: `${km(carro.km)} · ${brl(carro.preco)}` },
  };
}

export default async function PaginaCarro({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carro = CARROS_INICIAIS.find((c) => c.slug === slug);
  if (!carro) notFound();

  const galeria = GALERIAS[carro.slug] ?? [
    {
      arquivo: `${carro.foto}-g`,
      alt: "fotografado no estúdio da Usados de Luxo",
    },
  ];
  const outros = CARROS_INICIAIS.filter((c) => c.slug !== carro.slug).slice(0, 3);
  const titulo = nome(carro);

  const ficha = [
    { k: "Ano", v: carro.ano },
    { k: "Quilometragem", v: km(carro.km) },
    { k: "Motor", v: carro.motor },
    { k: "Potência", v: `${carro.potencia} cv` },
    { k: "Combustível", v: carro.combustivel },
    { k: "Câmbio", v: carro.cambio },
    { k: "Tração", v: carro.tracao },
  ];

  const anuncio = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${titulo} ${carro.ano}`,
    brand: { "@type": "Brand", name: carro.marca },
    model: carro.modelo,
    vehicleTransmission: carro.cambio,
    fuelType: carro.combustivel,
    mileageFromOdometer: { "@type": "QuantitativeValue", value: carro.km, unitCode: "KMT" },
    offers: {
      "@type": "Offer",
      price: carro.preco,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: EMPRESA.nome },
    },
  };

  return (
    <>
      <Movimento />
      <Navegacao />

      <main id="conteudo" className="pt-24 md:pt-28">
        <div className="casca">
          <Link
            href="/#estoque"
            className="dado mb-8 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.14em] md:mb-12"
            style={{ color: "var(--tinta-3)" }}
          >
            <span aria-hidden="true">&larr;</span> Voltar ao estoque
          </Link>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            {/* galeria */}
            <div className="grid gap-3">
              {galeria.map((g, i) => (
                <img
                  key={g.arquivo}
                  src={`/images/${g.arquivo}-1440.webp`}
                  alt={`${titulo} ${g.alt}`}
                  width={1440}
                  height={1800}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  decoding="async"
                  className="w-full"
                  style={{ background: "var(--fumaca)" }}
                />
              ))}
            </div>

            {/* ficha */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="etiqueta mb-4">
                {carro.marca} · {carro.ano}
              </p>
              <h1 className="display mb-3 text-[clamp(2rem,4.4vw,3.4rem)]">
                {carro.modelo} {carro.versao}
              </h1>
              <p className="dado mb-8 text-[clamp(1.3rem,2.4vw,1.9rem)]" style={{ color: "var(--latao)" }}>
                {brl(carro.preco)}
              </p>

              <a
                data-cta="carro"
                href={whatsapp(
                  `Olá! Vim pelo site e queria saber mais sobre o ${titulo} ${carro.ano}, de ${brl(carro.preco)}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="dado group mb-3 flex items-center justify-between gap-6 px-6 py-5 text-[0.74rem] uppercase tracking-[0.16em]"
                style={{ background: "var(--latao)", color: "var(--preto)", fontWeight: 500 }}
              >
                Perguntar sobre este carro
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                  style={{ transitionTimingFunction: "var(--e-saida)" }}
                >
                  &rarr;
                </span>
              </a>
              <p className="dado mb-10 text-[0.7rem]" style={{ color: "var(--tinta-3)" }}>
                Ou ligue: {TELEFONE.exibicao}
              </p>

              <dl className="mb-10">
                {ficha.map((f) => (
                  <div
                    key={f.k}
                    className="grid grid-cols-2 gap-4 border-t py-3.5"
                    style={{ borderColor: "var(--linha)" }}
                  >
                    <dt className="etiqueta pt-0.5">{f.k}</dt>
                    <dd className="dado text-[0.85rem]">{f.v}</dd>
                  </div>
                ))}
              </dl>

              <h2 className="etiqueta mb-4">O que tem neste</h2>
              <ul className="mb-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {carro.destaques.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-[0.9rem]" style={{ color: "var(--tinta-2)" }}>
                    <span
                      aria-hidden="true"
                      className="mt-2.5 inline-block h-px w-3.5 shrink-0"
                      style={{ background: "var(--latao)" }}
                    />
                    {d}
                  </li>
                ))}
              </ul>

              <p className="corpo text-[0.85rem]">
                As fotos são deste carro, feitas no nosso estúdio. Se quiser ver
                algum detalhe que não está aqui, peça no WhatsApp e a gente manda.
              </p>
            </div>
          </div>

          {/* outros do estoque */}
          <section className="secao" aria-labelledby="outros">
            <h2 id="outros" className="etiqueta mb-8">
              Outros no estoque
            </h2>
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
              {outros.map((o) => (
                <Link key={o.slug} href={`/estoque/${o.slug}`} className="group block">
                  <div className="mb-4 overflow-hidden" style={{ aspectRatio: "4 / 5", background: "var(--fumaca)" }}>
                    <img
                      src={`/images/${o.foto}-1000.webp`}
                      alt={`${nome(o)} ${o.ano} no estúdio da Usados de Luxo`}
                      width={1000}
                      height={1250}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.045]"
                      style={{ transitionTimingFunction: "var(--e-saida)" }}
                    />
                  </div>
                  <h3 className="display-solto mb-1 text-[1rem]">
                    {o.marca} {o.modelo}
                  </h3>
                  <p className="dado text-[0.75rem]" style={{ color: "var(--tinta-3)" }}>
                    {o.ano} · {brl(o.preco)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <SecaoFinal total={CARROS_INICIAIS.length} />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(anuncio) }}
      />
    </>
  );
}
