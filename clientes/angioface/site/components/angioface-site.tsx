"use client";

import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useEffect, useState } from "react";

const whatsapp = "https://wa.me/5579991570017?text=Olá%2C%20gostaria%20de%20agendar%20uma%20consulta%20na%20Angioface.";

const cases = {
  harmonizacao: {
    label: "Harmonização facial",
    eyebrow: "Naturalidade em cada detalhe",
    description: "Planejamento facial que respeita proporções, identidade e cada fase do envelhecimento.",
    items: [
      { src: "/images/harmonizacao-01.jpeg", title: "Contorno e perfil facial" },
      { src: "/images/harmonizacao-02.jpeg", title: "Rejuvenescimento facial" },
      { src: "/images/harmonizacao-03.jpeg", title: "Harmonia e expressão" },
    ],
  },
  angiologia: {
    label: "Angiologia",
    eyebrow: "Leveza, saúde e bem-estar",
    description: "Protocolos modernos para o cuidado de varizes, com avaliação precisa e tecnologia avançada.",
    items: [
      { src: "/images/angiologia-01.jpeg", title: "Tratamento vascular" },
      { src: "/images/angiologia-02.jpeg", title: "Cuidado de varizes" },
      { src: "/images/angiologia-03.jpeg", title: "Saúde e bem-estar" },
    ],
  },
};

type CaseCategory = keyof typeof cases;

