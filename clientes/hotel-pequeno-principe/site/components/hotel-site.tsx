"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

const phone = "5582999661886";
const whatsapp = `https://wa.me/${phone}`;
const instagram = "https://www.instagram.com/palladiumneopolis/?theme=dark";
const maps = "https://www.google.com/maps/place/R.+Prof.+Domingos+Correia,+732+-+Centro,+Arapiraca+-+AL,+57300-011/@-9.7557119,-36.6608315,17z";

const rooms = [
  { name: "Individual", note: "Seu cantinho", image: "/images/quarto-individual.jpg", text: "Prático e tranquilo para quem viaja sozinho." },
  { name: "Casal", note: "Para dois", image: "/images/quarto-casal.jpg", text: "Conforto para descansar e aproveitar Arapiraca." },
  { name: "Duplo", note: "Bons encontros", image: "/images/quarto-duplo.jpg", text: "Duas camas e toda a praticidade para a viagem." },
  { name: "Triplo", note: "Turma reunida", image: "/images/quarto-triplo.jpg", text: "Mais espaço para família, amigos e boas histórias." },
];

function CastleMark() {
  return <span className="brand"><svg viewBox="0 0 72 72" aria-hidden="true"><path d="M12 61V26l9 6V20l15 10 15-10v12l9-6v35M8 61h56M29 61V48h14v13M21 40h7M44 40h7"/><path d="M36 9v15M36 9l13 5-13 5"/></svg><span><strong>Hotel</strong><b>Pequeno Príncipe</b></span></span>;
}

function Arrow() { return <span aria-hidden="true">→</span>; }

const journey = [
  { icon: "♜", title: "Chegue ao castelo", text: "Encontre seu ponto de descanso" },
  { icon: "☁", title: "Escolha seu quarto", text: "Descubra o cantinho ideal" },
  { icon: "☾", title: "Recarregue as energias", text: "Uma noite tranquila espera por você" },
  { icon: "✦", title: "Explore Arapiraca", text: "A cidade começa logo ali" },
];

