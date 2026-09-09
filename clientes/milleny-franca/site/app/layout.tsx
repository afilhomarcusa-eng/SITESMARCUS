import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { Cortina, scriptDecideCortina } from "@/components/cortina";
import { Cabecalho } from "@/components/cabecalho";
import { Rodape } from "@/components/rodape";
import {
  negocio,
  contato,
  endereco,
  horarios,
} from "@/lib/dados";
import "./globals.css";
import "./cortina.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const titulo = `${negocio.nomeCompleto} | Psicóloga infantil em ${negocio.cidade}`;
const descricao = `Milleny França, psicóloga infantil em ${negocio.cidade}, ${negocio.estado}. Intervenção precoce e apoio ao desenvolvimento no bairro Jardins. ${negocio.crp}.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://millenyfranca.com.br"),
  title: titulo,
  description: descricao,
  alternates: { canonical: "/" },
  openGraph: {
    title: titulo,
    description: descricao,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: negocio.nomeCompleto }],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descricao },
  // Enquanto a URL e so um link de aprovacao. Tirar quando o site entrar no ar.
  robots: { index: false, follow: false },
};

/** Horario no formato do schema.org, gerado a partir de lib/dados. */
const diasSchema: Record<string, string> = {
  Segunda: "Monday",
  Terça: "Tuesday",
  Quarta: "Wednesday",
  Quinta: "Thursday",
  Sexta: "Friday",
};

const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "Psychologist",
  name: negocio.nomeCompleto,
  description: descricao,
  telephone: contato.telefoneTel,
  url: "https://millenyfranca.com.br",
  image: "https://millenyfranca.com.br/img/milleny-hero-900.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: endereco.logradouro,
    addressLocality: endereco.cidade,
    addressRegion: endereco.estado,
    postalCode: endereco.cep,
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: endereco.latitude,
    longitude: endereco.longitude,
  },
  openingHoursSpecification: horarios
    .filter((h) => h.abre !== null)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${diasSchema[h.dia]}`,
      opens: h.abre,
      closes: h.fecha,
    })),
  sameAs: [contato.instagramUrl, contato.mapsUrl],
  areaServed: { "@type": "City", name: endereco.cidade },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${instrument.variable}`}>
      <head>
        {/* Bloqueante de proposito: decide a abertura antes do primeiro pixel. */}
        <script dangerouslySetInnerHTML={{ __html: scriptDecideCortina }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#f6f0e6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
      </head>
      <body>
        <Cortina />
        <a href="#conteudo" className="pular-para-conteudo">
          Ir para o conteúdo
        </a>
        <Cabecalho />
        <main id="conteudo">{children}</main>
        <Rodape />
      </body>
    </html>
  );
}
