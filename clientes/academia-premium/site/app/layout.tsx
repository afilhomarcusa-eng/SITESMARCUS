import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Connection | Academia em Aracaju",
  description:
    "Há mais de 30 anos com você. Estrutura, aulas coletivas e acompanhamento para treinar com constância em Aracaju.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
