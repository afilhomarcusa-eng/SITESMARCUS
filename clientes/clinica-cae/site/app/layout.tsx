import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clínica CAE | Audição e Equilíbrio em Aracaju",
  description: "Audiometria, impedanciometria e processamento auditivo central em Aracaju, com orientação clara em cada etapa.",
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "MedicalClinic",
  name: "CAE - Clínica de Audição e Equilíbrio", telephone: "+55 79 98804-3479",
  url: "https://www.instagram.com/clinicacae/",
  address: { "@type": "PostalAddress", streetAddress: "Av. Gonçalo Prado Rolemberg, 211, Centro Médico José Augusto Barreto, sala 809", addressLocality: "Aracaju", addressRegion: "SE", addressCountry: "BR" },
  sameAs: ["https://www.instagram.com/clinicacae/"]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /></body></html>;
}
