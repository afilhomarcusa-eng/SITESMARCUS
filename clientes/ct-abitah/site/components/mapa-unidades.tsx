"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { ArrowRight, WhatsApp } from "@/components/chrome";
import { unidades, waLink } from "@/lib/unidades";

/*
 * Mapa de verdade, com tiles, zoom e arrasto. O embed do Google so aceita um
 * lugar por iframe e a API com varios marcadores exige chave, entao aqui e
 * Leaflet com tiles do Carto Positron, que combinam com a paleta clara da marca.
 * Clicar num marcador troca a unidade no painel, e escolher no painel leva o
 * mapa ate ela.
 */
export function MapaUnidades() {
  const [ativa, setAtiva] = useState(unidades[5].slug);
  const caixa = useRef<HTMLDivElement>(null);
  const mapa = useRef<LeafletMap | null>(null);
  const marcadores = useRef<Record<string, Marker>>({});
  const montado = useRef(false);
  const unidade = unidades.find((u) => u.slug === ativa) ?? unidades[0];

  useEffect(() => {
    let vivo = true;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!vivo || !caixa.current || mapa.current) return;

      const m = L.map(caixa.current, { scrollWheelZoom: false });
      mapa.current = m;

      /* OSM padrao: livre e sem chave. O Carto passou a exigir API key. */
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(m);

      unidades.forEach((u) => {
        const icone = L.divIcon({
          className: "leaf-pin",
          html: `<span class="leaf-dot"></span><em>${u.nome}</em>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        const mk = L.marker([u.lat, u.lng], { icon: icone, title: u.nome }).addTo(m);
        mk.on("click", () => setAtiva(u.slug));
        marcadores.current[u.slug] = mk;
      });

      m.fitBounds(
        unidades.map((u) => [u.lat, u.lng] as [number, number]),
        { padding: [50, 50] },
      );

      /* o destaque do selecionado sai daqui: quando o efeito de [ativa] rodou
         pela primeira vez os marcadores ainda nao existiam */
      marcadores.current[ativa]?.getElement()?.classList.add("is-on");
      montado.current = true;
    })();
    return () => {
      vivo = false;
      mapa.current?.remove();
      mapa.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    Object.entries(marcadores.current).forEach(([slug, mk]) => {
      mk.getElement()?.classList.toggle("is-on", slug === ativa);
    });
    /* na primeira renderizacao o enquadramento e o fitBounds das oito, nao um voo */
    if (!montado.current) return;
    const u = unidades.find((x) => x.slug === ativa);
    if (u && mapa.current) mapa.current.flyTo([u.lat, u.lng], 14, { duration: 0.8 });
  }, [ativa]);

  return (
    <div className="map-wrap" data-reveal>
      <div className="map-canvas" ref={caixa} role="application" aria-label="Mapa das unidades Abitah" />

      <div className="map-panel">
        <div className="map-list">
          {unidades.map((u) => (
            <button
              key={u.slug}
              type="button"
              className={ativa === u.slug ? "map-item is-on" : "map-item"}
              onClick={() => setAtiva(u.slug)}
              aria-pressed={ativa === u.slug}
            >
              <span>
                <b>{u.nome}</b>
                <small>{u.cidade}</small>
              </span>
              <i>{u.nota ? `${u.nota.toString().replace(".", ",")} ★` : "—"}</i>
            </button>
          ))}
        </div>

        <div className="map-detail">
          <span className="tag">{unidade.destaque}</span>
          <h3>{unidade.nome}</h3>
          <address>
            {unidade.endereco}
            <br />
            {unidade.bairro} · {unidade.cidade}
            {unidade.cep ? ` · ${unidade.cep}` : ""}
          </address>

          <div className="map-detail-meta">
            {unidade.nota ? (
              <span className="is-star">
                {unidade.nota.toString().replace(".", ",")} no Google · {unidade.avaliacoes} avaliações
              </span>
            ) : (
              <span>Sem avaliações públicas ainda</span>
            )}
            {unidade.horarios ? (
              <span>Abre {unidade.horarios[0].horas.split(" às ")[0]}</span>
            ) : (
              <span>Horário pelo WhatsApp</span>
            )}
          </div>

          <div className="map-actions">
            <Link className="btn btn--brand" href={`/unidades/${unidade.slug}`}>
              Ver a unidade <ArrowRight />
            </Link>
            {unidade.whatsapp ? (
              <a
                className="btn btn--line"
                href={waLink(unidade.whatsapp, `Olá! Quero saber sobre a unidade ${unidade.nome} do CT Abitah.`)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Falar no WhatsApp com a unidade ${unidade.nome}`}
              >
                <WhatsApp />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
