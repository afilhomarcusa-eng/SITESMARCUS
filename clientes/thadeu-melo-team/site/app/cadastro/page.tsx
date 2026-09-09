import type { Metadata } from "next";
import Link from "next/link";
import { Arrow, Track, Wordmark } from "@/components/icons";
import { SignupForm } from "@/components/signup-form";
import { Frame } from "@/components/photo";
import { club, locations, steps, photos } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  title: "Cadastro | Thadeu Melo Team",
  description: "Conte sua rotina e o clube indica o ponto de treino em Aracaju. O cadastro abre a conversa no WhatsApp com as suas respostas.",
  ...(siteUrl ? { alternates: { canonical: "/cadastro" } } : {}),
};

export default function Cadastro() {
  return <>
    <a className="skip-link" href="#formulario">Pular para o formulário</a>

    {/* Cabeçalho próprio: as âncoras do menu do site só existem na home, e um
        link quebrado numa página de cadastro custa caro. Aqui é voltar e falar. */}
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Thadeu Melo Team, voltar para o site"><Wordmark /></Link>
      <span className="header-location">Clube de corrida<br />Aracaju, Sergipe</span>
      <Link className="signup-back" href="/">Voltar ao site</Link>
      <a className="header-cta" href={club.whatsapp} target="_blank" rel="noopener noreferrer">Falar direto<Arrow diagonal /></a>
    </header>

    <main className="signup-main">
      <section className="signup-hero section-shell">
        <Track className="signup-track" />
        <div className="signup-intro">
          <span className="eyebrow"><i className="status-dot" />Cadastro</span>
          <h1>Conte sua rotina.<br /><em>O ponto de treino é o passo seguinte.</em></h1>
          <p>São quatro respostas rápidas. Com elas a equipe já sabe qual dos três locais encaixa na sua semana e qual horário faz sentido para você.</p>
        </div>
        <Frame photo={photos.largada} className="signup-shot" sizes="(max-width: 900px) 62vw, 320px" />
      </section>

      <div className="signup-body section-shell">
        <div className="signup-aside">
          <div className="aside-block">
            <span className="eyebrow">O que acontece depois</span>
            <ol className="aside-steps">
              {steps.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>)}
            </ol>
          </div>
          <div className="aside-block">
            <span className="eyebrow">A agenda de hoje</span>
            <ul className="aside-schedule">
              {locations.map(item => <li key={item.id}>
                <strong>{item.name}</strong>
                {item.sessions.map((session, index) => <span key={index}>{session.days}<b>{session.time}</b></span>)}
              </li>)}
            </ul>
            <p className="aside-note">Confirme o ponto exato de encontro com a equipe antes do primeiro treino.</p>
          </div>
        </div>

        <div className="signup-panel" id="formulario">
          <SignupForm />
          <noscript>
            <p className="nojs-form">Este formulário monta a mensagem no seu WhatsApp e precisa de JavaScript.
              Sem ele, fale direto com a equipe no <a href={club.whatsapp}>{club.whatsappLabel}</a>.</p>
          </noscript>
        </div>
      </div>
    </main>

    <footer className="site-footer section-shell">
      <Link className="brand" href="/" aria-label="Thadeu Melo Team, voltar para o site"><Wordmark /></Link>
      <span>Clube de corrida<br />Aracaju, Sergipe</span>
      <a href={club.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp {club.whatsappLabel}<Arrow diagonal /></a>
      <a href={club.instagram} target="_blank" rel="noopener noreferrer">@thadeumeloteam<Arrow diagonal /></a>
      <Link href="/">Voltar ao site ↑</Link>
    </footer>
  </>;
}
