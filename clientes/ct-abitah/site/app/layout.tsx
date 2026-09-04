import type { Metadata } from "next";
import { Archivo, Sora } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./site.css";

/**
 * Sora no display: geometrica, com terminais retos e um desenho tecnico que
 * combina com o wordmark da marca, todo em caixa alta espacada. Nao e Inter,
 * Poppins nem Montserrat.
 *
 * Archivo no corpo, pela largura estreita, que segura texto pequeno em caixa
 * alta sem virar mancha.
 */
const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600"] });
const sans = Archivo({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Abitah · Centro de Treinamento em Salvador, Lauro de Freitas e Feira de Santana",
  description:
    "Oito unidades na Bahia. Funcional, performance, spinning e corrida com acompanhamento de verdade e turmas pequenas. Escolha a unidade mais perto de você.",
  openGraph: {
    title: "Abitah · Centro de Treinamento",
    description: "Liberte o atleta que Abitah em você. Oito unidades entre Salvador, Lauro de Freitas e Feira de Santana.",
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