function VascularLineArt() {
  return (
    <svg className="care-illustration" viewBox="0 0 520 620" aria-hidden="true">
      <path d="M258 32v556M258 135c-60-3-98-38-113-98M258 205c75-1 121-47 133-119M258 275c-70 0-116-36-151-88M258 350c83 0 132-44 164-103M258 421c-66 2-109 42-139 103M258 488c72-2 112 34 144 91" />
      <path className="care-illustration__soft" d="M194 98c-3 54 16 90 64 107M344 147c-38 32-49 71-37 118M169 308c42 18 66 48 69 91M350 387c-34 26-46 64-35 108" />
      <circle cx="145" cy="37" r="7" /><circle cx="391" cy="86" r="7" /><circle cx="107" cy="187" r="7" /><circle cx="422" cy="247" r="7" /><circle cx="119" cy="524" r="7" /><circle cx="402" cy="579" r="7" />
    </svg>
  );
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg className={down ? "arrow arrow--down" : "arrow"} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

function BeforeAfterGallery() {
  const [category, setCategory] = useState<CaseCategory>("harmonizacao");
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState(50);
  const current = cases[category];
  const activeCase = current.items[active];
  const comparisonStyle = {
    "--position": `${position}%`,
    "--case-image": `url(${activeCase.src})`,
  } as CSSProperties;

  function changeCategory(next: CaseCategory) {
    setCategory(next);
    setActive(0);
    setPosition(50);
  }

  return (
    <section className="results section-pad" id="antes-e-depois">
      <div className="container">
        <div className="section-heading section-heading--light" data-reveal>
          <div>
            <span className="eyebrow eyebrow--gold">Antes e depois</span>
            <h2>Resultados que preservam a sua essência.</h2>
          </div>
          <p>Arraste o controle para comparar cada resultado e navegue pelas categorias.</p>
        </div>

        <div className="result-tabs" role="tablist" aria-label="Categorias de resultados" data-reveal>
          {(Object.keys(cases) as CaseCategory[]).map((key) => (
            <button
              key={key}
              className={category === key ? "result-tab is-active" : "result-tab"}
              onClick={() => changeCategory(key)}
              role="tab"
              aria-selected={category === key}
            >
              <span>{key === "harmonizacao" ? "01" : "02"}</span>
              {cases[key].label}
            </button>
          ))}
        </div>

        <div className="result-stage" data-reveal>
          <div className="comparison" style={comparisonStyle}>
            <div className="comparison__image comparison__before" />
            <div className="comparison__image comparison__after" />
            <span className="comparison__tag comparison__tag--before">Antes</span>
            <span className="comparison__tag comparison__tag--after">Depois</span>
            <div className="comparison__handle" aria-hidden="true"><span>↔</span></div>
            <input
              aria-label="Comparar imagem de antes e depois"
              type="range"
              min="8"
              max="92"
              value={position}
              onChange={(event) => setPosition(Number(event.target.value))}
            />
          </div>

          <aside className="result-copy">
            <span className="eyebrow eyebrow--gold">{current.eyebrow}</span>
            <h3>{activeCase.title}</h3>
            <p>{current.description}</p>
            <div className="result-thumbs" aria-label="Selecionar outro caso">
              {current.items.map((item, index) => (
                <button
                  key={item.src}
                  className={active === index ? "result-thumb is-active" : "result-thumb"}
                  onClick={() => { setActive(index); setPosition(50); }}
                  aria-label={`Ver caso: ${item.title}`}
                >
                  <Image src={item.src} alt="" fill sizes="92px" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
            <a className="text-link text-link--light" href={whatsapp} target="_blank" rel="noreferrer">
              Conversar sobre este tratamento <Arrow />
            </a>
            <small>Registros clínicos publicados pela Angioface. Resultados individuais podem variar.</small>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function AngiofaceSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    items.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${(index % 3) * 70}ms`);
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setHeaderScrolled(y > 36);
      setScrollProgress(max > 0 ? Math.min(y / max, 1) : 0);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = galleryOpen || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [galleryOpen, menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className={headerScrolled ? "site-header is-scrolled" : "site-header"}>
        <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />
        <div className="header-shell">
          <a href="#inicio" className="brand" aria-label="Angioface - início">
            <Image src="/images/logo-angioface.png" alt="Angioface" width={126} height={108} priority />
          </a>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <a href="#inicio">Início</a>
            <a href="#quem-somos">Quem Somos</a>
            <a href="#tratamentos">Tratamentos</a>
            <a href="#antes-e-depois">Antes e Depois</a>
            <Link href="/politica-de-privacidade">Política de Privacidade</Link>
          </nav>
          <a className="header-cta" href={whatsapp} target="_blank" rel="noreferrer">Agendar consulta <Arrow /></a>
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu" aria-expanded={menuOpen}>
            <span /><span />
          </button>
        </div>
      </header>

      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"} aria-hidden={!menuOpen}>
        <div className="mobile-menu__top">
          <span>Menu</span>
          <button onClick={closeMenu} aria-label="Fechar menu">×</button>
        </div>
        <nav>
          <a onClick={closeMenu} href="#inicio">Início <span>01</span></a>
          <a onClick={closeMenu} href="#quem-somos">Quem Somos <span>02</span></a>
          <a onClick={closeMenu} href="#tratamentos">Tratamentos <span>03</span></a>
          <a onClick={closeMenu} href="#antes-e-depois">Antes e Depois <span>04</span></a>
          <Link onClick={closeMenu} href="/politica-de-privacidade">Política de Privacidade <span>05</span></Link>
        </nav>
        <a href={whatsapp} target="_blank" rel="noreferrer">Agendar pelo WhatsApp <Arrow /></a>
      </div>

      <section className="hero" id="inicio">
        <div className="hero-grain" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow--gold hero-eyebrow">Clínica Médica e Odontológica · Aracaju</span>
            <h1>Cuidado preciso.<br /><em>Beleza natural.</em></h1>
            <p>Medicina, tecnologia e atenção individualizada para cuidar da sua saúde e valorizar o que torna você única.</p>
            <div className="hero-actions">
              <a className="button button--gold" href={whatsapp} target="_blank" rel="noreferrer">Agendar avaliação <Arrow /></a>
              <a className="button button--ghost" href="#tratamentos">Conhecer tratamentos <Arrow down /></a>
            </div>
            <div className="hero-proof">
              <div><strong>20+</strong><span>anos de experiência</span></div>
              <div><strong>2</strong><span>especialidades integradas</span></div>
              <div><strong>01</strong><span>cuidado sob medida</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="Dra. Jamilli Saliba e Dr. Fábio Guilherme">
            <div className="hero-visual__halo" />
            <Image src="/images/equipe-recorte.png" alt="Dra. Jamilli Saliba e Dr. Fábio Guilherme" fill priority sizes="(max-width: 900px) 100vw, 48vw" />
            <div className="hero-visual__card">
              <span>Excelência integrada</span>
              <strong>Face &amp; saúde vascular</strong>
            </div>
          </div>
        </div>
        <a className="hero-scroll" href="#quem-somos" aria-label="Rolar para quem somos"><span>Explore</span><i /></a>
      </section>

      <section className="about section-pad" id="quem-somos">
        <div className="container">
          <div className="about-intro" data-reveal>
            <div>
              <span className="eyebrow">A essência Angioface</span>
              <h2>Um encontro entre<br /><em>face</em> e <em>fluxo.</em></h2>
            </div>
            <div className="about-intro__copy">
              <p className="lead">Angioface: uma clínica que une excelência médica, tecnologia e conforto para os seus tratamentos.</p>
              <p>A estética facial e a saúde vascular convivem no mesmo espaço, com decisões cuidadosas, atendimento individualizado e respeito à sua história.</p>
            </div>
          </div>

          <div className="duality" data-reveal>
            <div className="duality__side duality__side--face">
              <span>Forma, expressão, identidade</span>
              <strong>FACE</strong>
              <p>Harmonização conduzida para revelar equilíbrio sem apagar características.</p>
            </div>
            <div className="duality__center">
              <span>ANGIO</span><i /><span>FACE</span>
            </div>
            <div className="duality__side duality__side--flow">
              <span>Circulação, leveza, movimento</span>
              <strong>FLUXO</strong>
              <p>Saúde vascular tratada com precisão para devolver conforto à rotina.</p>
            </div>
          </div>

          <p className="about-signature" data-reveal>Do rosto às pernas, cada tratamento começa pela mesma pergunta: <em>o que você precisa sentir ao se olhar e ao se movimentar?</em></p>
        </div>
      </section>

      <section className="treatments section-pad" id="tratamentos">
        <div className="container">
          <div className="care-heading" data-reveal>
            <span className="eyebrow">Tratamentos Angioface</span>
            <h2>Escolha o cuidado que trouxe você até aqui.</h2>
          </div>

          <div className="care-paths">
            <article className="care-path care-path--face" data-reveal>
              <div className="care-path__art care-path__art--generated">
                <Image src="/images/harmonizacao-arte-v4-clara.png" alt="Ilustração editorial sobre harmonia e proporção facial" fill sizes="(max-width: 780px) 100vw, 40vw" />
              </div>
              <div className="care-path__content">
                <span className="care-path__label">Para a face · com Dra. Jamilli</span>
                <h3>Harmonização<br />facial</h3>
                <p>Melhoramos a sua autoestima promovendo o rejuvenescimento facial através de procedimentos de ponta.</p>
                <div className="care-path__procedures">
                  <span>Botox</span><span>Preenchimentos</span><span>Bioestimuladores</span><span>Fios</span>
                </div>
                <a className="care-path__link" href={whatsapp} target="_blank" rel="noreferrer">Quero cuidar da minha face <Arrow /></a>
              </div>
            </article>

            <article className="care-path care-path--vascular" data-reveal>
              <div className="care-path__content">
                <span className="care-path__label">Para a circulação · com Dr. Fábio</span>
                <h3>Angiologia e<br />Cirurgia Vascular</h3>
                <p>Tratamento moderno de varizes com o uso de tecnologias avançadas como Laser Transdérmico.</p>
                <div className="care-path__procedures">
                  <span>Laser transdérmico</span><span>Doppler</span><span>Resfriamento de pele</span><span>Óxido nitroso</span>
                </div>
                <a className="care-path__link" href={whatsapp} target="_blank" rel="noreferrer">Quero cuidar da minha circulação <Arrow /></a>
              </div>
              <div className="care-path__art"><VascularLineArt /><span>Mais do que tratar varizes.<br />Devolver leveza ao movimento.</span></div>
            </article>
          </div>
        </div>
      </section>

      <section className="professionals section-pad" id="profissionais">
        <div className="container">
          <div className="section-heading" data-reveal>
            <div><span className="eyebrow">Profissionais</span><h2>Experiência que inspira confiança.</h2></div>
            <p>Especialistas que unem repertório técnico, precisão e uma forma humana de cuidar.</p>
          </div>
          <div className="professional-grid">
            <article className="professional" data-reveal>
              <div className="professional__image"><Image src="/images/dra-jamilli.jpeg" alt="Dra. Jamilli Saliba" fill sizes="(max-width: 760px) 100vw, 45vw" /></div>
              <div className="professional__copy">
                <span>Harmonização Facial</span><h3>Dra. Jamilli Saliba</h3>
                <p>Cirurgiã-Dentista, Mestre em Clínica Odontológica e Especialista em Harmonização Facial.</p>
                <a href={whatsapp} target="_blank" rel="noreferrer">Agendar com a Dra. Jamilli <Arrow /></a>
              </div>
            </article>
            <article className="professional professional--offset" data-reveal>
              <div className="professional__image"><Image src="/images/dr-fabio.jpeg" alt="Dr. Fábio Guilherme" fill sizes="(max-width: 760px) 100vw, 45vw" /></div>
              <div className="professional__copy">
                <span>Cirurgia Vascular</span><h3>Dr. Fábio Guilherme</h3>
                <p>Médico, Especialista em Cirurgia Vascular. CRM-SE 3049 · RQE 2335.</p>
                <a href={whatsapp} target="_blank" rel="noreferrer">Agendar com o Dr. Fábio <Arrow /></a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="spaces section-pad" id="espaco">
        <div className="container">
          <div className="space-intro" data-reveal>
            <div><span className="eyebrow">Conheça mais</span><h2>Um espaço pensado para desacelerar.</h2></div>
            <p>Conforto, privacidade e tecnologia em um ambiente que acolhe desde o primeiro contato.</p>
          </div>
          <div className="space-mosaic" data-reveal>
            <button className="space-photo space-photo--main" onClick={() => setGalleryOpen(true)}>
              <Image src="/images/clinica-recepcao.jpeg" alt="Recepção da clínica Angioface" fill sizes="(max-width: 760px) 100vw, 70vw" />
              <span><small>01</small> Recepção</span>
            </button>
            <button className="space-photo" onClick={() => setGalleryOpen(true)}>
              <Image src="/images/clinica-conforto.jpeg" alt="Ambiente acolhedor da clínica Angioface" fill sizes="(max-width: 760px) 100vw, 30vw" />
              <span><small>02</small> Conforto</span>
            </button>
            <button className="space-photo space-photo--text" onClick={() => setGalleryOpen(true)}>
              <span className="space-photo__count">+ ambientes</span>
              <strong>Conheça a experiência Angioface</strong>
              <i><Arrow /></i>
            </button>
          </div>
        </div>
      </section>

      <BeforeAfterGallery />

      <section className="contact section-pad" id="contato">
        <div className="container contact-grid">
          <div className="contact-copy" data-reveal>
            <span className="eyebrow eyebrow--gold">Sua jornada começa aqui</span>
            <h2>Vamos cuidar de você?</h2>
            <p>Fale com a nossa equipe e agende uma avaliação individualizada.</p>
            <a className="button button--gold" href={whatsapp} target="_blank" rel="noreferrer">Agendar pelo WhatsApp <Arrow /></a>
          </div>
          <div className="contact-info" data-reveal>
            <div><span>Endereço</span><p>Av. Dr. José Machado de Souza, 120, Sala 615<br />Horizonte Jardins Offices · Aracaju/SE</p><a href="https://maps.google.com/?q=Av.+Dr.+José+Machado+de+Souza,+120,+Aracaju,+SE" target="_blank" rel="noreferrer">Como chegar ↗</a></div>
            <div><span>Contato</span><p>(79) 99157-0017<br />(79) 99892-0412</p></div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-top">
          <div className="footer-brand"><Image src="/images/logo-angioface.png" alt="Angioface" width={150} height={128} /><p>Saúde e estética em equilíbrio.</p></div>
          <nav><span>Navegue</span><a href="#quem-somos">Quem Somos</a><a href="#tratamentos">Tratamentos</a><a href="#profissionais">Profissionais</a><a href="#antes-e-depois">Antes e Depois</a></nav>
          <nav><span>Contato</span><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><a href="tel:+5579991570017">(79) 99157-0017</a><a href="tel:+5579998920412">(79) 99892-0412</a><Link href="/politica-de-privacidade">Política de Privacidade</Link></nav>
        </div>
        <div className="container footer-bottom"><p>Copyright © 2026 — Angioface - Clínica Médica e Odontológica. Todos os direitos reservados.</p><a href="#inicio">Voltar ao topo ↑</a></div>
      </footer>

      <a className="floating-whatsapp" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Agendar consulta pelo WhatsApp">
        <span>Agendar consulta</span><b>↗</b>
      </a>

      <div className={galleryOpen ? "gallery-modal is-open" : "gallery-modal"} role="dialog" aria-modal="true" aria-label="Galeria de ambientes">
        <button className="gallery-modal__close" onClick={() => setGalleryOpen(false)} aria-label="Fechar galeria">×</button>
        <div className="gallery-modal__content">
          <div className="gallery-modal__heading">
            <div><span className="eyebrow eyebrow--gold">Angioface por dentro</span><h2>Chegue e sinta-se<br />bem cuidado.</h2></div>
            <p>Uma visita guiada por um espaço onde privacidade, conforto e tecnologia fazem parte do tratamento.</p>
          </div>
          <div className="gallery-experience">
            <figure className="gallery-experience__main">
              <Image src="/images/clinica-recepcao.jpeg" alt="Recepção da clínica Angioface" fill sizes="(max-width: 780px) 100vw, 68vw" />
              <figcaption><span>Recepção</span><small>O primeiro acolhimento</small></figcaption>
            </figure>
            <div className="gallery-experience__side">
              <figure>
                <Image src="/images/clinica-conforto.jpeg" alt="Ambiente de espera da clínica Angioface" fill sizes="(max-width: 780px) 100vw, 32vw" />
                <figcaption><span>Ambiente de espera</span><small>Conforto e privacidade</small></figcaption>
              </figure>
              <div className="gallery-experience__note">
                <span>Horizonte Jardins Offices</span>
                <p>Um ambiente reservado em uma das localizações mais convenientes de Aracaju.</p>
                <a href="https://maps.google.com/?q=Av.+Dr.+José+Machado+de+Souza,+120,+Aracaju,+SE" target="_blank" rel="noreferrer">Ver localização <Arrow /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
