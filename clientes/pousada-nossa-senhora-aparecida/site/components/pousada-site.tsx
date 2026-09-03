"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

const phone = "5579999538948";
const whatsapp = `https://wa.me/${phone}`;
const instagram = "https://www.instagram.com/pousadansaparecida/?theme=dark";
const maps = "https://www.google.com/maps/place/Pousada+Nossa+Senhora+Aparecida/@-10.6871599,-37.43191,17z";

const rooms = [
  { name: "Casal", label: "Para dois", image: "/images/quarto-casal.jpeg", description: "Um ambiente reservado e funcional para descansar com tranquilidade.", capacity: "Até 2 hóspedes", beds: "1 cama de casal" },
  { name: "Duplo", label: "Duas camas", image: "/images/quarto-duplo.jpeg", description: "Praticidade para colegas de trabalho, amigos ou familiares em passagem pela cidade.", capacity: "Até 2 hóspedes", beds: "2 camas" },
  { name: "Triplo", label: "Mais espaço", image: "/images/quarto-triplo.jpeg", description: "Acomodação versátil para pequenos grupos, com conforto para todos.", capacity: "Até 3 hóspedes", beds: "3 camas" },
  { name: "Família", label: "Estadia em grupo", image: "/images/quarto-familia.jpeg", description: "Uma opção acolhedora para compartilhar a viagem sem abrir mão da comodidade.", capacity: "Consulte opções", beds: "Configuração flexível" },
];

const gallery = [
  { src: "/images/fachada-principal.jpeg", alt: "Fachada principal da pousada", category: "estrutura", featured: true },
  { src: "/images/entrada.jpeg", alt: "Entrada da Pousada Nossa Senhora Aparecida", category: "estrutura" },
  { src: "/images/fachada-lateral.jpeg", alt: "Vista lateral da pousada", category: "estrutura" },
  { src: "/images/nossa-senhora.jpeg", alt: "Imagem de Nossa Senhora Aparecida na pousada", category: "estrutura" },
  { src: "/images/quarto-casal.jpeg", alt: "Quarto com cama de casal", category: "quartos", featured: true },
  { src: "/images/quarto-duplo.jpeg", alt: "Quarto com duas camas", category: "quartos" },
  { src: "/images/quarto-triplo.jpeg", alt: "Quarto triplo", category: "quartos" },
  { src: "/images/quarto-familia.jpeg", alt: "Quarto para família", category: "quartos" },
  { src: "/images/quarto-tv.jpeg", alt: "Quarto equipado com televisão", category: "quartos" },
  { src: "/images/banheiro.jpeg", alt: "Banheiro privativo da acomodação", category: "quartos" },
  { src: "/images/cafe-buffet.jpeg", alt: "Buffet do café da manhã", category: "cafe", featured: true },
  { src: "/images/cafe-frutas.jpeg", alt: "Seleção de frutas no café da manhã", category: "cafe" },
  { src: "/images/cafe-caseiro.jpeg", alt: "Comidas caseiras servidas no café da manhã", category: "cafe" },
  { src: "/images/cafe-prato.jpeg", alt: "Prato do café da manhã", category: "cafe" },
];

