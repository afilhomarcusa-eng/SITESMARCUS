import type { Metadata } from "next";
import { Newsreader, Karla } from "next/font/google";
import { clara, links } from "@/lib/clara";
import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--fonte-display",
  display: "swap",
  style: ["normal", "italic"],
});

const corpo = Karla({
  subsets: ["latin"],
  variable: "--fonte-corpo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clara Biscarde · Psicóloga infantojuvenil",
  description:
    "Psicoterapia para crianças e adolescentes. Um lugar para quem percebeu que o filho mudou e não sabe bem por onde começar.",
  openGraph: {
    title: "Clara Biscarde · Psicóloga infantojuvenil",
    description:
      "Psicoterapia para crianças e adolescentes, com atendimento aos pais desde a primeira conversa.",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

/** Só entra no JSON LD o que existe em lib/clara.ts. Nada inventado. */
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "Psychologist",
  name: clara.nome,
  jobTitle: clara.profissao,
  identifier: clara.registro,
  ...(clara.cidade
    ? { areaServed: { "@type": "City", name: clara.cidade } }
    : {}),
  ...(links.instagram ? { sameAs: [links.instagram] } : {}),
  ...(clara.telefone ? { telephone: `+${clara.telefone}` } : {}),
  ...(clara.email ? { email: clara.email } : {}),
  ...(clara.endereco && clara.cidade
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: clara.endereco,
          addressLocality: clara.cidade,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
        {children}
      </body>
    </html>
  );
}
