import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import {
  CONTATO,
  EMPRESA,
  ENDERECO_LINHA,
  HORARIO,
  ROTA_URL,
} from "@/lib/contato";
import { DURACAO_ABERTURA, SCRIPT_ABERTURA } from "@/lib/abertura";
import "./globals.css";

/**
 * Bricolage Grotesque tem eixo óptico e larguras próprias, então o display
 * ganha peça fundida sem virar um grotesco genérico. Space Grotesk cuida do
 * texto e dos números, com tabular ligado nos tokens.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--fonte-display",
  display: "swap",
  preload: true,
});

const texto = Space_Grotesk({
  subsets: ["latin"],
  variable: "--fonte-texto",
  display: "swap",
});

const SITE = "https://deluxmotors.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Delux Motors — compra, venda e consignação de carros em Salvador",
    template: "%s — Delux Motors",
  },
  description:
    "Loja de carros na Boca do Rio, em Salvador. Compramos o seu, vendemos os nossos e cuidamos da venda em consignação. Fale direto no WhatsApp.",
  keywords: [
    "carros em Salvador",
    "comprar carro Salvador",
    "vender meu carro Salvador",
    "consignação de veículos Bahia",
    "seminovos Boca do Rio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE,
    siteName: EMPRESA.nome,
    title: "Delux Motors — Salvador, Boca do Rio",
    description: "Compra, venda e consignação de carros. Fale direto no WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delux Motors — Salvador, Boca do Rio",
    description: "Compra, venda e consignação de carros.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#08070a",
  colorScheme: "dark" as const,
};

/** Só entra aqui o que foi conferido no Google e na fachada da loja. */
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: EMPRESA.nome,
  url: SITE,
  telephone: `+${CONTATO.e164}`,
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
  areaServed: { "@type": "City", name: "Salvador" },
  hasMap: ROTA_URL,
  sameAs: [`https://www.instagram.com/${EMPRESA.instagram}/`],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${texto.variable}`}
      /* A duração da abertura tem uma fonte só, em lib/abertura.ts. O CSS lê
         daqui e o QA mede contra a mesma constante. */
      style={{ "--d-abertura": `${DURACAO_ABERTURA}ms` } as React.CSSProperties}
    >
      <head>
        {/* Decide a abertura antes da primeira pintura.

            Precisa ser bloqueante e precisa estar aqui em cima: é o que garante
            que a cortina já esteja ligada, ou já descartada, no primeiro quadro
            que o visitante vê. A versão anterior decidia isso no React, depois
            da hidratação, e no meio do caminho a página aparecia aberta. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ABERTURA }} />
        <script
          type="application/ld+json"
          // Objeto montado neste arquivo, sem entrada de usuário.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
      </head>
      <body>
        <a href="#conteudo" className="so-leitor">
          Pular para o conteúdo
        </a>
        {children}
        <span className="so-leitor">{ENDERECO_LINHA}</span>
      </body>
    </html>
  );
}
