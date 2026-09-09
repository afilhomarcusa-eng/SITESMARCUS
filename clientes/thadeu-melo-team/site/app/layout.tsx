import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({ src: "../public/fonts/barlow-condensed-extrabold.woff2", variable: "--font-display", weight: "800", display: "swap", preload: true });
const body = localFont({ src: [
  { path: "../public/fonts/manrope-regular.woff2", weight: "400", style: "normal" },
  { path: "../public/fonts/manrope-bold.woff2", weight: "700", style: "normal" }
], variable: "--font-body", display: "swap" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } } : {}),
  title: "Thadeu Melo Team | Clube de corrida em Aracaju",
  description: "A cidade é a nossa pista. Conheça a Thadeu Melo Team e confira os treinos na 13 de Julho, Orla de Atalaia e Parque da Sementeira, em Aracaju.",
  openGraph: { title: "Bora correr. Thadeu Melo Team", description: "Clube de corrida em Aracaju. Seu próximo treino começa com um time.", locale: "pt_BR", type: "website", images: [{ url: "/images/og-cover.jpg", width: 1200, height: 630, alt: "Thadeu Melo Team. A cidade é a nossa pista." }] },
  twitter: { card: "summary_large_image", title: "Thadeu Melo Team", images: ["/images/og-cover.jpg"] },
  robots: siteUrl ? { index: true, follow: true } : { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#153f43", width: "device-width", initialScale: 1 };

// Roda antes da primeira pintura. Marca que há JavaScript (sem isso o conteúdo
// nasce visível, nada depende de revelação) e decide se a cortina entra. Ela
// aparece uma vez por sessão, sai sozinha e também sai ao primeiro toque, clique,
// tecla ou rolagem: ninguém é obrigado a assistir.
const introScript = `var d=document.documentElement;d.classList.add('js');try{
if(matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('tmt-intro'))throw 0;
sessionStorage.setItem('tmt-intro','1');d.dataset.intro='play';
var n=['pointerdown','keydown','wheel','touchstart'],t=0,
off=function(){n.forEach(function(e){removeEventListener(e,skip)})},
end=function(){clearTimeout(t);off();d.removeAttribute('data-intro')},
skip=function(){if(d.dataset.intro!=='play')return;clearTimeout(t);off();d.dataset.intro='skip';t=setTimeout(end,340)};
n.forEach(function(e){addEventListener(e,skip,{passive:true})});t=setTimeout(end,2900);
}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={display.variable + " " + body.variable}>
    <head><script dangerouslySetInnerHTML={{ __html: introScript }} /></head>
    <body>{children}</body>
  </html>;
}
