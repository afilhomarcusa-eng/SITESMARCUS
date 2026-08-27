import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import "./site.css";

/**
 * Fraunces no lugar da Cormorant Garamond.
 *
 * A Cormorant e uma didone fina, e a fina some: nos titulos grandes do azul
 * ela ficava apagada, e e a serifa que todo site "elegante" usa. A Fraunces
 * tem corpo, e os eixos SOFT e WONK arredondam os terminais e destorcem o
 * italico o suficiente para o texto parecer desenhado, nao gerado. O italico
 * entra porque o "Descanse." da capa depende dele.
 */
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

/** Karla no lugar da Manrope, que e a grotesca neutra padrao de todo lugar. */
const sans = Karla({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Pousada Nossa Senhora Aparecida | Hospedagem em Itabaiana",
  description: "Hospedagem confortável no centro de Itabaiana, com café da manhã, estacionamento, Wi-Fi e atendimento 24 horas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
