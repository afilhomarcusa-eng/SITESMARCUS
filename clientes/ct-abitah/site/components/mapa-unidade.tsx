"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { Unidade } from "@/lib/unidades";

/*
 * O embed do Google (maps?output=embed) traz o aplicativo inteiro do Maps: no
 * celular sao alguns megabytes de terceiro que competem com as fotos das outras
 * unidades logo abaixo e seguram a pagina. Aqui e o mesmo Leaflet com tiles do
 * OSM que a home ja usa, e ele so e montado quando o mapa entra em cena.
 */
export function MapaUnidade({ unidade: u }: { unidade: Unidade }) {
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<LeafletMap | null>(null);
  const [perto, setPerto] = useState(false);

  useEffect(() => {
    const alvo = caixa.current;
    if (!alvo) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setPerto(true)),
      { rootMargin: "300px" },
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!perto) return;
    let vivo = true;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!vivo || !caixa.current || mapa.current) return;

      const m = L.map(caixa.current, {
        center: [u.lat, u.lng],
        zoom: 16,
        scrollWheelZoom: false,
        zoomAnimation: false,
        fadeAnimation: false,
      });
      mapa.current = m;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(m);

      L.marker([u.lat, u.lng], {
        icon: L.divIcon({
          className: "leaf-pin is-on",
          html: `<span class="leaf-dot"></span><em>${u.nome}</em>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        }),
        title: u.nome,
      }).addTo(m);

      m.invalidateSize();
    })();
    return () => {
      vivo = false;
      mapa.current?.remove();
      mapa.current = null;
    };
  }, [perto, u.lat, u.lng, u.nome]);

  return <div className="u-map-canvas" ref={caixa} role="region" aria-label={`Mapa da Abitah ${u.nome}`} />;
}
