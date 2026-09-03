import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./site.css";
import "./life.css";

const display = Inter({ subsets: ["latin"], variable: "--display", weight: ["500", "600", "700"] });
const sans = Manrope({ subsets: ["latin"], variable: "--sans" });

export const metadata: Metadata = {
  title: "Pousada Palladium | Neópolis, Sergipe",
  description: "Conforto e hospitalidade às margens do Rio São Francisco, no centro de Neópolis.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
