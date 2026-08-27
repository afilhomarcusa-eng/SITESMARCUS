import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./site.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Angioface | Clínica Médica e Odontológica em Aracaju",
  description:
    "Excelência em harmonização facial, angiologia e cirurgia vascular, com tecnologia, naturalidade e cuidado individualizado.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
