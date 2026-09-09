"use client";
import { useState } from "react";
import { locations, club, week } from "@/lib/content";
import { Arrow, Track } from "./icons";

export function Schedule() {
  const [selected, setSelected] = useState(0);
  const location = locations[selected];
  return <div className="schedule">
    <div className="location-select" aria-label="Escolha o local de treino">{locations.map((item, index) =>
      <button type="button" key={item.id} aria-pressed={selected === index} aria-controls="schedule-panel" onClick={() => setSelected(index)}>
        <span className="location-index">0{index + 1}</span><span>{item.short}</span><Arrow diagonal />
      </button>
    )}</div>
    {/* O painel da esquerda carregava uma foto por local, e as três eram o mesmo
        recorte da mesma foto. No lugar delas entra a semana do local escolhido,
        que é informação que o visitante procura e que o clube tem de verdade. */}
    <div className="schedule-body" id="schedule-panel" aria-live="polite" aria-atomic="true" style={{ "--lane": selected } as React.CSSProperties}>
      <div className="location-art">
        <Track className="location-track" />
        <span className="location-art-label">ARACAJU / SE</span>
        <span className="location-art-number">0{selected + 1}</span>
        <div className="week-strip" aria-label={"Dias de treino na " + location.name + ": " + location.days.join(", ")}>
          {week.map(day => <span key={day} className={location.days.includes(day) ? "is-on" : ""} aria-hidden="true">{day}</span>)}
        </div>
        <div className="location-art-bottom"><span className="location-dot" /><span>{location.name}</span></div>
      </div>
      <div className="schedule-info" key={location.id}>
        <span className="eyebrow">Seu ponto de partida</span>
        <h3>{location.name}</h3><p>{location.description}</p>
        <div className="sessions">{location.sessions.map((session, index) => <div className="session" key={index}><div><span>{session.days}</span><small>{session.period}</small></div><strong>{session.time}</strong></div>)}</div>
        <a className="text-link" href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(location.map)} target="_blank" rel="noopener noreferrer">Ver região no mapa<Arrow diagonal /></a>
      </div>
    </div>
    <div className="schedule-note"><p>Antes de calçar o tênis, confirme os horários e o ponto de encontro com a equipe.</p><a href={club.whatsapp} target="_blank" rel="noopener noreferrer">Confirmar meu treino no WhatsApp<Arrow diagonal /></a></div>
    <noscript><div className="nojs-schedule">{locations.map(item => <div key={item.id}><h3>{item.name}</h3>{item.sessions.map((session, index) => <p key={index}>{session.days}: {session.time}</p>)}<a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(item.map)}>Ver região no mapa</a></div>)}</div></noscript>
  </div>;
}
