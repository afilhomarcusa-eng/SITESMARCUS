import type { Metadata } from "next";
import "./site.css";
import "./internal.css";

export const metadata: Metadata = {
  title: "OdontoKids | Sorrisos que crescem felizes",
  description: "Odontopediatria com cuidado, acolhimento e uma experiência leve para crianças e famílias.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
