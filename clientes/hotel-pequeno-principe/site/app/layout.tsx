import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./site.css";
import "./final-overrides.css";

const display = Baloo_2({ subsets: ["latin"], variable: "--font-display" });
const sans = Nunito({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Hotel Pequeno Príncipe | Arapiraca",
  description: "Uma estadia acolhedora no centro de Arapiraca, com café da manhã, restaurante, estacionamento e recepção 24 horas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
