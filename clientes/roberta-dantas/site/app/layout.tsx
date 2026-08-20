import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { contato, links } from "@/lib/contato";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--fonte-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const corpo = Instrument_Sans({
  subsets: ["latin"],
  variable: "--fonte-corpo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roberta Dantas · Psicanálise em Aracaju e online",
  description:
    "Psicóloga em Aracaju, atendimento pelo percurso da psicanálise. Sessões presenciais e online para quem quer entender o que insiste em voltar.",
  openGraph: {
    title: "Roberta Dantas · Psicanálise em Aracaju e online",
    description:
      "Psicóloga em Aracaju, atendimento pelo percurso da psicanálise. Presencial e online.",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

/** Só entra no JSON LD o que existe em lib/contato.ts. Nada inventado. */
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "Psychologist",
  name: contato.nome,
  jobTitle: contato.profissao,
  identifier: contato.registro,
  areaServed: [
    { "@type": "City", name: contato.cidade },
    { "@type": "State", name: contato.estado },
  ],
  availableService: {
    "@type": "MedicalTherapy",
    name: "Psicanálise",
  },
  ...(links.instagram ? { sameAs: [links.instagram] } : {}),
  ...(contato.telefone ? { telephone: `+${contato.telefone}` } : {}),
  ...(contato.email ? { email: contato.email } : {}),
  ...(contato.endereco
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: contato.endereco,
          addressLocality: contato.cidade,
          addressRegion: "SE",
          addressCountry: "BR",
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dadosEstruturados),
          }}
        />
        {children}
      </body>
    </html>
  );
}
