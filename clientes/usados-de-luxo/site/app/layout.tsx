import type { Metadata } from "next";
import { Archivo, Azeret_Mono } from "next/font/google";
import { EMPRESA, ENDERECO_LINHA, HORARIO, TELEFONE, MAPS_URL } from "@/lib/contato";
import "./globals.css";

/**
 * Archivo é variável e tem eixo de largura. O display usa a versão expandida
 * (font-stretch 125%) e o texto a normal, então uma família resolve as duas
 * pontas sem virar zoológico de fonte.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--fonte-display",
  display: "swap",
  preload: true,
});

const azeret = Azeret_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--fonte-mono",
  display: "swap",
});

const SITE = "https://usadosdeluxo.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Usados de Luxo — seminovos premium em Goiânia, entrega em todo o Brasil",
    template: "%s — Usados de Luxo",
  },
  description:
    "Seminovos premium à venda em Goiânia, com entrega para todo o Brasil. Veja o estoque com preço, ano e quilometragem de cada carro, e fale direto no WhatsApp.",
  keywords: [
    "carros de luxo Goiânia",
    "seminovos premium",
    "carros importados Goiânia",
    "revenda de luxo Goiás",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE,
    siteName: EMPRESA.nome,
    title: "Usados de Luxo — seminovos premium em Goiânia",
    description:
      "Estoque com preço, ano e quilometragem de cada carro. Entrega para todo o Brasil.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Usados de Luxo — seminovos premium em Goiânia",
    description: "Estoque com preço e quilometragem. Entrega para todo o Brasil.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#0b0b0c",
  colorScheme: "dark" as const,
};

/** Só entra aqui o que foi conferido no Maps e nas legendas do Instagram. */
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: EMPRESA.nome,
  legalName: EMPRESA.nomeCompleto,
  url: SITE,
  telephone: `+${TELEFONE.e164}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: EMPRESA.endereco,
    addressLocality: EMPRESA.cidade,
    addressRegion: EMPRESA.estado,
    postalCode: EMPRESA.cep,
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", latitude: EMPRESA.lat, longitude: EMPRESA.lng },
  openingHours: HORARIO.schema,
  areaServed: { "@type": "Country", name: "Brasil" },
  sameAs: [`https://www.instagram.com/${EMPRESA.instagram}/`, EMPRESA.youtube, MAPS_URL],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${azeret.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // Objeto montado neste arquivo, sem entrada de usuário.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
      </head>
      <body style={{ ["--fonte-texto" as string]: "var(--fonte-display)" }}>
        <a href="#conteudo" className="so-leitor">
          Pular para o conteúdo
        </a>
        {children}
        <span className="so-leitor">{ENDERECO_LINHA}</span>
      </body>
    </html>
  );
}
