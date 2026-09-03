"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { services } from "@/lib/services";

function ToothMark({ active }: { active: boolean }) {
  return (
    <svg className="tooth-mark" viewBox="0 0 72 72" aria-hidden="true">
      <path d="M22 12c-7 0-12 6-12 15 0 11 5 13 7 27 1 7 3 11 7 11 5 0 5-13 12-13s7 13 12 13c4 0 6-4 7-11 2-14 7-16 7-27 0-9-5-15-12-15-6 0-8 4-14 4s-8-4-14-4Z" fill={active ? "#fff" : "#20aea4"} />
      <circle cx="25" cy="31" r="2" fill={active ? "#20aea4" : "white"} />
      <circle cx="47" cy="31" r="2" fill={active ? "#20aea4" : "white"} />
      <path d="M26 42c6 5 14 5 20 0" stroke={active ? "#20aea4" : "white"} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function PirateMapDecor() {
  return (
    <svg className="pirate-map-art" viewBox="0 0 700 620" preserveAspectRatio="none" aria-hidden="true">
      <defs><filter id="paper-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" floodColor="#27536a" floodOpacity=".13" /></filter></defs>
      <path className="map-land" d="M122 58C204 25 283 70 340 55c69-18 128-31 186 8 50 33 31 88 72 118 42 31 39 91 4 126-28 28-14 78-51 100-54 31-107 9-151 44-52 42-95 99-173 83-65-13-69-82-122-111-48-27-86-60-74-118 11-51 65-70 66-121 2-45-27-100 25-126Z" />
      <path className="map-shore" d="M122 58C204 25 283 70 340 55c69-18 128-31 186 8 50 33 31 88 72 118 42 31 39 91 4 126-28 28-14 78-51 100-54 31-107 9-151 44-52 42-95 99-173 83-65-13-69-82-122-111-48-27-86-60-74-118 11-51 65-70 66-121 2-45-27-100 25-126Z" />
      <motion.path className="map-route-line" d="M185 145C250 150 305 205 380 232C455 258 510 286 555 337C575 382 480 410 365 392C265 377 195 360 140 365C158 425 265 462 365 472C445 482 510 525 565 557" initial={false} animate={{ strokeDashoffset: [0, -68] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
      <g className="map-compass" transform="translate(58 238)" filter="url(#paper-shadow)"><circle cx="0" cy="0" r="49" /><circle cx="0" cy="0" r="38" className="compass-ring" /><path d="M0-33 9-8 0 0-9-8Z" className="compass-red" /><path d="M0 33 9 8 0 0-9 8Z" className="compass-blue" /><path d="M-33 0-8-9 0 0-8 9ZM33 0 8-9 0 0 8 9Z" className="compass-blue" /><text x="0" y="-57">N</text><text x="0" y="66">S</text><text x="-64" y="5">O</text><text x="59" y="5">L</text></g>
      <g className="pirate-boat" transform="translate(158 430)" filter="url(#paper-shadow)"><path d="M-55 16h115l-19 35H-33Z" className="boat-hull" /><path d="M-42 18 0 45 46 18" className="boat-detail" /><path d="M0 16v-103" className="boat-mast" /><path d="M5-78c41 4 55 16 69 38-25-6-43-4-69 7Z" className="boat-sail" /><path d="M-5-69c-25 4-39 15-51 34 18-4 35-2 51 6Z" className="boat-sail-small" /><path d="M2-101c20 2 26 8 36 16-15 2-23 6-36 12Z" className="pirate-flag" /><circle cx="17" cy="-86" r="3" className="flag-mark" /><path d="M-72 58c17-10 35-10 52 0s35 10 53 0 35-10 53 0" className="water-line" /></g>
      <g className="palms" transform="translate(542 120)"><path d="M0 75C9 43 6 12 0-17M31 76c0-25 8-50 22-68" className="palm-trunk" /><path d="M0-17c-31-13-49-2-62 12 31-6 47 1 62 12M0-17c11-29 36-32 57-28-22 10-36 23-46 42M0-17c-15-27-35-31-55-27 18 10 34 22 43 40M53 8c-21-15-37-9-49 0 20-2 31 5 39 15M53 8c8-19 25-21 39-16-15 5-25 15-32 28" className="palm-leaf" /><ellipse cx="21" cy="82" rx="68" ry="17" className="sand-patch" /></g>
      <g className="treasure" transform="translate(560 435)" filter="url(#paper-shadow)"><path d="M-40 3h80v52h-80Z" className="chest-body" /><path d="M-42 3c1-31 83-31 84 0Z" className="chest-top" /><path d="M0-11v66M-40 17h80" className="chest-line" /><rect x="-8" y="18" width="16" height="18" rx="3" className="chest-lock" /></g>
      <g className="treasure-x" transform="translate(615 305)"><path d="M-17-17 17 17M17-17-17 17" /><circle cx="0" cy="0" r="29" /></g>
      <g className="mountains" transform="translate(355 103)"><path d="M-78 54-23-36 18 31 47-13 92 54Z" /><path d="M-41-7-23-36-5-7M36 3 47-13 59 5" className="mountain-snow" /></g>
      <g className="map-clouds"><path d="M70 94c8-24 41-18 42 4 17-12 40 0 37 20H55c-7-15 2-26 15-24ZM421 530c7-22 34-17 37 2 14-10 35 1 31 18h-78c-5-13 1-22 10-20Z" /></g>
    </svg>
  );
}

export default function MissionBoard() {
  const [selected, setSelected] = useState(0);
  const mission = services[selected];
  return (
    <section className="missions" id="servicos" aria-labelledby="missions-title">
      <div className="shell">
        <div className="section-heading mission-heading"><div><p className="eyebrow">Mapa de cuidados</p><h2 id="missions-title">Escolha a missão do sorriso.</h2></div><p>Seis caminhos de cuidado. Selecione uma ilha para conhecer a especialidade e depois abra sua página completa.</p></div>
        <div className="mission-layout">
          <div className="mission-map" role="tablist" aria-label="Mapa de especialidades OdontoKids">
            <PirateMapDecor />
            <div className="map-label"><span>✦</span><b>Ilha OdontoKids</b><small>Toque em uma missão</small></div>
            {services.map((item, index) => (
              <motion.button type="button" role="tab" aria-selected={selected === index} className={`mission-stop map-stop-${index + 1} ${selected === index ? "is-active" : ""}`} key={item.slug} onClick={() => setSelected(index)} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: .98 }}>
                <span className="mission-number">{item.number}</span><ToothMark active={selected === index} /><span><strong>{item.short}</strong><small>{item.title}</small></span>
              </motion.button>
            ))}
            <div className="map-hint">☝ Escolha uma ilha para abrir a missão</div>
          </div>
          <AnimatePresence mode="wait">
            <motion.article className={`mission-card accent-${mission.color}`} key={mission.slug} role="tabpanel" initial={false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: .25 }}>
              <div className="mission-photo-wrap"><img src={mission.image} alt={mission.imageAlt} className="mission-photo" loading="lazy" decoding="async" /><span className="photo-sticker">missão {mission.number}</span></div>
              <div className="mission-copy"><span className="mini-tag">{mission.tag}</span><h3>{mission.title}</h3><p>{mission.summary}</p><ul>{mission.highlights.map((detail) => <li key={detail}><span>✓</span>{detail}</li>)}</ul><a className="text-link" href={`/servicos/${mission.slug}`}>Abrir página da missão <span>↗</span></a></div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
