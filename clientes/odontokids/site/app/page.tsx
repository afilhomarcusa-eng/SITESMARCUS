"use client";

import { motion } from "motion/react";
import MissionBoard from "@/components/mission-board";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const whatsapp = "https://wa.me/5579991471849?text=Olá!%20Gostaria%20de%20agendar%20uma%20consulta%20na%20OdontoKids.";

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero" id="inicio">
        <div className="shell hero-grid">
          <motion.div className="hero-copy" initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="hero-kicker"><i /> Odontopediatria em Sergipe</span>
            <h1>Onde cada sorriso começa <em>sentindo-se em casa.</em></h1>
            <p>Uma experiência odontológica leve, cuidadosa e feita para crianças — com escuta para as famílias e uma dose certa de encanto.</p>
            <div className="hero-actions">
              <motion.a whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} className="primary-btn" href={whatsapp} target="_blank" rel="noreferrer">Quero agendar <Arrow /></motion.a>
              <a className="play-link" href="#servicos"><b>↓</b> Explorar missões</a>
            </div>
            <div className="hero-note"><span className="tiny-tooth">✦</span><p><strong>Primeira visita?</strong> A gente prepara cada detalhe para ela ser uma boa lembrança.</p></div>
          </motion.div>

          <motion.div className="hero-art" initial={false} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, delay: 0.1 }}>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="hero-photo-frame"><img src="/hero-crianca.jpg" alt="Criança sorrindo durante uma consulta odontológica" /></div>
            <div className="floating-card card-smile"><span>✦</span><b>Sorriso<br />com coragem</b></div>
            <div className="floating-card card-map"><span>01</span><b>Mapa do<br />sorriso</b></div>
            <svg className="hero-doodle" viewBox="0 0 180 160" aria-hidden="true"><path d="M16 98c26-55 43 36 69-2s35-61 59-17 22-27 30-28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 8" /><circle cx="17" cy="98" r="7" fill="currentColor" /></svg>
          </motion.div>
        </div>
        <div className="hero-wave" />
      </section>

      <section className="intro-strip">
        <div className="shell intro-grid">
          <p className="eyebrow">A nossa forma de cuidar</p>
          <h2>Menos medo. Mais descobertas.</h2>
          <p>Consultas com tempo, linguagem que a criança entende e profissionais que enxergam o sorriso dentro de uma história maior.</p>
          <a href="#equipe" className="round-arrow" aria-label="Conhecer a equipe">↘</a>
        </div>
      </section>

      <MissionBoard />

      <section className="visit-section" aria-labelledby="visit-title">
        <div className="shell visit-grid">
          <div className="visit-visual"><img src="/espaco.jpg" alt="Espaço acolhedor da OdontoKids" /><div className="visual-bubble">a visita pode ser<br /><strong>uma aventura</strong></div></div>
          <div className="visit-copy">
            <p className="eyebrow">Como é a visita</p>
            <h2 id="visit-title">A criança conduz o ritmo. A gente acompanha.</h2>
            <div className="steps">
              <article><b>01</b><div><h3>Chegar e explorar</h3><p>Conhecer o espaço, os sons e as pessoas antes de qualquer procedimento.</p></div></article>
              <article><b>02</b><div><h3>Contar e mostrar</h3><p>Explicamos de um jeito lúdico o que vai acontecer — sem sustos.</p></div></article>
              <article><b>03</b><div><h3>Cuidar junto</h3><p>Família e equipe alinhadas para transformar saúde em rotina possível.</p></div></article>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section" id="equipe">
        <div className="shell">
          <div className="section-heading">
            <div><p className="eyebrow">Quem cuida</p><h2>Conhecimento técnico, jeito de gente.</h2></div>
            <p>Uma equipe que une odontologia, acolhimento e muita atenção aos detalhes que fazem uma criança se sentir segura.</p>
          </div>
          <div className="team-grid">
            <motion.article whileHover={{ y: -6 }} className="team-card"><img src="/dr-joaldo.jpeg" alt="Dr. Joaldo" /><div><span>Odontopediatria</span><h3>Dr. Joaldo</h3><p>Cuidado humanizado aliado à odontologia especializada.</p></div></motion.article>
            <motion.article whileHover={{ y: -6 }} className="team-card team-card-main"><img src="/equipe-2.jpeg" alt="Dra. Maíra Paixão" /><div><span>Odontopediatria</span><h3>Dra. Maíra<br />Paixão</h3><p>Especialista em odontopediatria e sedação consciente.</p></div></motion.article>
            <motion.article whileHover={{ y: -6 }} className="team-card"><img src="/equipe-3.jpeg" alt="Dra. Edineuza Dantas" /><div><span>Ortodontia</span><h3>Dra. Edineuza<br />Dantas</h3><p>Cuidados para acompanhar cada fase do crescimento.</p></div></motion.article>
            <motion.article whileHover={{ y: -6 }} className="team-card"><img src="/equipe-1.jpeg" alt="Dra. Renata" /><div><span>Endodontia</span><h3>Dra. Renata</h3><p>Técnica e tranquilidade para preservar cada sorriso.</p></div></motion.article>
          </div>
        </div>
      </section>

      <section className="locations" id="unidades">
        <div className="shell location-grid">
          <div><p className="eyebrow">Duas unidades</p><h2>Pertinho da sua família.</h2><p className="location-intro">Escolha a unidade mais conveniente e venha conhecer a OdontoKids.</p></div>
          <div className="location-card"><span>01</span><h3>Socorro</h3><p>Conj. João Alves Filho<br />Av. Nossa Senhora do Socorro, 140</p><a href={whatsapp} target="_blank" rel="noreferrer">Falar com a unidade <Arrow /></a></div>
          <div className="location-card"><span>02</span><h3>Barra dos Coqueiros</h3><p>Bairro Luar da Barra<br />Av. Ester Sampaio Martins, 501</p><a href={whatsapp} target="_blank" rel="noreferrer">Falar com a unidade <Arrow /></a></div>
        </div>
      </section>

      <section className="final-cta">
        <div className="shell final-cta-inner">
          <div><p className="eyebrow">Próxima missão</p><h2>Vamos fazer dessa consulta uma boa história?</h2></div>
          <motion.a whileHover={{ scale: 1.03, rotate: -1 }} whileTap={{ scale: 0.98 }} href={whatsapp} target="_blank" rel="noreferrer" className="cta-sticker">Agendar<br />consulta <Arrow /></motion.a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