export function HotelSite() {
  const [menu, setMenu] = useState(false);
  const [room, setRoom] = useState(0);
  const [stars, setStars] = useState<number[]>([]);
  const [guestName, setGuestName] = useState("");
  const [guests, setGuests] = useState("2 pessoas");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  function collect(index: number) { setStars((current) => current.includes(index) ? current : [...current, index]); }
  function reserve(event: FormEvent) {
    event.preventDefault();
    const message = `Olá! Quero consultar uma estadia no Hotel Pequeno Príncipe.\n\nNome: ${guestName || "não informado"}\nHóspedes: ${guests}\nChegada: ${arrival || "a definir"}\nSaída: ${departure || "a definir"}`;
    window.open(`${whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return <main>
    <header className="header"><div className="shell header__inner"><a href="#inicio"><CastleMark /></a><nav><a href="#hotel">O hotel</a><a href="#quartos">Quartos</a><a href="#informacoes">Informações</a><a href="#localizacao">Localização</a></nav><a className="header__cta" href="#reservar">Consultar estadia <Arrow /></a><button className="menu" onClick={() => setMenu(!menu)} aria-label="Abrir menu">{menu ? "×" : "☰"}</button></div>{menu && <nav className="mobile-nav"><a href="#hotel" onClick={() => setMenu(false)}>O hotel</a><a href="#quartos" onClick={() => setMenu(false)}>Quartos</a><a href="#informacoes" onClick={() => setMenu(false)}>Informações</a><a href="#localizacao" onClick={() => setMenu(false)}>Localização</a></nav>}</header>

    <section className="hero" id="inicio"><div className="hero__stars" aria-hidden="true">✦ · ✧ · ✦ · ✧ · ★ · ✦ · ✧</div><div className="star-field" aria-hidden="true">{Array.from({length:18},(_,index)=><i key={index}/>)}</div><div className="shell hero__grid"><div className="hero__copy" data-reveal><span className="kicker">Sua aventura em Arapiraca começa aqui</span><h1>Descanse como parte da <em>realeza.</em></h1><p>Um hotel cheio de cuidado, sabores e conforto no centro da cidade. Entre, escolha seu quarto e transforme a estadia em uma boa história.</p><div className="hero__actions"><a className="button button--yellow" href="#reservar">Abrir o portal <Arrow /></a><a className="hero__link" href="#quartos">Explorar quartos ↓</a></div><div className="passport"><span>PASSAPORTE</span><b>ARAPIRACA</b><small>Hospitalidade desde o primeiro olá</small></div></div><div className="hero__art" data-reveal><Image className="little-prince" src="/images/pequeno-principe-v2.png" alt="Pequeno príncipe aventureiro" width={1024} height={1536} priority/><div className="planet"><Image src="/images/fachada.jpg" alt="Entrada do Hotel Pequeno Príncipe" fill priority quality={95} sizes="(max-width: 800px) 92vw, 48vw" /></div><div className="orbit"><i>★</i></div><div className="hero__badge">No centro<br/><b>perto de tudo</b></div></div></div><div className="cloud cloud--one"/><div className="cloud cloud--two"/></section>

    <section className="welcome section" id="hotel"><div className="shell welcome__intro"><div data-reveal><span className="kicker kicker--blue">Boas vindas ao nosso cantinho</span><h2>Chegar bem muda toda a viagem.</h2></div><div data-reveal><p>Aqui a hospitalidade é simples de verdade. Tem alguém na recepção para receber você, um quarto preparado com cuidado e a cidade pertinho para aproveitar.</p><a className="ink-link" href={whatsapp} target="_blank" rel="noreferrer">Conversar com a recepção <Arrow /></a></div></div><div className="shell travel-note" data-reveal><div className="travel-note__photo"><Image src="/images/recepcao.jpg" alt="Recepção do Hotel Pequeno Príncipe" fill quality={95} sizes="(max-width: 700px) 92vw, 45vw"/><span>Portas abertas o dia inteiro</span></div><div className="travel-note__page"><span className="travel-note__eyebrow">Seu roteiro começa aqui</span><h3>Pequenas coisas que fazem você se sentir em casa</h3><div className="travel-list">{journey.map((item,index)=><button key={item.title} onClick={()=>collect(index)} className={stars.includes(index)?"checked":""} aria-pressed={stars.includes(index)}><span className="travel-check">{stars.includes(index)?"✓":""}</span><span><b>{item.title}</b><small>{stars.includes(index)?"Anotado no seu roteiro":item.text}</small></span></button>)}</div><div className="travel-note__footer"><span>{stars.length === 4 ? "Roteiro pronto para começar" : `${stars.length} escolhas anotadas`}</span><b aria-hidden="true">Hotel Pequeno Príncipe</b></div></div></div></section>

    <section className="rooms section" id="quartos"><div className="shell"><div className="section-title" data-reveal><div><span className="kicker">Escolha seu capítulo</span><h2>Qual quarto combina com a sua viagem?</h2></div><p>Todos com ar condicionado, TV, banheiro privativo e o aconchego que importa.</p></div><div className="room-tabs" role="tablist">{rooms.map((item,index) => <button key={item.name} className={room===index ? "active" : ""} onClick={() => setRoom(index)}>{item.name}</button>)}</div><article className="room-card" data-reveal><div className="room-card__photo"><Image src={rooms[room].image} alt={`Quarto ${rooms[room].name}`} fill quality={95} sizes="(max-width: 800px) 100vw, 58vw" /></div><div className="room-card__copy"><span>{rooms[room].note}</span><h3>Quarto {rooms[room].name}</h3><p>{rooms[room].text}</p><ul><li>✓ Ar condicionado</li><li>✓ Televisão</li><li>✓ Banheiro privativo</li><li>✓ Wi Fi</li></ul><a href="#reservar">Consultar este quarto <Arrow /></a></div></article></div></section>

    <section className="details section" id="informacoes"><div className="shell"><div className="details__heading" data-reveal><div><span className="kicker kicker--blue">Antes de fazer as malas</span><h2>Tudo o que você precisa saber.</h2></div><p>Informações para planejar sua chegada com tranquilidade. Se precisar combinar algum detalhe, converse com a recepção.</p></div><div className="schedule" data-reveal><div><small>Horário de entrada</small><b>14h</b><span>Check in</span></div><i aria-hidden="true">→</i><div><small>Horário de saída</small><b>12h</b><span>Check out</span></div><a href={whatsapp} target="_blank" rel="noreferrer">Precisa de outro horário? Consulte a recepção <Arrow /></a></div><div className="amenities" data-reveal><article><span>⌁</span><div><b>Wi Fi gratuito</b><small>Disponível no hotel</small></div></article><article><span>☕</span><div><b>Café da manhã</b><small>Buffet ou americano</small></div></article><article><span>P</span><div><b>Estacionamento</b><small>Gratuito no local</small></div></article><article><span>♿</span><div><b>Acessibilidade</b><small>Estrutura adaptada</small></div></article><article><span>❄</span><div><b>Ar condicionado</b><small>Nos quartos</small></div></article><article><span>24</span><div><b>Recepção</b><small>Atendimento 24 horas</small></div></article><article><span>▣</span><div><b>Restaurante</b><small>No próprio hotel</small></div></article><article><span>▤</span><div><b>Quartos familiares</b><small>Opções para sua turma</small></div></article><article><span>♜</span><div><b>Centro de reuniões</b><small>Espaço para eventos</small></div></article></div><p className="details__note">Políticas de animais, condições para crianças e pedidos especiais devem ser confirmados diretamente com a recepção.</p></div></section>

    <section className="location section" id="localizacao"><div className="shell location__grid"><div><span className="kicker">No coração da cidade</span><h2>Seu ponto de partida em Arapiraca.</h2><p>Rua Professor Domingos Correia, 732<br/>Centro, Arapiraca, Alagoas</p><a className="button button--yellow" href={maps} target="_blank" rel="noreferrer">Traçar rota <Arrow /></a></div><iframe title="Hotel Pequeno Príncipe no mapa" src="https://www.google.com/maps?q=R.%20Prof.%20Domingos%20Correia%2C%20732%2C%20Arapiraca%2C%20AL&z=16&output=embed" loading="lazy" allowFullScreen /></div></section>

    <section className="booking section" id="reservar"><div className="shell booking__grid"><div><span className="kicker kicker--blue">Próxima aventura</span><h2>Quando começa a sua viagem?</h2><p>Conte quem vem e as datas para continuar a conversa direto com a recepção.</p></div><form onSubmit={reserve}><label className="wide">Seu nome<input type="text" value={guestName} onChange={(e)=>setGuestName(e.target.value)} placeholder="Como podemos chamar você?" required /></label><label>Quantidade de pessoas<select value={guests} onChange={(e)=>setGuests(e.target.value)}><option>1 pessoa</option><option>2 pessoas</option><option>3 pessoas</option><option>4 pessoas</option><option>5 pessoas</option><option>6 ou mais pessoas</option></select></label><label>Chegada<input type="date" value={arrival} onChange={(e)=>setArrival(e.target.value)} /></label><label>Saída<input type="date" value={departure} onChange={(e)=>setDeparture(e.target.value)} /></label><button className="button button--coral wide" type="submit">Consultar no WhatsApp <Arrow /></button></form></div></section>

    <footer><div className="shell footer__grid"><CastleMark/><div><b>Explore</b><a href="#hotel">O hotel</a><a href="#quartos">Quartos</a><a href="#informacoes">Informações</a><a href="#localizacao">Localização</a></div><div><b>Converse</b><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><a href={instagram} target="_blank" rel="noreferrer">Instagram</a></div><p>Rua Professor Domingos Correia, 732<br/>Centro, Arapiraca, Alagoas</p></div><div className="shell footer__bottom">© 2026 Hotel Pequeno Príncipe <span>Feito para boas histórias</span></div></footer>
    <a className="float" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Falar pelo WhatsApp">Converse <span>✦</span></a>
  </main>;
}
