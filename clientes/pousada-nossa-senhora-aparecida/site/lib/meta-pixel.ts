/**
 * Meta Pixel. ID enviado pelo gestor de tráfego.
 *
 * Todo evento do site passa por aqui. Se o fbq ainda não existe (script
 * bloqueado por extensão, rede lenta, JS da Meta fora do ar), a chamada é
 * ignorada em silêncio: rastreamento nunca pode quebrar o site.
 */
export const META_PIXEL_ID = "1419059969606079";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/** Só os eventos padrão que o site realmente usa. */
export type MetaEvento = "PageView" | "Contact" | "Lead" | "FindLocation";

export function rastrear(evento: MetaEvento, params?: Record<string, string>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) window.fbq("track", evento, params);
  else window.fbq("track", evento);
}
