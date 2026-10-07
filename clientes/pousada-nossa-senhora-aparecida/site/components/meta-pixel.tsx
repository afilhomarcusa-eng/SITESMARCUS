"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { META_PIXEL_ID, rastrear } from "@/lib/meta-pixel";

/**
 * Código base da Meta, com uma trava a mais: o snippet oficial só protege a
 * definição do fbq, e deixaria o init e o PageView rodarem de novo se o
 * script fosse executado duas vezes. A trava garante um init e um PageView
 * por carregamento de página.
 */
const codigoBase = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
if (!window.__metaPixelIniciado) {
  window.__metaPixelIniciado = true;
  fbq('init', '${META_PIXEL_ID}');
  fbq('track', 'PageView');
}
`;

/**
 * Carregado uma vez no layout raiz, que no App Router não remonta entre rotas.
 *
 * O PageView da primeira página sai do código base. Este componente só cobre
 * as trocas de rota feitas pelo <Link> (home <-> política de privacidade),
 * que não recarregam a página. A primeira execução do efeito apenas memoriza
 * a rota: é isso que impede o PageView duplicado no carregamento.
 *
 * Usa só o pathname: troca de âncora (#reservar, #galeria) não muda o
 * pathname e por isso não conta como página nova.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const rotaAnterior = useRef<string | null>(null);

  useEffect(() => {
    if (rotaAnterior.current === null) {
      rotaAnterior.current = pathname;
      return;
    }
    if (rotaAnterior.current === pathname) return;
    rotaAnterior.current = pathname;
    rastrear("PageView");
  }, [pathname]);

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: codigoBase }}
    />
  );
}
