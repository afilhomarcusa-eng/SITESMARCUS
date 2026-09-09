import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Arrow, Track, Wordmark } from "@/components/icons";
import { Schedule } from "@/components/schedule";
import { SceneMotion } from "@/components/scene-motion";
import { Frame } from "@/components/photo";
import { club, faqs, sources, photos, stats, timeline, steps, locations } from "@/lib/content";

const schema = { "@context": "https://schema.org", "@type": "SportsOrganization", name: club.name, sport: "Corrida de rua", description: "Clube de corrida em Aracaju, Sergipe.", telephone: "+" + club.whatsappNumber, sameAs: [club.instagram, club.whatsapp], location: { "@type": "Place", name: "Aracaju", address: { "@type": "PostalAddress", addressLocality: "Aracaju", addressRegion: "SE", addressCountry: "BR" } } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };

export default function Home() {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

    {/* Cortina de abertura. Começa dentro de uma raia, a câmera recua e as raias
        param exatamente onde as do herói estão, então o corte não aparece. */}
    <div className="intro" aria-hidden="true">
      <span className="intro-lane" />
      <Track className="intro-track" />
      <div className="intro-mark"><Wordmark /></div>
      <span className="intro-line">O próximo passo é com o time.</span>
      <span className="intro-place">ARACAJU / SERGIPE</span>
      <span className="intro-sweep" />
    </div>

    <Navigation />

    <main id="conteudo">
      {/* A primeira dobra era uma cena em planos com Z: o titulo em duas
          palavras gigantes, a foto num porta-retrato girado no meio delas e um
          carimbo por cima. Bonito de perto, confuso de longe, e a foto tinha de
          ser pequena para nao esticar. Agora sao duas colunas: a esquerda diz o
          que e e o que fazer, a direita e a corrida em altura cheia, e a faixa
          de baixo ja entrega onde o time treina. */}
      <section className="hero" id="inicio" aria-labelledby="hero-title">
        <div className="hero-panel">
          <Track className="hero-lanes" />
          <span className="eyebrow"><i className="status-dot" />Clube de corrida em Aracaju</span>
          <h1 id="hero-title">Bora correr.<br /><em>Tem gente te esperando.</em></h1>
          <p className="hero-lead">Três pontos de treino na cidade, cinco dias por semana. Você conta como está a sua rotina e a equipe indica onde começar.</p>
          <div className="hero-actions">
            <Link className="button button-yellow" href="/cadastro">Fazer meu cadastro<Arrow diagonal /></Link>
            <a className="hero-alt" href={club.whatsapp} target="_blank" rel="noopener noreferrer">ou falar direto no WhatsApp<Arrow diagonal /></a>
          </div>
        </div>

        <figure className="hero-media">
          <Image src={photos.orla.src} alt={photos.orla.alt} width={photos.orla.w} height={photos.orla.h} priority quality={90} sizes="(max-width: 900px) 100vw, min(42vw, 800px)" />
          <figcaption>{photos.orla.caption}</figcaption>
        </figure>

        {/* A dobra termina com a agenda em vez de uma seta de rolagem: quem
            chega procurando onde correr ja sai daqui com os tres pontos. */}
        <ul className="hero-facts">
          {locations.map(item => <li key={item.id}>
            <a href="#treinos">
              <div><strong>{item.name}</strong><span>{item.days.join(" / ")}</span></div>
              <Arrow diagonal />
            </a>
          </li>)}
        </ul>
      </section>

      <div className="running-strip" aria-hidden="true"><div className="strip-track">{[0, 1].map(copy => <div className="strip-run" key={copy}>{["A cidade é a nossa pista", "Thadeu Melo Team", "Segunda começa cedo", "Sábado é na orla"].map(word => <span key={word}>{word}<i className="strip-arrow">↗</i></span>)}</div>)}</div></div>

      {/* 01. A coluna da esquerda tinha meia tela de vazio entre a numeração e a
          legenda, e as duas fotos da seção eram recortes da mesma foto. Ficou
          uma só, vertical, do tamanho da coluna: o vazio é ela agora. */}
      <section className="club-section section-shell" id="clube" aria-labelledby="club-title">
        <div className="section-side">
          <span className="eyebrow">01 / O clube</span>
          <Frame photo={photos.vertical} className="club-aside" reveal="frame" sizes="(max-width: 760px) 62vw, (max-width: 1100px) 24vw, 330px" />
          <span className="side-caption">Tem corrida.<br />E tem encontro.</span>
        </div>
        <div className="club-content">
          <h2 id="club-title" data-reveal="mask">Cada um tem<br />um ritmo.<br /><span>O time é de todos.</span></h2>
          <div className="club-copy" data-reveal="stagger"><span className="small-cross" aria-hidden="true">+</span><div className="club-lead"><p>Tem o treino cedo. Tem a conversa depois. Tem aquele dia em que a companhia faz você sair de casa.</p><p>A Thadeu Melo Team reúne corredores em Aracaju. Da Sementeira à orla, os encontros colocam a corrida no meio da vida.</p></div><a className="text-link" href="#treinos">Ache seu ponto de partida<Arrow diagonal /></a></div>
        </div>
      </section>

      <section className="training-section section-shell" id="treinos" aria-labelledby="training-title">
        <div className="training-heading">
          <div className="training-head"><span className="eyebrow">02 / Onde treinamos</span><h2 id="training-title" data-reveal="mask">A gente se vê<br /><span>na pista.</span></h2></div>
          <Frame photo={photos.dupla} className="training-shot" reveal="frame" sizes="(max-width: 760px) 66vw, (max-width: 1100px) 30vw, 350px" />
          <p className="training-note" data-reveal="stagger"><span>Escolha o local que combina com a sua rotina.</span><span>O próximo passo é aparecer.</span></p>
        </div>
        <Schedule />
      </section>

      {/* 03. Era uma cena com câmera: uma foto crescendo por 168vh de rolagem,
          que em tela larga virava um campo de petróleo vazio com um retrato
          pequeno no canto. Virou a seção mais cheia da página, e o que enche
          ela é informação com fonte: a agenda vira número, a história do time
          vira linha do tempo com link, e a entrada vira três passos. */}
      <section className="team-section" id="equipe" aria-labelledby="story-title">
        <div className="team-head section-shell">
          <span className="eyebrow">03 / Feito de gente</span>
          <h2 id="story-title" data-reveal="mask">O melhor da corrida<br />também está <em>ao lado.</em></h2>
          <p className="team-lead">Um grupo que se encontra cedo, corre junto e continua depois do treino. O clube tem ponto marcado em três lugares de Aracaju, e o seu primeiro dia começa com uma conversa.</p>
        </div>

        <ul className="team-numbers" data-reveal="stagger">
          {stats.map(stat => <li key={stat.label}>
            <strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.note}</small>
          </li>)}
        </ul>

        <div className="team-body section-shell">
          <ol className="team-line" data-reveal="stagger">
            {timeline.map(item => <li key={item.when}>
              <span className="team-when">{item.when}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.source ? <a className="text-link" href={item.source.href} target="_blank" rel="noopener noreferrer">{item.source.label}<Arrow diagonal /></a> : null}
              </div>
            </li>)}
          </ol>
          <div className="team-art">
            <Frame photo={photos.grupo} className="team-shot" reveal="frame" sizes="(max-width: 760px) 92vw, (max-width: 1100px) 52vw, 44vw" />
            <div className="team-aside">
              <Frame photo={photos.equipe} className="team-small" reveal="frame" sizes="(max-width: 760px) 44vw, 210px" />
              <div className="team-credit">
                <p>Uma foto do arquivo do clube, o resto das provas de Aracaju.</p>
                <span>Equipe: Indianara Moura / Divulgação. Orla: Atlet. Pista: Desafio Tiradentes.</span>
                <a className="text-link" href={sources.atlet.href} target="_blank" rel="noopener noreferrer">{sources.atlet.label}<Arrow diagonal /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="team-steps section-shell">
          <div className="steps-head">
            <span className="eyebrow">Como começa</span>
            <h3>Três passos, e o primeiro é seu.</h3>
          </div>
          <ol className="steps-list" data-reveal="stagger">
            {steps.map((step, index) => <li key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <h4>{step.title}</h4>
              <p>{step.text}</p>
            </li>)}
          </ol>
          <div className="steps-cta">
            <Link className="button button-yellow" href="/cadastro">Fazer meu cadastro<Arrow diagonal /></Link>
            <a className="text-link" href={club.whatsapp} target="_blank" rel="noopener noreferrer">Prefiro falar no WhatsApp<Arrow diagonal /></a>
          </div>
        </div>

        <div className="social-invite section-shell"><span>O time continua em movimento.</span><a href={club.instagram} target="_blank" rel="noopener noreferrer">Acompanhe o dia a dia no Instagram<Arrow diagonal /></a></div>
      </section>

      <section className="faq-section section-shell" id="duvidas" aria-labelledby="faq-title">
        <div className="faq-side"><span className="eyebrow">04 / Antes do primeiro treino</span><h2 id="faq-title" data-reveal="mask">Tudo começa<br />com uma<br /><span>boa conversa.</span></h2><Frame photo={photos.solo} className="faq-shot" reveal="frame" sizes="(max-width: 760px) 58vw, 26vw" /></div>
        <div className="faq-list" data-reveal="stagger">{faqs.map((faq, index) => <details key={faq.question}><summary><span className="faq-number">0{index + 1}</span><span>{faq.question}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div>
      </section>

      {/* Fim da volta: as mesmas raias da cortina voltam a se fechar. */}
      <section className="final-section" id="contato" data-reveal="lap" aria-labelledby="final-title">
        <Track className="final-track" />
        <div className="final-inner section-shell">
          <span className="eyebrow">Sua próxima largada</span>
          <div className="final-layout"><h2 id="final-title" data-reveal="mask">A rua chama.<br /><span>O time espera.</span></h2><div className="final-call"><span className="final-number" aria-hidden="true">WhatsApp<br />{club.whatsappLabel}</span><a className="final-arrow" href={club.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={"Conversar com a Thadeu Melo Team no WhatsApp, " + club.whatsappLabel}><Arrow diagonal /></a></div></div>
          <div className="final-bottom"><p>Conte pra gente onde você quer chegar.<br />Vamos conversar sobre o seu primeiro treino.</p><a className="button button-dark" href={club.whatsapp} target="_blank" rel="noopener noreferrer">Falar no WhatsApp<span className="button-number">{club.whatsappLabel}</span><Arrow diagonal /></a></div>
        </div>
      </section>
    </main>

    <footer className="site-footer section-shell"><a className="brand" href="#inicio" aria-label="Thadeu Melo Team, voltar ao início"><Wordmark /></a><span>Clube de corrida<br />Aracaju, Sergipe</span><a href={club.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp {club.whatsappLabel}<Arrow diagonal /></a><a href={club.instagram} target="_blank" rel="noopener noreferrer">@thadeumeloteam<Arrow diagonal /></a><a href="#inicio">Voltar ao topo ↑</a></footer>
    <SceneMotion />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
  </>;
}
