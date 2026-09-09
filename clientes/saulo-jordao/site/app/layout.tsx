import type { Metadata } from "next";
import "@fontsource-variable/manrope/wght.css";
import Cabecalho from "@/components/cabecalho";
import Rodape from "@/components/rodape";
import Movimento from "@/components/movimento";
import { CONTATO, EMPRESA, INSTAGRAM_URL, ONDE_ATENDE } from "@/lib/contato";
import { DURACAO_ABERTURA, SCRIPT_ABERTURA } from "@/lib/abertura";
import "./globals.css";

/**
 * Duas famílias, nenhuma delas neutra por acidente.
 *
 * Host Grotesk tem eixo óptico e desenho próprio: em corpo grande fica seco e
 * caro, e em corpo de texto continua legível, sem a cara de modelo pronto que
 * Inter e Poppins carregam. É ela que assina o nome do Saulo na abertura, no
 * herói e no fim do texto dele.
 *
 * Geist Mono cuida de preço, quilometragem, potência e das etiquetas miúdas.
 * Número de carro se lê em coluna, comparando um com o outro, e monoespaçada
 * alinha a coluna sozinha. É também o que dá ao site o ar de painel de
 * instrumento sem precisar desenhar nenhum.
 */
export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saulo-jordao.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Saulo Jordão, corretor de veículos premium em Aracaju",
    template: "%s — Saulo Jordão Premium Cars",
  },
  description:
    "Compra, venda e importação de carros premium em Aracaju, com atendimento em todo o Brasil. Estoque com ficha, quilometragem e preço na tela.",
  keywords: [
    "carros premium Aracaju",
    "corretor de veículos Sergipe",
    "comprar carro importado Aracaju",
    "vender carro premium Sergipe",
    "seminovos de luxo Aracaju",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE,
    siteName: EMPRESA.assinatura,
    title: "Saulo Jordão, corretor de veículos premium em Aracaju",
    description:
      "Compra, venda e importação de carros premium. Estoque com ficha e preço na tela.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saulo Jordão Premium Cars",
    description: "Corretor de veículos premium em Aracaju, atendimento em todo o Brasil.",
    images: ["/og.jpg"],
  },
  /* Enquanto o endereço for link de aprovação do cliente, fica fora do índice.
     Vira `true` no dia em que o domínio próprio entrar no ar. */
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#f4f2ed",
  colorScheme: "light" as const,
};

/** Só entra aqui o que foi conferido nas fontes. Não há endereço de rua
    publicado, então não existe campo de rua: corretor não é loja. */
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: EMPRESA.assinatura,
  description: `${EMPRESA.atividade} em ${EMPRESA.cidade}. Compra, venda e importação, com atendimento em todo o Brasil.`,
  url: SITE,
  telephone: `+${CONTATO.e164}`,
  email: EMPRESA.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: EMPRESA.cidade,
    addressRegion: EMPRESA.uf,
    addressCountry: "BR",
  },
  areaServed: { "@type": "Country", name: "Brasil" },
  foundingDate: String(EMPRESA.desde),
  sameAs: [INSTAGRAM_URL],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      /* A duração da abertura tem uma fonte só, em lib/abertura.ts. O CSS lê
         daqui e o QA mede contra a mesma constante. */
      style={{ "--d-abertura": `${DURACAO_ABERTURA}ms` } as React.CSSProperties}
    >
      <head>
        {/* Decide a abertura antes da primeira pintura. Precisa ser bloqueante e
            precisa estar aqui em cima: é o que garante que a cortina já esteja
            ligada, ou já descartada, no primeiro quadro que o visitante vê. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_ABERTURA }} />
        <script
          type="application/ld+json"
          // Objeto montado neste arquivo, sem entrada de usuário.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
        />
      </head>
      <body>
        <a href="#conteudo" className="so-leitor">
          Pular para o conteúdo
        </a>
        <Cabecalho />
        {children}
        <Rodape />
        <Movimento />
        <span className="so-leitor">{ONDE_ATENDE}</span>
      </body>
    </html>
  );
}
