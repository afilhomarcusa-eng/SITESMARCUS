"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const phone = "5579999538948";
const whatsapp = `https://wa.me/${phone}`;
const instagram = "https://www.instagram.com/pousadansaparecida/";
const maps = "https://www.google.com/maps/place/Pousada+Nossa+Senhora+Aparecida/@-10.6871599,-37.43191,17z";

const rooms = [
  { name: "Casal", label: "Para dois", image: "/images/quarto-individual.jpeg", description: "Um ambiente reservado e funcional para descansar com tranquilidade.", capacity: "Até 2 hóspedes" },
  { name: "Duplo", label: "Duas camas", image: "/images/quarto-duplo.jpeg", description: "Praticidade para colegas de trabalho, amigos ou familiares em passagem pela cidade.", capacity: "Até 2 hóspedes" },
  { name: "Triplo", label: "Mais espaço", image: "/images/quarto-triplo.jpeg", description: "Acomodação versátil para pequenos grupos, com conforto para todos.", capacity: "Até 3 hóspedes" },
  { name: "Família", label: "Estadia em grupo", image: "/images/quarto-familia.jpeg", description: "Uma opção acolhedora para compartilhar a viagem sem abrir mão da comodidade.", capacity: "Consulte opções" },
];

/*
 * Cada item diz onde a comodidade fica. Antes os seis repetiam "Incluso na
 * experiencia", o que ocupava uma linha em cada cartao para nao informar nada:
 * seis vezes a mesma frase le como ruido, nao como selo.
 */
const amenities = [
  { icon: "coffee" as const, where: "Incluso na diária", title: "Café da manhã", text: "Incluso, variado e com aquele sabor caseiro." },
  { icon: "wifi" as const, where: "Áreas da pousada", title: "Wi-Fi", text: "Conexão disponível nas áreas da pousada." },
  { icon: "air" as const, where: "Em todos os quartos", title: "Ar-condicionado", text: "Mais conforto para descansar em qualquer época." },
  { icon: "car" as const, where: "No local", title: "Estacionamento", text: "Comodidade para quem chega de carro." },
];

