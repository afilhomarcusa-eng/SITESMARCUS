import type { Metadata } from "next";
import { Petrona, Archivo } from "next/font/google";
import "./site.css";

/**
 * Petrona no display. E uma serifa variavel de contraste baixo, com peso no
 * traco: aguenta titulo grande sobre o degrade do nascente sem sumir, e nao e
 * a Playfair que todo hotel usa. O italico entra no "Sol Nascente" da capa.
 *
 * Archivo no corpo. Grotesca humanista de largura estreita, com textura
 * suficiente para nao virar Inter. Nenhuma das tres proibidas do briefing.
 */
const display = Petrona({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

const sans = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Hotel Sol Nascente | Hospedagem, eventos e restaurante em Arapiraca",
  description:
    "Hotel em Arapiraca com piscina, café da manhã incluído, restaurante aberto ao público e auditório para eventos. Nota 4,5 no Google com 219 avaliações.",
  openGraph: {
    title: "Hotel Sol Nascente · Arapiraca/AL",
    description:
      "Seu refúgio no coração de Arapiraca. Hospedagem, auditório para eventos e restaurante aberto ao público.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
