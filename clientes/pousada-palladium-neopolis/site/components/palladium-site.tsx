"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

const phone = "5579996741487";
const whatsapp = `https://wa.me/${phone}`;
const instagram = "https://www.instagram.com/palladiumneopolis/?theme=dark";
const maps = "https://www.google.com.br/maps/place/Pousada+Palladium+Ne%C3%B3polis,+Sergipe/@-10.3159139,-36.577885,17z";
const views = [
  {image:"/images/neopolis-rio.jpg",title:"Neópolis e o Velho Chico",text:"A cidade sergipana encontra o Rio São Francisco em uma paisagem cheia de calma."},
  {image:"/images/neopolis-orla.jpg",title:"A vida às margens do rio",text:"Barcos, encontros e o horizonte fazem parte do cotidiano da orla."},
  {image:"/images/neopolis-praca.jpg",title:"Caminhos de Neópolis",text:"Praças arborizadas e o centro histórico convidam a descobrir a cidade a pé."},
];

function Brand() { return <span className="brand"><i>P</i><span><b>Palladium</b><small>Neópolis · Sergipe</small></span></span>; }
function Arrow({direction="up"}:{direction?:"up"|"left"|"right"|"down"}) {
  const paths={up:"M8 24 24 8M12 8h12v12",left:"M26 16H6M13 9l-7 7 7 7",right:"M6 16h20M19 9l7 7-7 7",down:"M8 8l16 16M12 24h12V12"};
  return <svg className="arrow-icon" viewBox="0 0 32 32" aria-hidden="true"><path d={paths[direction]}/></svg>;
}
function WhatsAppIcon() { return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27.2 4.7A15.4 15.4 0 0 0 3 23.3L1 31l7.9-2.1A15.5 15.5 0 0 0 31 14.8c0-4-1.4-7.5-3.8-10.1ZM16 28.1c-2.3 0-4.5-.6-6.4-1.7l-.5-.3-4.7 1.2 1.3-4.5-.3-.5a12.5 12.5 0 1 1 10.6 5.8Zm6.9-9.3c-.4-.2-2.2-1.1-2.6-1.2-.3-.1-.6-.2-.8.2l-1.2 1.4c-.2.3-.4.3-.8.1-2.2-1.1-3.7-2-5.2-4.5-.4-.7.4-.7 1.1-2.2.1-.3.1-.5 0-.7l-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5-1 1-1.5 2.2-1.5 3.6 0 2.1 1.5 4.1 1.7 4.4.2.3 3 4.6 7.3 6.4 2.7 1.2 3.8 1.3 5.2 1.1 1.2-.2 2.2-1 2.5-1.9.3-.9.3-1.7.2-1.9-.1-.3-.4-.4-.8-.6Z"/></svg>; }
const serviceIcons:Record<string,React.ReactNode>={
  wifi:<><path d="M4 10a17 17 0 0 1 24 0"/><path d="M8 15a11 11 0 0 1 16 0"/><path d="M12 20a6 6 0 0 1 8 0"/><circle cx="16" cy="25" r="1.5"/></>,
  coffee:<><path d="M6 11h17v8a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7Z"/><path d="M23 14h2a3 3 0 0 1 0 6h-2M4 28h22M10 4v3M16 4v3M22 4v3"/></>,
  parking:<><path d="M10 27V5h8a7 7 0 0 1 0 14h-8M10 18h8"/></>,
  gym:<><path d="M8 12v8M4 14v4M24 12v8M28 14v4M8 16h16"/></>,
  service:<><path d="M5 23h22M8 23a8 8 0 0 1 16 0M16 11V8M13 8h6"/></>,
  family:<><circle cx="11" cy="10" r="4"/><circle cx="22" cy="12" r="3"/><path d="M3 27c0-6 3-9 8-9s8 3 8 9M18 20c6-2 10 1 11 7"/></>,
  air:<><path d="M5 9h13c5 0 5-6 1-6M5 15h20c5 0 5 7 0 7M5 21h9c4 0 4 6 0 6"/></>,
  garden:<><path d="M16 28V15M16 19C8 19 5 13 5 7c7 0 11 3 11 9M16 15c1-7 5-10 12-10 0 7-4 12-12 12"/></>,
  meeting:<><rect x="5" y="7" width="22" height="17" rx="2"/><path d="M11 28h10M16 24v4M10 13h12M10 18h7"/></>
};
function ServiceIcon({name}:{name:string}){return <svg viewBox="0 0 32 32" aria-hidden="true">{serviceIcons[name]}</svg>}

export function PalladiumSite() {
  const [menu,setMenu] = useState(false);
  const [name,setName] = useState("");
  const [guests,setGuests] = useState("2 pessoas");
  const [arrival,setArrival] = useState("");
  const [departure,setDeparture] = useState("");
  const [discoveries,setDiscoveries] = useState<number[]>([]);
  const [view,setView] = useState(0);

  function discover(index:number) { setDiscoveries(current=>current.includes(index)?current.filter(item=>item!==index):[...current,index]); }

  function reserve(event: FormEvent) {
    event.preventDefault();
    const message = `Olá! Quero consultar uma estadia na Pousada Palladium.\n\nNome: ${name}\nHóspedes: ${guests}\nEntrada: ${arrival || "a definir"}\nSaída: ${departure || "a definir"}`;
    window.open(`${whatsapp}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
  }

  return <main>
    <header><div className="shell nav"><a href="#inicio"><Brand/></a><nav><a href="#pousada">A pousada</a><a href="#acomodacoes">Acomodações</a><a href="#experiencia">Experiência</a><a href="#regiao">A região</a><a href="#informacoes">Informações</a><a href="#localizacao">Localização</a></nav><a className="nav__cta" href="#reservar">Reservar <Arrow/></a><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Abrir menu">{menu?"×":"☰"}</button></div>{menu&&<nav className="mobile-nav"><a href="#pousada" onClick={()=>setMenu(false)}>A pousada</a><a href="#acomodacoes" onClick={()=>setMenu(false)}>Acomodações</a><a href="#experiencia" onClick={()=>setMenu(false)}>Experiência</a><a href="#regiao" onClick={()=>setMenu(false)}>A região</a><a href="#informacoes" onClick={()=>setMenu(false)}>Informações</a><a href="#localizacao" onClick={()=>setMenu(false)}>Localização</a></nav>}</header>

    <section className="hero" id="inicio"><div className="hero__image"><Image src="/images/quarto-palladium.jpg" alt="Acomodação da Pousada Palladium" fill priority quality={95} sizes="100vw"/></div><div className="hero__shade"/><div className="shell hero__content"><p className="eyebrow">Às margens do Rio São Francisco</p><h1>Um refúgio de elegância e <em>tranquilidade.</em></h1><p className="hero__text">Conforto, cuidado e a atmosfera singular de Neópolis em uma estadia feita para desacelerar.</p><div className="hero__actions"><a className="button button--light" href="#reservar">Consultar estadia <Arrow/></a><a href="#pousada">Conhecer a pousada</a></div></div><div className="hero__seal"><b>4,6</b><span>Excelente<br/>no Google</span></div><div className="scroll">Role para descobrir <i/></div></section>

    <section className="intro section" id="pousada"><div className="shell intro__grid"><div><p className="eyebrow green">Palladium Neópolis</p><h2>O conforto encontra o ritmo sereno do rio.</h2></div><div><p>No coração de Neópolis e de frente para o São Francisco, a Palladium recebe você em uma atmosfera reservada, acolhedora e naturalmente elegante.</p><p>Um endereço para descansar bem, saborear um café da manhã especial e viver a cultura ribeirinha com tempo.</p><a className="text-link" href={instagram} target="_blank" rel="noreferrer">Acompanhe no Instagram <Arrow/></a></div></div><div className="shell highlights"><span><b>9,2</b> localização</span><span><b>14h</b> entrada</span><span><b>11h</b> saída</span><span><b>24h</b> acolhimento</span></div></section>

    <section className="rooms section" id="acomodacoes"><div className="shell rooms__head"><div><p className="eyebrow gold">Acomodações</p><h2>Seu espaço para repousar.</h2></div><p>Ambientes claros, roupa de cama preparada com cuidado e tudo o que importa para uma noite tranquila.</p></div><div className="shell room"><div className="room__photo"><Image src="/images/quarto-palladium.jpg" alt="Quarto casal da Pousada Palladium" fill quality={95} sizes="(max-width: 700px) 100vw, 60vw"/><span>Conforto essencial</span></div><div className="room__copy"><small>Quarto casal</small><h3>Deluxe</h3><p>Uma acomodação reservada para duas pessoas, com linhas leves e a praticidade que a sua viagem pede.</p><ul><li>Ar condicionado</li><li>Wi Fi gratuito</li><li>Banheiro privativo</li><li>TV de tela plana</li><li>Frigobar</li><li>Mesa de trabalho</li></ul><a className="button button--dark" href="#reservar">Consultar disponibilidade <Arrow/></a></div></div></section>

    <section className="experience section" id="experiencia"><div className="leaf leaf--one"/><div className="leaf leaf--two"/><div className="shell experience__grid"><div className="experience__quote"><p className="eyebrow gold">Um outro tempo</p><blockquote>“Entre o verde do jardim e a calma do Velho Chico, a viagem encontra espaço para respirar.”</blockquote><div className="river-progress"><span style={{width:`${discoveries.length/3*100}%`}}/><small>{discoveries.length===3?"Roteiro completo":"Escolha o que deseja viver"}</small></div></div><div className="experience__list">{[["Café da manhã","Sabores frescos servidos em buffet para começar o dia sem pressa."],["À beira do rio","Uma localização privilegiada para sentir Neópolis e o São Francisco de perto."],["Cuidado diário","Arrumação, serviço de quarto e uma equipe pronta para receber você."]].map(([title,text],index)=><button key={title} onClick={()=>discover(index)} className={discoveries.includes(index)?"selected":""} aria-pressed={discoveries.includes(index)}><span>{discoveries.includes(index)?"✓":`0${index+1}`}</span><div><h3>{title}</h3><p>{discoveries.includes(index)?"Adicionado ao seu roteiro":text}</p></div><i>{discoveries.includes(index)?"Escolhido":"Quero viver"}</i></button>)}</div></div></section>

    <section className="views section" id="regiao"><div className="shell views__head"><div><p className="eyebrow green">Vista da região</p><h2>O São Francisco logo ali.</h2></div><div className="view-controls"><span>{String(view+1).padStart(2,"0")} / {String(views.length).padStart(2,"0")}</span><button onClick={()=>setView(current=>(current-1+views.length)%views.length)} aria-label="Foto anterior"><Arrow direction="left"/></button><button onClick={()=>setView(current=>(current+1)%views.length)} aria-label="Próxima foto"><Arrow direction="right"/></button></div></div><div className="shell view-frame"><div className="view-photo"><Image key={views[view].image} src={views[view].image} alt={views[view].title} fill quality={95} sizes="(max-width:700px) 100vw, 1180px"/></div><div className="view-caption"><small>Neópolis, Sergipe</small><h3>{views[view].title}</h3><p>{views[view].text}</p></div></div><div className="shell view-dots">{views.map((item,index)=><button key={item.image} className={view===index?"active":""} onClick={()=>setView(index)} aria-label={`Ver foto ${index+1}`}/>)}</div></section>

    <section className="details section" id="informacoes"><div className="shell"><div className="details__head"><div><p className="eyebrow green">Informações da estadia</p><h2>Tudo preparado para a sua chegada.</h2></div><p>Horários e serviços reunidos para você planejar cada detalhe com tranquilidade.</p></div><div className="times"><div className="time-card"><span className="time-icon"><Arrow direction="down"/></span><div><small>Entrada</small><b>14h</b><span>Recepção até 23h</span></div></div><div className="time-card"><span className="time-icon"><Arrow/></span><div><small>Saída</small><b>11h</b><span>A partir das 8h</span></div></div><a href={whatsapp} target="_blank" rel="noreferrer"><span><small>Chegada fora do horário?</small><b>Converse com a recepção</b></span><Arrow/></a></div><div className="amenities">{[["wifi","Wi Fi","Gratuito"],["coffee","Café da manhã","Buffet incluso"],["parking","Estacionamento","Privativo e gratuito"],["gym","Academia","Disponível"],["service","Serviço de quarto","Mais comodidade"],["family","Quartos familiares","Para viajar juntos"],["air","Ar condicionado","Em todas as acomodações"],["garden","Jardim e terraço","Para desacelerar"],["meeting","Reuniões","Espaço disponível"]].map(([icon,title,text])=><article key={title}><i><ServiceIcon name={icon}/></i><div><b>{title}</b><small>{text}</small></div></article>)}</div></div></section>

    <section className="location section" id="localizacao"><div className="shell location__grid"><div><p className="eyebrow gold">Neópolis, Sergipe</p><h2>No coração da cidade, diante do São Francisco.</h2><p>Av. Getúlio Vargas, 55<br/>Centro, Neópolis, Sergipe</p><a className="button button--light" href={maps} target="_blank" rel="noreferrer">Traçar rota <Arrow/></a></div><iframe title="Pousada Palladium no mapa" src="https://www.google.com/maps?q=Pousada%20Palladium%20Neopolis%20Sergipe&z=16&output=embed" loading="lazy" allowFullScreen/></div></section>

    <section className="booking section" id="reservar"><div className="shell booking__grid"><div><p className="eyebrow green">Sua próxima estadia</p><h2>Permita se sentir bem.</h2><p>Envie os dados da viagem e continue o atendimento diretamente pelo WhatsApp.</p></div><form onSubmit={reserve}><label className="wide">Nome<input required value={name} onChange={e=>setName(e.target.value)} placeholder="Como podemos chamar você?"/></label><label>Hóspedes<select value={guests} onChange={e=>setGuests(e.target.value)}><option>1 pessoa</option><option>2 pessoas</option><option>3 pessoas</option><option>4 pessoas</option><option>5 pessoas</option><option>6 ou mais pessoas</option></select></label><label>Entrada<input type="date" value={arrival} onChange={e=>setArrival(e.target.value)}/></label><label>Saída<input type="date" value={departure} onChange={e=>setDeparture(e.target.value)}/></label><button className="button button--dark wide" type="submit">Consultar pelo WhatsApp <Arrow/></button></form></div></section>

    <footer><div className="shell footer__top"><Brand/><div><b>Explore</b><a href="#pousada">A pousada</a><a href="#acomodacoes">Acomodações</a><a href="#regiao">A região</a><a href="#informacoes">Informações</a></div><div><b>Contato</b><a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><a href={instagram} target="_blank" rel="noreferrer">Instagram</a></div><p>Av. Getúlio Vargas, 55<br/>Centro, Neópolis, Sergipe</p></div><div className="shell footer__bottom"><span>© 2026 Pousada Palladium</span><span>Hospitalidade às margens do São Francisco</span></div></footer>
    <a className="float" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp">WhatsApp <span><WhatsAppIcon/></span></a>
  </main>;
}