const galleryFilters = [
  { id: "todas", label: "Todas" },
  { id: "estrutura", label: "Nossa estrutura" },
  { id: "quartos", label: "Quartos" },
  { id: "cafe", label: "Café da manhã" },
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

function SocialIcon({ name }: { name: "whatsapp" | "instagram" }) {
  if (name === "whatsapp") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.7Z"/><path d="M8.1 7.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.5l.7 1.7c.1.3.1.5-.1.7l-.6.7c-.2.2-.1.4 0 .6.6 1.1 1.5 2 2.6 2.6.2.1.4.2.6 0l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.5.3.5.5 0 .3-.1 1.3-.7 1.9-.6.6-1.5.9-2.5.6-1.1-.3-2.7-.9-4.6-2.6-1.5-1.4-2.6-3.2-2.9-4.4-.3-.9 0-1.6.3-2Z"/></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r="1" className="social-icon__dot"/></svg>;
}

function Brand() {
  return (
    <span className="brand" aria-label="Pousada Nossa Senhora Aparecida">
      <Image src="/images/logo-pousada-horizontal.png" alt="" width={292} height={90} quality={100} priority />
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
  const [galleryFilter, setGalleryFilter] = useState("todas");
  const [galleryStart, setGalleryStart] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  const visibleGallery = gallery.filter((photo) => galleryFilter === "todas" || photo.category === galleryFilter);
  const currentGalleryPhoto = visibleGallery[galleryStart % visibleGallery.length];

  const showPreviousPhoto = () => setSelectedPhoto((current) => current === null ? null : (current - 1 + visibleGallery.length) % visibleGallery.length);
  const showNextPhoto = () => setSelectedPhoto((current) => current === null ? null : (current + 1) % visibleGallery.length);
  const showPreviousGallery = () => setGalleryStart((current) => (current - 1 + visibleGallery.length) % visibleGallery.length);
  const showNextGallery = () => setGalleryStart((current) => (current + 1) % visibleGallery.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (selectedPhoto === null) return;
    const navigate = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPhoto(null);
      if (event.key === "ArrowLeft") setSelectedPhoto((current) => current === null ? null : (current - 1 + visibleGallery.length) % visibleGallery.length);
      if (event.key === "ArrowRight") setSelectedPhoto((current) => current === null ? null : (current + 1) % visibleGallery.length);
    };
    document.body.classList.add("has-lightbox");
    window.addEventListener("keydown", navigate);
    return () => {
      document.body.classList.remove("has-lightbox");
      window.removeEventListener("keydown", navigate);
    };
  }, [selectedPhoto, visibleGallery.length]);

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
          <nav className="desktop-nav"><a href="#pousada">A pousada</a><a href="#acomodacoes">Acomodações</a><a href="#galeria">Galeria</a><a href="#localizacao">Localização</a></nav>
          <a className="header-cta" href="#reservar">Consultar estadia <Arrow /></a>
          <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><span/><span/></button>
        </div>
      </header>

      <div className={menuOpen ? "mobile-menu is-open" : "mobile-menu"} aria-hidden={!menuOpen}>
        <div><Brand /><button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">×</button></div>
        <nav>{[["A pousada","pousada"],["Acomodações","acomodacoes"],["Galeria","galeria"],["Localização","localizacao"],["Reservar","reservar"]].map(([label,id], index) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}</a>)}</nav>
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
            <div className="hero-photo hero-photo--main"><Image src="/images/fachada-principal-hero.png" alt="Fachada da Pousada Nossa Senhora Aparecida em Itabaiana" fill priority quality={95} sizes="(max-width: 800px) 100vw, 55vw" /></div>
            
            
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
          <ul className="room-list" data-reveal>
            {rooms.map((item, index) => (
              <li className="room" key={item.name}>
                <a className="room__photo" href="#reservar" aria-label={`Consultar o quarto ${item.name}`}>
                  <Image src={item.image} alt={`Quarto ${item.name}`} fill quality={95} sizes="(max-width: 800px) 88vw, (max-width: 1200px) 44vw, 380px" />
                  <em>0{index + 1}</em>
                </a>
                <div className="room__body">
                  <span>{item.label}</span>
                  <h3>Quarto {item.name}</h3>
                  <p>{item.description}</p>
                  <ul className="room__features"><li>{item.capacity}</li><li>{item.beds}</li><li>Ar-condicionado</li><li>TV</li><li>Frigobar</li><li>Banheiro privativo</li></ul>
                  <a href="#reservar">Mais detalhes <Arrow /></a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="photo-gallery section" id="galeria">
        <div className="container">
          <div className="gallery-heading" data-reveal>
            <div><span className="eyebrow">Galeria de fotos</span><h2>Conheça cada detalhe.</h2></div>
            <p>Quartos, estrutura e um café da manhã preparado com carinho. Selecione uma foto para ampliar.</p>
          </div>
          <div className="gallery-toolbar" data-reveal>
            <div className="gallery-filters" role="group" aria-label="Filtrar fotos">
              {galleryFilters.map((filter) => <button key={filter.id} className={galleryFilter === filter.id ? "is-active" : ""} type="button" onClick={() => { setGalleryFilter(filter.id); setGalleryStart(0); setSelectedPhoto(null); }} aria-pressed={galleryFilter === filter.id}>{filter.label}</button>)}
            </div>
            {visibleGallery.length > 1 && <div className="gallery-navigation" aria-label="Navegar pelas fotos">
              <button type="button" onClick={showPreviousGallery} aria-label="Mostrar fotos anteriores">←</button>
              <span>{galleryStart + 1} / {visibleGallery.length}</span>
              <button type="button" onClick={showNextGallery} aria-label="Mostrar próximas fotos">→</button>
            </div>}
          </div>
          <div className="gallery-grid" data-reveal>
            {currentGalleryPhoto && (
              <button className="gallery-photo gallery-photo--single" type="button" key={currentGalleryPhoto.src} onClick={() => setSelectedPhoto(galleryStart % visibleGallery.length)} aria-label={`Ampliar: ${currentGalleryPhoto.alt}`}>
                <Image src={currentGalleryPhoto.src} alt={currentGalleryPhoto.alt} fill quality={95} sizes="(max-width: 800px) 100vw, 1220px" />
                <span aria-hidden="true">+</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {selectedPhoto !== null && visibleGallery[selectedPhoto] && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Foto ampliada" onClick={() => setSelectedPhoto(null)}>
          <button className="lightbox__close" type="button" onClick={() => setSelectedPhoto(null)} aria-label="Fechar foto">×</button>
          <button className="lightbox__arrow lightbox__arrow--previous" type="button" onClick={(event) => { event.stopPropagation(); showPreviousPhoto(); }} aria-label="Foto anterior">←</button>
          <figure onClick={(event) => event.stopPropagation()}>
            <Image src={visibleGallery[selectedPhoto].src} alt={visibleGallery[selectedPhoto].alt} fill quality={100} sizes="100vw" priority />
            <figcaption><span>{visibleGallery[selectedPhoto].alt}</span><small>{selectedPhoto + 1} / {visibleGallery.length}</small></figcaption>
          </figure>
          <button className="lightbox__arrow lightbox__arrow--next" type="button" onClick={(event) => { event.stopPropagation(); showNextPhoto(); }} aria-label="Próxima foto">→</button>
        </div>
      )}

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
          <div className="breakfast-gallery" data-reveal><figure className="breakfast-gallery__main"><Image src="/images/cafe-frutas.jpeg" alt="Frutas servidas no café da manhã" fill quality={95} sizes="(max-width: 800px) 100vw, 40vw"/></figure><figure><Image src="/images/cafe-buffet.jpeg" alt="Buffet de café da manhã da pousada" fill quality={95} sizes="260px"/></figure><figure><Image src="/images/cafe-caseiro.jpeg" alt="Opções caseiras do café da manhã" fill quality={95} sizes="260px"/></figure></div>
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
          <div className="location-map" data-reveal>
            <iframe title="Localização da Pousada Nossa Senhora Aparecida no Google Maps" src="https://www.google.com/maps?q=Pousada%20Nossa%20Senhora%20Aparecida%2C%20Rua%20Campo%20do%20Brito%20344%2C%20Itabaiana%20SE&z=16&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            <a href={maps} target="_blank" rel="noreferrer"><Icon name="pin"/><span><strong>Ver no Google Maps</strong>Rua Campo do Brito, 344</span><Arrow /></a>
          </div>
        </div>
      </section>

      <section className="booking section" id="reservar">
        <div className="container booking-grid">
          <div className="booking-copy" data-reveal><span className="eyebrow">Sua próxima estadia</span><h2>Conte quando você vem. A gente cuida do resto.</h2><p>Envie as informações pelo formulário e continue o atendimento diretamente com a recepção no WhatsApp.</p><div><a href="tel:+5579999538948">(79) 99953-8948</a><a href="mailto:pousadansa@gmail.com">pousadansa@gmail.com</a></div></div>
          <form className="booking-form" onSubmit={reserve} data-reveal><label><span>Check-in</span><input type="date" value={arrival} onChange={event => setArrival(event.target.value)}/></label><label><span>Check-out</span><input type="date" value={departure} onChange={event => setDeparture(event.target.value)}/></label><label className="booking-form__wide"><span>Hóspedes</span><select value={guests} onChange={event => setGuests(event.target.value)}><option>1 hóspede</option><option>2 hóspedes</option><option>3 hóspedes</option><option>4 hóspedes</option><option>5 ou mais hóspedes</option></select></label><button className="button button--green booking-form__wide" type="submit">Consultar pelo WhatsApp <Arrow /></button><small className="booking-form__wide">A consulta não confirma automaticamente a reserva.</small></form>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-top"><Brand/><div><span>Navegue</span><a href="#pousada">A pousada</a><a href="#acomodacoes">Acomodações</a><a href="#galeria">Galeria</a><a href="#localizacao">Localização</a></div><div><span>Contato</span><a href={`tel:+${phone}`}>+55 79 99953-8948</a><a href="mailto:pousadansa@gmail.com">pousadansa@gmail.com</a><a href={instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div><div><span>Endereço</span><p>Rua Campo do Brito, 344<br/>Centro · Itabaiana/SE<br/>CEP 49500-109</p></div></div>
        <div className="container footer-bottom"><span>© 2026 Pousada Nossa Senhora Aparecida</span><Link href="/politica-de-privacidade">Política de Privacidade</Link></div>
      </footer>

      <div className="floating-socials" aria-label="Redes sociais e atendimento">
        <a className="floating-social floating-social--instagram" href={instagram} target="_blank" rel="noreferrer" aria-label="Ver o Instagram da pousada"><span>Instagram</span><SocialIcon name="instagram" /></a>
        <a className="floating-social floating-social--whatsapp" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Falar com a pousada no WhatsApp"><span>WhatsApp</span><SocialIcon name="whatsapp" /></a>
      </div>
    </main>
  );
}