function Arrow() {
  return <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function Brand() {
  return (
    <span className="brand" aria-label="Pousada Nossa Senhora Aparecida">
      <svg viewBox="0 0 64 70" aria-hidden="true">
        <path className="brand__building" d="M18 53V17c0-1.1.9-2 2-2h24c1.1 0 2 .9 2 2v36M11 53h42M24 23h16M24 32h16M24 41h16M28 53v-7h8v7" />
        <path className="brand__green" d="M15 58c11-3 24-3 34 0" />
        <path className="brand__red" d="M20 63c8-2 17-2 24 0" />
      </svg>
      <span><strong>Pousada</strong><small>Nossa Senhora Aparecida</small></span>
    </span>
  );
}

function Icon({ name }: { name: "coffee" | "wifi" | "air" | "car" | "pin" }) {
  const paths = {
    coffee: <><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z"/><path d="M16 11h2a2 2 0 1 1 0 4h-2M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2"/></>,
    wifi: <><path d="M4 10a12 12 0 0 1 16 0M7 14a8 8 0 0 1 10 0M10 18a3 3 0 0 1 4 0"/><circle cx="12" cy="21" r="1"/></>,
    air: <><rect x="3" y="5" width="18" height="8" rx="1.6"/><path d="M6.5 10.2h11"/><path d="M7.5 16.5c1.6 0 1.6 2 3.2 2M13.3 16.5c1.6 0 1.6 2 3.2 2"/></>,
    car: <><path d="M3.5 16.5v-4l1.8-4.6c.2-.6.8-.9 1.4-.9h10.6c.6 0 1.2.3 1.4.9l1.8 4.6v4"/><path d="M3.5 12.5h17"/><path d="M3.5 16.5h3v2h-3zM17.5 16.5h3v2h-3z"/><path d="M6.8 14.6h1.4M15.8 14.6h1.4"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  };
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export function PousadaSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("2 hóspedes");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function reserve(event: FormEvent) {
    event.preventDefault();
    const data = (iso: string) => {
      if (!iso) return "a definir";
      const [ano, mes, dia] = iso.split("-");
      return `${dia}/${mes}/${ano}`;
    };
    const message = [
      "Olá! Gostaria de consultar uma hospedagem na Pousada Nossa Senhora Aparecida.",
      "",
      `Check-in: ${data(arrival)}`,
      `Check-out: ${data(departure)}`,
      `Hóspedes: ${guests}`,
    ].join("\n");
    window.open(`${whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
        <div className="header-inner">
          <a href="#inicio"><Brand /></a>
          <nav className="desktop-nav"><a href="#pousada">A pousada</a><a href="#acomodacoes">Acomodações</a><a href="#experiencia">Experiência</a><a href="#localizacao">Localização</a></nav>
          <a className="header-cta" href="#reservar">Consultar estadia <Arrow /></a>
          <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><span/><span/></button>
        </div>
      </header>

      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"} aria-hidden={!menuOpen}>
        <div><Brand /><button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">×</button></div>
        <nav>{[["A pousada","pousada"],["Acomodações","acomodacoes"],["Experiência","experiencia"],["Localização","localizacao"],["Reservar","reservar"]].map(([label,id], index) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}</a>)}</nav>
      </div>

      <section className="hero" id="inicio">
        <div className="hero-grid">
          <div className="hero-copy" data-reveal>
            <span className="eyebrow eyebrow--light">Hospedagem no coração de Itabaiana</span>
            <h1>Chegue.<br/><em>Descanse.</em><br/>Sinta-se em casa.</h1>
            <p>Conforto, localização e um atendimento que acolhe. Para quem vem a trabalho, a lazer ou para viver a cidade.</p>
            <div className="hero-actions"><a className="button button--green" href="#reservar">Consultar disponibilidade <Arrow /></a><a className="button button--line" href="#acomodacoes">Conhecer acomodações</a></div>
            <div className="hero-rating"><strong>4,5</strong><span>★★★★★<small>Mais de 450 avaliações públicas</small></span></div>
          </div>
          <div className="hero-visual" data-reveal>
            <div className="hero-photo hero-photo--main"><Image src="/images/fachada-principal.jpeg" alt="Fachada da Pousada Nossa Senhora Aparecida em Itabaiana" fill priority sizes="(max-width: 800px) 100vw, 50vw" /></div>
            
            
          </div>
        </div>
        <a href="#pousada" className="hero-scroll">Explore a pousada <span>↓</span></a>
      </section>

      <section className="intro section" id="pousada">
        <div className="container intro-grid">
          <div data-reveal><span className="eyebrow">Nossa hospitalidade</span><h2>Uma estadia simples no melhor sentido.</h2></div>
          <div className="intro-copy" data-reveal><p className="intro-lead">Há mais de uma década, recebemos quem chega a Itabaiana com atenção, praticidade e aquele cuidado que faz uma hospedagem virar descanso de verdade.</p><p>No centro da cidade e perto de tudo, somos um ponto de apoio confortável para representantes comerciais, estudantes, famílias, turistas e visitantes dos grandes eventos locais.</p><a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">Falar com a recepção <Arrow /></a></div>
        </div>
        <div className="container facts" data-reveal><div><strong>24h</strong><span>Recepção disponível</span></div><div><strong>100m</strong><span>Do centro da cidade</span></div><div><strong>850m</strong><span>Da universidade</span></div><div><strong>2012</strong><span>Recebendo em Itabaiana</span></div></div>
      </section>

      <section className="rooms section" id="acomodacoes">
        <div className="container">
          <div className="section-heading" data-reveal><div><span className="eyebrow eyebrow--light">Acomodações</span><h2>O quarto certo para cada passagem.</h2></div><p>Ambientes funcionais com ar-condicionado, TV, frigobar e banheiro privativo, em quatro formatos para o tamanho da sua viagem.</p></div>
          {/*
            As quatro acomodacoes abertas ao mesmo tempo. Antes eram abas: tres
            ficavam escondidas atras da que estava aberta, e o cartao de texto
            pousava por cima da foto, tapando justamente a cama. Aqui cada
            quarto tem a sua foto inteira e o texto embaixo dela.
          */}
          <ul className="room-list" data-reveal>
            {rooms.map((item, index) => (
              <li className="room" key={item.name}>
                <a className="room__photo" href="#reservar" aria-label={`Consultar o quarto ${item.name}`}>
                  <Image src={item.image} alt={`Quarto ${item.name}`} fill sizes="(max-width: 800px) 86vw, 42vw" />
                  <em>0{index + 1}</em>
                </a>
                <div className="room__body">
                  <span>{item.label}</span>
                  <h3>Quarto {item.name}</h3>
                  <p>{item.description}</p>
                  <dl><dt>{item.capacity}</dt><dd>Ar-condicionado · TV · Frigobar</dd></dl>
                  <a href="#reservar">Consultar esta acomodação <Arrow /></a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="amenities section" id="experiencia">
        <div className="container">
          <div className="amenities-intro" data-reveal><span className="eyebrow">Na diária</span><h2>O que já está incluído.</h2><p>Nada aqui é cobrado à parte: o café da manhã e a vaga já vêm com a diária.</p></div>
          <div className="amenities-grid" data-reveal>
            {amenities.map(item => <article key={item.title}><Icon name={item.icon}/><span>{item.where}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="breakfast section">
        <div className="container breakfast-grid">
          <div className="breakfast-copy" data-reveal><span className="eyebrow eyebrow--light">Bom dia, Itabaiana</span><h2>Café preparado com capricho.</h2><p>Frutas, opções quentes e sabores da nossa mesa. É o que mais aparece nos comentários de quem se hospeda.</p><blockquote>“Café da manhã preparado com capricho e variedade, servido sempre com aquele toque caseiro.”</blockquote></div>
          <div className="breakfast-gallery" data-reveal><figure className="breakfast-gallery__main"><Image src="/images/cafe-frutas.jpeg" alt="Frutas servidas no café da manhã" fill sizes="(max-width: 800px) 100vw, 40vw"/></figure><figure><Image src="/images/cafe-buffet.jpeg" alt="Buffet de café da manhã da pousada" fill sizes="260px"/></figure><figure><Image src="/images/cafe-caseiro.jpeg" alt="Opções caseiras do café da manhã" fill sizes="260px"/></figure></div>
        </div>
      </section>

      <section className="reviews section">
        <div className="container">
          <div className="reviews-top" data-reveal><div><span className="eyebrow">Quem se hospeda conta</span><h2>O que dizem quem já dormiu aqui.</h2></div><div className="score"><strong>4,5</strong><span>★★★★★<small>Mais de 450 avaliações públicas</small></span></div></div>
          <div className="review-grid" data-reveal><blockquote><span>★★★★★</span><p>“A equipe foi sempre prestativa, simpática e pronta para ajudar, tornando o ambiente acolhedor e familiar.”</p><footer>Hóspede · avaliação pública</footer></blockquote><blockquote><span>★★★★★</span><p>“Quartos confortáveis, limpos e bem equipados. Café da manhã muito bom e uma ótima recepção.”</p><footer>Hóspede · avaliação pública</footer></blockquote><blockquote><span>★★★★★</span><p>“Localização ótima, atendimento excelente e um café da manhã incrível. Voltarei com certeza.”</p><footer>Hóspede · avaliação pública</footer></blockquote></div>
        </div>
      </section>

      <section className="location section" id="localizacao">
        <div className="container location-grid">
          <div className="location-copy" data-reveal><span className="eyebrow eyebrow--light">No centro de Itabaiana</span><h2>Perto de tudo o que trouxe você à cidade.</h2><p>Rua Campo do Brito, 344<br/>Centro · Itabaiana/SE</p><ul><li><Icon name="pin"/>Em frente à Praça de Eventos</li><li><Icon name="pin"/>Próxima ao Estádio Presidente Médici</li><li><Icon name="pin"/>A cerca de 850 m da universidade</li></ul><a className="button button--white" href={maps} target="_blank" rel="noreferrer">Traçar rota no Google Maps <Arrow /></a></div>
          <a className="location-photo" href={maps} target="_blank" rel="noreferrer" data-reveal><Image src="/images/fachada-lateral.jpeg" alt="Rua Campo do Brito, com a entrada da pousada" fill sizes="(max-width: 800px) 100vw, 50vw"/><span><Icon name="pin"/><strong>Você chegou</strong>Rua Campo do Brito, 344</span></a>
        </div>
      </section>

      <section className="booking section" id="reservar">
        <div className="container booking-grid">
          <div className="booking-copy" data-reveal><span className="eyebrow">Sua próxima estadia</span><h2>Conte quando você vem. A gente cuida do resto.</h2><p>Envie as informações pelo formulário e continue o atendimento diretamente com a recepção no WhatsApp.</p><div><a href="tel:+5579999538948">(79) 99953-8948</a><a href="mailto:pousadansa@gmail.com">pousadansa@gmail.com</a></div></div>
          <form className="booking-form" onSubmit={reserve} data-reveal><label><span>Check-in</span><input type="date" value={arrival} onChange={event => setArrival(event.target.value)}/></label><label><span>Check-out</span><input type="date" value={departure} onChange={event => setDeparture(event.target.value)}/></label><label className="booking-form__wide"><span>Hóspedes</span><select value={guests} onChange={event => setGuests(event.target.value)}><option>1 hóspede</option><option>2 hóspedes</option><option>3 hóspedes</option><option>4 hóspedes</option><option>5 ou mais hóspedes</option></select></label><button className="button button--green booking-form__wide" type="submit">Consultar pelo WhatsApp <Arrow /></button><small className="booking-form__wide">A consulta não confirma automaticamente a reserva.</small></form>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-top"><Brand/><div><span>Navegue</span><a href="#pousada">A pousada</a><a href="#acomodacoes">Acomodações</a><a href="#experiencia">Experiência</a><a href="#localizacao">Localização</a></div><div><span>Contato</span><a href={`tel:+${phone}`}>+55 79 99953-8948</a><a href="mailto:pousadansa@gmail.com">pousadansa@gmail.com</a><a href={instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div><div><span>Endereço</span><p>Rua Campo do Brito, 344<br/>Centro · Itabaiana/SE<br/>CEP 49500-109</p></div></div>
        <div className="container footer-bottom"><span>© 2026 Pousada Nossa Senhora Aparecida</span><Link href="/politica-de-privacidade">Política de Privacidade</Link></div>
      </footer>

      <a className="floating-whatsapp" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Falar com a pousada no WhatsApp"><span>WhatsApp</span><strong>↗</strong></a>
    </main>
  );
}
