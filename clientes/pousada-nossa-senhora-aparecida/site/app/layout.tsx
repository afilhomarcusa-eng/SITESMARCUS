import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import { MetaPixel } from "@/components/meta-pixel";
import { META_PIXEL_ID } from "@/lib/meta-pixel";
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
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable}`}>
        {children}
        <MetaPixel />
        {/* Fallback da Meta para quem navega sem JavaScript. Fica no HTML do
            servidor, em todas as páginas, e não aparece na tela. */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  );
}
