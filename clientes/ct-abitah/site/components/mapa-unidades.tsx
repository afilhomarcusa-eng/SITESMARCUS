"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, WhatsApp } from "@/components/chrome";
import { mapaLink, unidades, waLink, type Unidade } from "@/lib/unidades";

/*
 * O mapa nao usa API do Google: as coordenadas reais de cada unidade sao
 * projetadas dentro de um quadro fixo da Regiao Metropolitana de Salvador.
 * Numa area desse tamanho a projecao linear e visualmente indistinguivel de
 * Mercator, entao regra de tres resolve.
 */
const QUADRO = { latMin: -13.012, latMax: -12.858, lngMin: -38.548, lngMax: -38.282 };

function projetar(u: Unidade) {
  const x = ((u.lng - QUADRO.lngMin) / (QUADRO.lngMax - QUADRO.lngMin)) * 100;
  const y = ((QUADRO.latMax - u.lat) / (QUADRO.latMax - QUADRO.latMin)) * 100;
  return { x, y };
}

/*
 * Vilas do Atlantico e Vilas Roof Top ficam a menos de 200 m uma da outra: no
 * quadro inteiro isso da 4 px e os dois pinos viram um borrao. O Roof Top ganha
 * um empurrao visual, e a legenda avisa que a posicao dele e aproximada, o que
 * e verdade de qualquer forma porque ele ainda nao tem ficha no Google.
 */
const EMPURRAO: Record<string, { x: number; y: number }> = {
  "vilas-roof-top": { x: -6.5, y: -4.5 },
};

const naRegiao = unidades.filter((u) => u.regiao !== "Feira de Santana");
const foraDaRegiao = unidades.filter((u) => u.regiao === "Feira de Santana");

export function MapaUnidades() {
  const [ativa, setAtiva] = useState(unidades[5].slug);
  const unidade = unidades.find((u) => u.slug === ativa) ?? unidades[0];
  const foraDoQuadro = unidade.regiao === "Feira de Santana";

  return (
    <div className="map-wrap" data-reveal>
      <div className="map-canvas">
        {/*
          Sem linha de costa: qualquer traco de litoral desenhado a mao ficaria
          errado em relacao aos pinos, que estao na coordenada real. Melhor uma
          malha limpa e os rotulos de cidade do que geografia inventada.
        */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g className="map-grid">
            {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((v) => (
              <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} vectorEffect="non-scaling-stroke" />
            ))}
            {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map((v) => (
              <line key={`v${v}`} x1={v} y1="0" x2={v} y2="100" vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        </svg>

        <div className="map-zone map-zone--sul">Salvador</div>
        <div className="map-zone map-zone--norte">Lauro de Freitas</div>

        {naRegiao.map((u) => {
          const p = projetar(u);
          const nudge = EMPURRAO[u.slug] ?? { x: 0, y: 0 };
          return (
            <button
              key={u.slug}
              type="button"
              className={ativa === u.slug ? "pin is-on" : "pin"}
              style={{ left: `${p.x + nudge.x}%`, top: `${p.y + nudge.y}%` }}
              onClick={() => setAtiva(u.slug)}
              aria-label={`Ver a unidade ${u.nome}`}
              aria-pressed={ativa === u.slug}
            >
              <em>{u.nome}</em>
            </button>
          );
        })}

        {/* Feira fica a cem quilometros: entra ancorada na borda, fora da escala */}
        {foraDaRegiao.map((u) => (
          <button
            key={u.slug}
            type="button"
            className={ativa === u.slug ? "pin is-on" : "pin"}
            style={{ left: "8%", top: "12%" }}
            onClick={() => setAtiva(u.slug)}
            aria-label={`Ver a unidade de ${u.cidade}`}
            aria-pressed={ativa === u.slug}
          >
            <em>{u.cidade}</em>
          </button>
        ))}

        <p className="map-note">
          Sete unidades na região metropolitana, projetadas pela coordenada real. Feira de Santana fica a cerca de 100 km
          e entra fora de escala, no canto. O Roof Top divide o terreno com Vilas e aparece deslocado para não sobrepor.
        </p>
      </div>

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
            {unidade.horarios ? <span>Abre {unidade.horarios[0].horas.split(" às ")[0]}</span> : <span>Horário pelo WhatsApp</span>}
            {foraDoQuadro && <span>≈ 100 km de Salvador</span>}
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
            ) : (
              <a className="btn btn--line" href={mapaLink(unidade)} target="_blank" rel="noreferrer" aria-label="Ver no mapa">
                <ArrowUpRight />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
