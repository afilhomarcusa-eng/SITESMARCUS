"use client";

import { useEffect, useMemo, useState } from "react";

/*
 * Todo dado de contato aqui veio de fonte publica verificada em 03/09/2026:
 * Google Maps, Instagram e Linktree do hotel. Nada foi inventado. Nao existe
 * e-mail publico, nao existe tabela de diarias oficial e nao existe horario de
 * check-in publicado, entao nada disso aparece no site.
 */
const phone = "5582999770439";
const phoneLabel = "(82) 99977-0439";
const instagram = "https://www.instagram.com/hotelsolnascentearapiraca_/";
const maps = "https://maps.app.goo.gl/Jefamy8xxjDShdUC8";
const mapsEmbed =
  "https://www.google.com/maps?q=Hotel+Sol+Nascente+AL-220+Jardim+Esperan%C3%A7a+Arapiraca+AL&z=15&output=embed";

function wa(message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/* ---------------------------------------------------------------- icones */

const iconBase = {
  className: "ico",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const glyphs = {
  arrow: <path d="M5 12h13M12.5 6l5.5 6-5.5 6" />,
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </>
  ),
  wifi: (
    <>
      <path d="M4 9.5a13 13 0 0 1 16 0M7 13a8.5 8.5 0 0 1 10 0M10 16.5a3.5 3.5 0 0 1 4 0" />
      <circle cx="12" cy="20" r=".7" fill="currentColor" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 9h12v5.5A4.5 4.5 0 0 1 11.5 19h-3A4.5 4.5 0 0 1 4 14.5Z" />
      <path d="M16 10.5h1.8a2.2 2.2 0 1 1 0 4.4H16" />
      <path d="M7.5 5.5c0-.9.9-1 .9-2M11 5.5c0-.9.9-1 .9-2" />
    </>
  ),
  car: (
    <>
      <path d="M4 16.5v-4l1.7-4.2c.2-.5.7-.8 1.2-.8h10.2c.5 0 1 .3 1.2.8L20 12.5v4" />
      <path d="M4 12.7h16" />
      <path d="M4.5 16.5h3v2h-3zM16.5 16.5h3v2h-3z" />
    </>
  ),
  pool: (
    <>
      <path d="M3 17c1.6 0 1.6 1.5 3.2 1.5S7.8 17 9.4 17s1.6 1.5 3.2 1.5S14.2 17 15.8 17s1.6 1.5 3.2 1.5" />
      <path d="M3 13c1.6 0 1.6 1.5 3.2 1.5S7.8 13 9.4 13s1.6 1.5 3.2 1.5S14.2 13 15.8 13s1.6 1.5 3.2 1.5" />
      <path d="M8 13V6.5A2.5 2.5 0 0 1 13 6M16 13V6.5" />
      <path d="M8 9.5h8" />
    </>
  ),
  air: (
    <>
      <rect x="3.5" y="5" width="17" height="7.5" rx="1.6" />
      <path d="M6.5 9.7h11" />
      <path d="M7.5 15.5c1.5 0 1.5 2 3 2M13.5 15.5c1.5 0 1.5 2 3 2" />
    </>
  ),
  pet: (
    <>
      <circle cx="8" cy="8" r="1.8" />
      <circle cx="15.5" cy="7.5" r="1.8" />
      <circle cx="5" cy="13" r="1.6" />
      <circle cx="18.5" cy="12.5" r="1.6" />
      <path d="M11.8 12c2.6 0 4.6 2.2 4.6 4.4 0 1.7-1.4 2.6-2.8 2.6h-3.6c-1.4 0-2.8-.9-2.8-2.6 0-2.2 2-4.4 4.6-4.4Z" />
    </>
  ),
  fork: (
    <>
      <path d="M7 3v6.5a2 2 0 0 0 4 0V3" />
      <path d="M9 9.5V21" />
      <path d="M16.5 3c-1.4 1-2 2.6-2 4.6 0 1.6.7 2.7 2 3.1V21" />
    </>
  ),
  gym: (
    <>
      <path d="M3 9.5v5M6 7v10M18 7v10M21 9.5v5" />
      <path d="M6 12h12" />
    </>
  ),
  plane: <path d="M11 3.5c.6 0 1 .5 1 1.1v4.6l7.5 4.2v1.8L12 13.4v4l2.4 1.6v1.4L11 19.4l-3.4 1v-1.4L10 17.4v-4l-7.5 1.8v-1.8L10 9.2V4.6c0-.6.4-1.1 1-1.1Z" />,
  access: (
    <>
      <circle cx="12" cy="4.5" r="1.6" />
      <path d="M8.5 8.2 12 9.2l3.5-1" />
      <path d="M12 9.2v4.3h3.4l2 5.3" />
      <path d="M12.6 13.5a4.6 4.6 0 1 1-4.4 1.3" />
    </>
  ),
  mic: (
    <>
      <rect x="9.2" y="3" width="5.6" height="10" rx="2.8" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4M9.5 21h5" />
    </>
  ),
  screen: (
    <>
      <rect x="3" y="4.5" width="18" height="11" rx="1.6" />
      <path d="M12 15.5V19M8.5 19h7" />
    </>
  ),
  chairs: (
    <>
      <path d="M4 20v-4.5M20 20v-4.5" />
      <path d="M3 15.5h18" />
      <path d="M6 15.5V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7.5" />
      <path d="M6 11h12" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
    </>
  ),
  pin: (
    <>
      <path d="M19.5 10c0 5-7.5 10.5-7.5 10.5S4.5 15 4.5 10a7.5 7.5 0 0 1 15 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  phone: <path d="M7.3 4h2.1l1.4 3.5-1.7 1.4a11.5 11.5 0 0 0 5 5l1.4-1.7 3.5 1.4v2.1c0 1.2-1 2.2-2.2 2.1A15.4 15.4 0 0 1 5.2 6.2 2.1 2.1 0 0 1 7.3 4Z" />,
  bed: (
    <>
      <path d="M3 18v-9M3 13.5h18V18" />
      <path d="M6.5 13.5v-3h5.5a3 3 0 0 1 3 3" />
      <circle cx="18" cy="10.5" r="1.6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.5a3 3 0 0 1 0 5.4M17 14.2a5.5 5.5 0 0 1 3.5 4.8" />
    </>
  ),
  moon: <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />,
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.6-7.5-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />,
  /* Marca oficial do WhatsApp, cheia. A versao anterior era um contorno
     aproximado e nao lia bem nos 22px do botao flutuante. */
  wa: (
    <path d="M12.04 2.02c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.33 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9a9.82 9.82 0 0 0-2.9-7.01 9.82 9.82 0 0 0-7.01-2.9Zm0 18.05h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.69 8.24-8.24 8.24Zm4.52-6.17c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.73 6.73 0 0 1-1.98-1.22 7.42 7.42 0 0 1-1.37-1.71c-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.3-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.02s.87 2.35.99 2.51c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.11-.22-.17-.47-.3Z" />
  ),
  /* Instagram com as proporcoes reais: moldura 16 de lado, raio 4.8,
     lente de raio 4 e o ponto na diagonal superior direita. */
  ig: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5.2" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
      <circle cx="16.9" cy="7.1" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
} as const;

type IconName = keyof typeof glyphs;

/** Icones desenhados com preenchimento em vez de contorno. */
const solidIcons = new Set<IconName>(["wa"]);

function Icon({ name }: { name: IconName }) {
  if (solidIcons.has(name)) {
    return (
      <svg className="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {glyphs[name]}
      </svg>
    );
  }
  return <svg {...iconBase}>{glyphs[name]}</svg>;
}

function Mark() {
  return (
    <span className="mark">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M2 34h44" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M9 34a15 15 0 0 1 30 0Z" fill="#f0a259" />
        <g stroke="#f0a259" strokeWidth="2.4" strokeLinecap="round">
          <path d="M24 5v5M24 5v5M8.5 11.5l3.4 3.4M39.5 11.5l-3.4 3.4M2 25.5h4.6M41.4 25.5H46" />
        </g>
      </svg>
      <span>
        <b>Sol Nascente</b>
        <small>Arapiraca · AL</small>
      </span>
    </span>
  );
}

/* --------------------------------------------------------------- conteudo */

/**
 * O slot de foto. Sem `src` ele desenha um degrade da paleta e diz o que vai
 * ali, entao um espaco vazio nunca vira buraco branco. Hoje todos tem foto:
 * ASSETS.md lista arquivo por arquivo e de onde veio cada um.
 */
function Slot({ tone, tag, src, alt }: { tone?: "night" | "olive" | "clay"; tag: string; src?: string; alt?: string }) {
  return (
    <div className={tone ? `slot slot--${tone}` : "slot"}>
      {src ? <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" /> : null}
      <span className="slot__tag">{tag}</span>
    </div>
  );
}

/** As sete paradas da Linha do Sol. Sky e a cor do ceu naquela hora no agreste. */
const hours = [
  {
    time: "05h",
    label: "Nascente",
    sky: "linear-gradient(178deg,#0a1f11 0%,#173d22 34%,#5a6330 62%,#b57438 84%,#e79950 100%)",
    bright: false,
    title: "O sol chega antes de todo mundo.",
    text: "A AL-220 ainda está calada e o céu já está trocando de cor por cima do hotel. Quem madruga para pegar estrada sai daqui com o dia começando junto.",
    tags: ["Recepção na chegada", "Estacionamento no terreno"],
    tone: "night" as const,
    photo: "Fachada no nascer do sol",
    src: "/images/fachada-palmeiras.jpg",
    alt: "Fachada do Hotel Sol Nascente vista da entrada",
  },
  {
    time: "07h",
    label: "Café",
    sky: "linear-gradient(178deg,#27632f 0%,#68a75b 30%,#dfc38d 72%,#f8eed2 100%)",
    bright: true,
    title: "Café da manhã já está na diária.",
    text: "Não é item à parte nem cortesia de fim de semana. Está incluído todos os dias, e é uma das coisas que mais aparece nas avaliações de quem dorme aqui.",
    tags: ["Incluído na diária", "Todos os dias"],
    tone: "clay" as const,
    photo: "Mesa do café da manhã",
    src: "/images/cafe-manha.jpg",
    alt: "Buffet do café da manhã do hotel",
  },
  {
    time: "10h",
    label: "Cidade",
    sky: "linear-gradient(178deg,#317a39 0%,#84bd6a 28%,#cfe2ac 64%,#f0f5e2 100%)",
    bright: true,
    title: "Arapiraca resolve rápido.",
    text: "A segunda maior cidade de Alagoas cabe numa manhã. Reunião, feira, consulta, visita a cliente: dá tempo de fazer o que trouxe você e voltar para almoçar.",
    tags: ["Traslado do aeroporto", "Wi-Fi em todo o hotel"],
    tone: "olive" as const,
    photo: "Rua de Arapiraca vista do hotel",
    src: "/images/recepcao.jpg",
    alt: "Recepção e sala de estar do hotel",
  },
  {
    time: "12h",
    label: "Almoço",
    sky: "linear-gradient(178deg,#2f9e3f 0%,#8ec46e 26%,#cfe0a8 62%,#f4f6e4 100%)",
    bright: true,
    title: "O restaurante não é só para hóspede.",
    text: "Abre para a rua. Quem está de passagem senta na mesma mesa de quem mora aqui, e essa mistura é metade da graça de comer num hotel de cidade média.",
    tags: ["Aberto ao público", "Almoço servido no local"],
    tone: "clay" as const,
    photo: "Salão do restaurante",
    src: "/images/restaurante-salao.jpg",
    alt: "Salão do restaurante do hotel",
  },
  {
    time: "15h",
    label: "Piscina",
    sky: "linear-gradient(178deg,#31783a 0%,#8fbd68 26%,#d8dfa8 60%,#f2ead0 100%)",
    bright: true,
    title: "A tarde do agreste pede sombra e água.",
    text: "A piscina externa é o assunto que mais volta nos comentários depois do preço. Com criança na viagem, ela costuma decidir a hospedagem sozinha.",
    tags: ["Piscina externa", "Área de lazer"],
    tone: undefined,
    photo: "Piscina externa à tarde",
    src: "/images/piscina.jpg",
    alt: "Piscina externa do hotel com palmeiras",
  },
  {
    time: "19h",
    label: "Auditório",
    sky: "linear-gradient(178deg,#17331e 0%,#5c5730 42%,#c96b45 76%,#efa25c 100%)",
    bright: false,
    title: "O auditório acende quando a cidade desacelera.",
    text: "Congresso, treinamento, formatura, casamento. O espaço tem entrada própria e fica no mesmo terreno do hotel, então quem vem de fora dorme onde o evento acontece.",
    tags: ["Auditório próprio", "Hospedagem no mesmo terreno"],
    tone: "night" as const,
    photo: "Auditório montado para evento",
    src: "/images/auditorio.jpg",
    alt: "Auditório Sol Nascente montado com cadeiras",
  },
  {
    time: "22h",
    label: "Silêncio",
    sky: "linear-gradient(178deg,#06150c 0%,#102a17 52%,#1b3d24 100%)",
    bright: false,
    title: "Ar-condicionado ligado e a rodovia longe.",
    text: "O hotel fica fora do miolo barulhento da cidade. À noite isso vira o argumento principal: quarto climatizado, rua quieta e o dia seguinte começando cedo de novo.",
    tags: ["Ar-condicionado nos quartos", "Aceita pets"],
    tone: "night" as const,
    photo: "Quarto à noite",
    src: "/images/suite.jpg",
    alt: "Suíte de casal do hotel",
  },
];

const rooms = [
  {
    name: "Solteiro",
    tagline: "Para quem vem sozinho",
    text: "O quarto de quem chega a trabalho, dorme e sai cedo. Enxuto no tamanho certo, com tudo que faz diferença numa noite só.",
    meta: ["1 hóspede", "Ar-condicionado", "Wi-Fi", "TV"],
    photo: "Quarto solteiro",
    src: "/images/quarto-solteiro.jpg",
    alt: "Quarto de solteiro do Hotel Sol Nascente",
    tone: undefined,
  },
  {
    name: "Casal",
    tagline: "Para dois",
    text: "Cama de casal, ambiente reservado e a piscina a poucos passos. É o formato mais pedido por quem fica o fim de semana.",
    meta: ["2 hóspedes", "Cama de casal", "Ar-condicionado", "Wi-Fi"],
    photo: "Quarto de casal",
    src: "/images/quarto-casal.jpg",
    alt: "Quarto de casal do Hotel Sol Nascente",
    tone: "clay" as const,
  },
  {
    name: "Família",
    tagline: "Para a viagem toda",
    text: "Mais camas, mais espaço e a área de lazer no mesmo terreno. Feito para quem viaja com criança e não quer dividir o dia entre dois endereços.",
    meta: ["Grupos", "Camas adicionais", "Ar-condicionado", "Wi-Fi"],
    photo: "Quarto família",
    src: "/images/quarto-familia.jpg",
    alt: "Quarto família do Hotel Sol Nascente com várias camas",
    tone: "olive" as const,
  },
];

const facilities = [
  { icon: "coffee" as IconName, name: "Café da manhã", note: "Incluído na diária." },
  { icon: "pool" as IconName, name: "Piscina externa", note: "Área de lazer aberta." },
  { icon: "fork" as IconName, name: "Restaurante", note: "Aberto também ao público." },
  { icon: "wifi" as IconName, name: "Wi-Fi gratuito", note: "Em todo o hotel." },
  { icon: "air" as IconName, name: "Ar-condicionado", note: "Nos quartos." },
  { icon: "car" as IconName, name: "Estacionamento", note: "No próprio terreno." },
  { icon: "gym" as IconName, name: "Academia", note: "Para hóspedes." },
  { icon: "pet" as IconName, name: "Aceita pets", note: "Consulte as regras." },
  { icon: "plane" as IconName, name: "Traslado do aeroporto", note: "Sob consulta." },
  { icon: "access" as IconName, name: "Acessível", note: "Estrutura adaptada." },
];

/* Assuntos que mais aparecem nas avaliacoes publicas do Google. Numeros reais. */
const topics = [
  { word: "preço", count: 8 },
  { word: "piscina", count: 5 },
  { word: "custo-benefício", count: 4 },
  { word: "filho", count: 3 },
  { word: "hospedagem", count: 2 },
  { word: "infraestrutura", count: 2 },
  { word: "final de semana", count: 2 },
  { word: "garagem", count: 2 },
];

const purposes = [
  { id: "trabalho", icon: "briefcase" as IconName, label: "A trabalho", note: "Uma ou duas noites, saída cedo." },
  { id: "familia", icon: "users" as IconName, label: "Com a família", note: "Piscina, espaço e criança junto." },
  { id: "casal", icon: "heart" as IconName, label: "A dois", note: "Fim de semana ou lua de mel." },
  { id: "evento", icon: "mic" as IconName, label: "Evento no auditório", note: "Congresso, formatura, casamento." },
];

const parties = [
  { id: "1", label: "1 pessoa" },
  { id: "2", label: "2 pessoas" },
  { id: "3-4", label: "3 ou 4" },
  { id: "grupo", label: "Grupo" },
];

const nights = [
  { id: "1", label: "1 noite" },
  { id: "2-3", label: "2 ou 3 noites" },
  { id: "semana", label: "Uma semana" },
  { id: "aberto", label: "Ainda decidindo" },
];

/* ------------------------------------------------------------------ site */

export function HotelSite() {
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(false);
  const [hour, setHour] = useState(0);
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState<string | null>(null);
  const [party, setParty] = useState<string | null>(null);
  const [stay, setStay] = useState<string | null>(null);
  const [dockHidden, setDockHidden] = useState(false);

  const moment = hours[hour];
  const t = hours.length > 1 ? hour / (hours.length - 1) : 0;
  /* Mesma curva do <path> do arco: y(t) = 100 - 260t + 260t^2. Assim o sol anda em cima da linha. */
  const orbTop = 100 - 260 * t + 260 * t * t;
  const isNight = hour === hours.length - 1;

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-locked", menu);
    return () => document.body.classList.remove("is-locked");
  }, [menu]);

  /*
   * O dock flutuante cobria o botao "Enviar no WhatsApp" do builder no celular.
   * Dentro da secao de reserva ele e redundante, entao sai de cena.
   */
  useEffect(() => {
    const section = document.querySelector("#reservar");
    if (!section) return;
    const observer = new IntersectionObserver((entries) => setDockHidden(entries[0].isIntersecting), { threshold: 0.18 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.14 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  const planMessage = useMemo(() => {
    const chosenPurpose = purposes.find((item) => item.id === purpose);
    const chosenParty = parties.find((item) => item.id === party);
    const chosenStay = nights.find((item) => item.id === stay);
    return [
      "Olá! Vim pelo site do Hotel Sol Nascente e queria consultar disponibilidade.",
      "",
      `Motivo da viagem: ${chosenPurpose ? chosenPurpose.label : "a combinar"}`,
      `Pessoas: ${chosenParty ? chosenParty.label : "a combinar"}`,
      `Tempo de estadia: ${chosenStay ? chosenStay.label : "a combinar"}`,
    ].join("\n");
  }, [purpose, party, stay]);

  const navItems: [string, string][] = [
    ["O dia aqui", "dia"],
    ["Quartos", "quartos"],
    ["Auditório", "auditorio"],
    ["Restaurante", "restaurante"],
    ["Arapiraca", "cidade"],
    ["Reservar", "reservar"],
  ];

  return (
    <main>
      <header className={stuck ? "topbar is-stuck" : "topbar"}>
        <div className="shell topbar-inner">
          <a href="#topo" aria-label="Hotel Sol Nascente, início">
            <Mark />
          </a>
          <nav aria-label="Navegação principal">
            {navItems.slice(0, 5).map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <a className="btn btn--sun" href="#reservar">
            Reservar <Icon name="arrow" />
          </a>
          <button className="burger" type="button" onClick={() => setMenu(true)} aria-label="Abrir menu">
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={menu ? "drawer is-open" : "drawer"} aria-hidden={!menu}>
        <div className="drawer-top">
          <Mark />
          <button type="button" onClick={() => setMenu(false)} aria-label="Fechar menu">
            ×
          </button>
        </div>
        <nav>
          {navItems.map(([label, id], index) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              <i>0{index + 1}</i>
              {label}
            </a>
          ))}
        </nav>
      </div>

      <section className="hero" id="topo">
        <div className="hero-stars" aria-hidden="true" />
        <div className="hero-sun" aria-hidden="true" />
        <div className="shell hero-grid">
          <div data-reveal>
            <span className="eyebrow eyebrow--light">Hotel · Auditório · Restaurante em Arapiraca</span>
            <h1>
              Seu refúgio no
              <em>coração de Arapiraca.</em>
            </h1>
            <p className="hero-lead">
              Piscina, café da manhã na diária e um auditório no mesmo terreno. Fica na AL-220, longe do barulho e perto
              do que traz você à cidade.
            </p>
            <div className="hero-actions">
              <a className="btn btn--green" href="#reservar">
                Consultar uma diária <Icon name="arrow" />
              </a>
              <a className="btn btn--line" href="#auditorio">
                Quero fazer um evento
              </a>
            </div>
            <div className="hero-proof">
              <strong>4,5</strong>
              <span>
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
                <small>219 avaliações no Google</small>
              </span>
              <i className="hero-proof-sep" aria-hidden="true" />
              <em>
                <b>3 estrelas</b>
                classificação do Google
              </em>
            </div>
          </div>
          <div className="hero-card" data-reveal>
            <Slot tag="Entrada do hotel" src="/images/fachada.jpg" alt="Fachada e entrada do Hotel Sol Nascente em Arapiraca" />
          </div>
        </div>
      </section>

      <section
        className={moment.bright ? "sunline section is-bright" : "sunline section"}
        id="dia"
        style={{ background: moment.sky }}
      >
        <div className="shell sunline-inner">
          <div className="sunline-head" data-reveal>
            <div>
              <span className={moment.bright ? "eyebrow" : "eyebrow eyebrow--light"}>A linha do sol</span>
              <h2>Um dia inteiro dentro do hotel.</h2>
            </div>
            <p>
              O hotel se chama Sol Nascente, então a página anda com o sol. Escolha uma hora e veja o que está
              acontecendo aqui nela.
            </p>
          </div>

          <div className="sunline-arc" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 Q 50 -30 100 100" vectorEffect="non-scaling-stroke" />
            </svg>
            <span
              className="sunline-orb"
              style={{
                left: `calc(${t} * (100% - 46px) + 23px)`,
                top: `${orbTop}%`,
                background: isNight
                  ? "radial-gradient(circle at 38% 34%, #f8f4e6, #ded7c2 62%, #b0a992)"
                  : "radial-gradient(circle at 38% 34%, #fff3d0, #f6b465 58%, #e08a3c)",
                boxShadow: isNight ? "0 0 34px rgba(248,240,214,.42)" : "0 0 44px rgba(255,190,110,.62)",
              }}
            />
          </div>

          <div className="sunline-rail" aria-hidden="true">
            <div className="sunline-progress" style={{ width: `${t * 100}%` }} />
          </div>

          <div className="sunline-stops" role="tablist" aria-label="Horas do dia">
            {hours.map((item, index) => (
              <button
                key={item.time}
                type="button"
                role="tab"
                aria-selected={hour === index}
                className={hour === index ? "sunline-stop is-on" : "sunline-stop"}
                onClick={() => setHour(index)}
              >
                <b>{item.time}</b>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="sunline-panel">
            <div className="sunline-copy">
              <h3>{moment.title}</h3>
              <p>{moment.text}</p>
              <ul className="sunline-tags">
                {moment.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <a className="btn btn--sun" href="#reservar">
                Falar com a recepção <Icon name="arrow" />
              </a>
            </div>
            <div className="sunline-photo">
              <Slot tone={moment.tone} tag={moment.photo} src={moment.src} alt={moment.alt} />
            </div>
          </div>

          <p className="sunline-hint">
            <Icon name="sun" /> Toque em uma hora para mudar o céu.
          </p>
        </div>
      </section>

      <section className="rooms section" id="quartos">
        <div className="shell">
          <div className="head" data-reveal>
            <div>
              <span className="eyebrow">Quartos</span>
              <h2>Três formatos, um jeito só de receber.</h2>
            </div>
            <p>
              Todos com ar-condicionado, Wi-Fi e café da manhã na diária. A disponibilidade e o valor mudam com a data,
              então a conversa começa no WhatsApp.
            </p>
          </div>
          <div className="room-grid" data-reveal>
            {rooms.map((room) => (
              <article className="room" key={room.name}>
                <Slot tone={room.tone} tag={room.src ? room.photo : `Foto: ${room.photo}`} src={room.src} alt={room.alt} />
                <div className="room-body">
                  <span className="eyebrow">{room.tagline}</span>
                  <h3>Quarto {room.name}</h3>
                  <p>{room.text}</p>
                  <ul className="room-meta">
                    {room.meta.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <a
                    className="text-link room-cta"
                    href={wa(`Olá! Queria consultar o quarto ${room.name} no Hotel Sol Nascente.`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Consultar este quarto <Icon name="arrow" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="venue section" id="auditorio">
        <div className="shell">
          <div className="head" data-reveal>
            <div>
              <span className="eyebrow eyebrow--light">Auditório Sol Nascente</span>
              <h2>O evento e a hospedagem no mesmo endereço.</h2>
            </div>
            <p>
              É o que separa o Sol Nascente dos outros hotéis de Arapiraca: quem vem de fora para o seu evento dorme a
              poucos metros do salão.
            </p>
          </div>
          <div className="venue-grid" data-reveal>
            <div className="venue-photo">
              <Slot tone="night" tag="Auditório montado" src="/images/auditorio.jpg" alt="Auditório Sol Nascente montado para evento" />
            </div>
            <div>
              <ul className="venue-list">
                <li>
                  <Icon name="chairs" />
                  <div>
                    <b>Espaço próprio, entrada própria</b>
                    <span>O auditório funciona de forma independente do movimento do hotel.</span>
                  </div>
                </li>
                <li>
                  <Icon name="bed" />
                  <div>
                    <b>Bloco de hospedagem para os convidados</b>
                    <span>Quem viaja para o evento resolve dormida e deslocamento de uma vez.</span>
                  </div>
                </li>
                <li>
                  <Icon name="fork" />
                  <div>
                    <b>Restaurante no local</b>
                    <span>Coffee break, almoço e jantar sem contratar buffet de fora.</span>
                  </div>
                </li>
                <li>
                  <Icon name="car" />
                  <div>
                    <b>Estacionamento no terreno</b>
                    <span>Ninguém precisa procurar vaga na AL-220.</span>
                  </div>
                </li>
              </ul>
              <a
                className="btn btn--sun"
                href={wa("Olá! Queria falar com o setor de eventos sobre o Auditório Sol Nascente.")}
                target="_blank"
                rel="noreferrer"
              >
                Falar com o setor de eventos <Icon name="arrow" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="dining section" id="restaurante">
        <div className="shell dining-grid">
          <div className="dining-photos" data-reveal>
            <Slot tone="clay" tag="Salão do restaurante" src="/images/restaurante-salao.jpg" alt="Salão do restaurante do hotel com mesas postas" />
            <Slot tag="Café servido na mesa" src="/images/prato.jpg" alt="Prato do café da manhã servido junto à piscina" />
            <Slot tone="olive" tag="Café da manhã" src="/images/cafe-manha.jpg" alt="Buffet do café da manhã" />
          </div>
          <div className="dining-copy" data-reveal>
            <span className="eyebrow">Restaurante</span>
            <h2>A mesa também é da cidade.</h2>
            <p>
              O restaurante do hotel abre para quem passa na rua, não só para quem tem quarto. É uma decisão antiga da
              casa e mudou o tipo de movimento que acontece aqui no almoço.
            </p>
            <div className="dining-note">
              <strong>Café da manhã incluído na diária.</strong> Para quem não está hospedado, o restaurante funciona
              normalmente. Consulte o cardápio do dia pelo WhatsApp.
            </div>
            <p style={{ marginTop: 24 }}>
              <a
                className="text-link"
                href={wa("Olá! Queria saber sobre o restaurante do Hotel Sol Nascente.")}
                target="_blank"
                rel="noreferrer"
              >
                Perguntar sobre o cardápio <Icon name="arrow" />
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="facilities section">
        <div className="shell">
          <div className="head" data-reveal>
            <div>
              <span className="eyebrow">Estrutura</span>
              <h2>O que já está no hotel.</h2>
            </div>
            <p>Dez itens confirmados na ficha pública do hotel no Google. Nada aqui é promessa de folheto.</p>
          </div>
          <div className="fac-grid" data-reveal>
            {facilities.map((item) => (
              <article className="fac" key={item.name}>
                <Icon name={item.icon} />
                <b>{item.name}</b>
                <span>{item.note}</span>
              </article>
            ))}
          </div>
          <p className="fac-note">
            Traslado do aeroporto e regras para pets variam por período. Confirme com a recepção antes de fechar a
            viagem.
          </p>
        </div>
      </section>

      <section className="rep section">
        <div className="shell rep-grid">
          <div className="rep-score" data-reveal>
            <span className="stars" aria-hidden="true">
              ★★★★★
            </span>
            <strong>4,5</strong>
            <span>219 avaliações públicas no Google</span>
            <a className="text-link" href={maps} target="_blank" rel="noreferrer">
              Ler as avaliações <Icon name="arrowUpRight" />
            </a>
          </div>
          <div className="rep-copy" data-reveal>
            <span className="eyebrow eyebrow--light">Reputação</span>
            <h2>A nota é pública. Os assuntos também.</h2>
            <p>
              Estas são as palavras que mais aparecem nas avaliações de quem se hospedou, com o número de vezes que cada
              uma foi citada. Não escolhemos as frases: é o que o Google agrupa sozinho.
            </p>
            <ul className="rep-topics">
              {topics.map((item) => (
                <li key={item.word}>
                  {item.word} <b>{item.count}×</b>
                </li>
              ))}
            </ul>
            <p className="rep-honest">
              Nem toda avaliação é elogio, e as críticas ficam visíveis no mesmo lugar. A direção do hotel responde
              publicamente às reclamações, e é assim que preferimos: quem está escolhendo onde dormir merece ver os dois
              lados antes de reservar.
            </p>
          </div>
        </div>
      </section>

      <section className="city section" id="cidade">
        <div className="shell city-grid">
          <div className="city-copy" data-reveal>
            <span className="eyebrow">Arapiraca</span>
            <h2>A cidade das bicicletas, no meio do agreste.</h2>
            <p>
              Arapiraca é a segunda maior cidade de Alagoas e o centro do agreste alagoano. Ganhou o apelido de cidade
              das bicicletas pelo tanto de gente que se move sobre duas rodas, e tem uma das maiores feiras livres do
              Nordeste. É para cá que converge quem faz negócio na região.
            </p>
            <div className="city-facts">
              <div>
                <strong>AL-220</strong>
                <span>O hotel fica na rodovia, no Jardim Esperança</span>
              </div>
              <div>
                <strong>2ª</strong>
                <span>Maior cidade de Alagoas</span>
              </div>
              <div>
                <strong>Agreste</strong>
                <span>Clima seco e luz forte o ano inteiro</span>
              </div>
              <div>
                <strong>Feira</strong>
                <span>Uma das maiores feiras livres do Nordeste</span>
              </div>
            </div>
          </div>
          <div className="city-photo" data-reveal>
            <Slot tone="olive" tag="Área externa do hotel" src="/images/area-externa.jpg" alt="Área externa do hotel com quiosque e palmeiras" />
          </div>
        </div>
      </section>

      <section className="plan section" id="reservar">
        <div className="shell plan-grid">
          <div className="plan-copy" data-reveal>
            <span className="eyebrow eyebrow--light">Monte sua estadia</span>
            <h2>Três perguntas e a conversa já começa pronta.</h2>
            <p>
              Não temos motor de reserva online e não vamos fingir que temos. Você responde três coisas, a gente monta a
              mensagem e a recepção continua no WhatsApp com a sua data em mãos.
            </p>
            <div className="plan-contact">
              <a href={`tel:+${phone}`}>
                <Icon name="phone" /> {phoneLabel}
              </a>
              <a href={maps} target="_blank" rel="noreferrer">
                <Icon name="pin" /> AL-220, Jardim Esperança · Arapiraca/AL
              </a>
              <a href={instagram} target="_blank" rel="noreferrer">
                <Icon name="ig" /> @hotelsolnascentearapiraca_
              </a>
            </div>
          </div>

          <div className="builder" data-reveal>
            <div className="builder-steps">
              <span>Passo {Math.min(step + 1, 3)} de 3</span>
              {[0, 1, 2].map((index) => (
                <i key={index} className={step > index ? "is-done" : ""} />
              ))}
            </div>

            {step === 0 && (
              <>
                <h3>O que traz você a Arapiraca?</h3>
                <p className="builder-q">Isso muda o quarto que a recepção vai sugerir.</p>
                <div className="builder-options">
                  {purposes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={purpose === item.id ? "opt is-on" : "opt"}
                      onClick={() => {
                        setPurpose(item.id);
                        setStep(1);
                      }}
                    >
                      <Icon name={item.icon} />
                      <span>
                        <b>{item.label}</b>
                        <small>{item.note}</small>
                      </span>
                      <em aria-hidden="true">→</em>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h3>Quantas pessoas?</h3>
                <p className="builder-q">Conta as crianças também, elas ocupam cama.</p>
                <div className="builder-options is-tight">
                  {parties.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={party === item.id ? "opt is-on" : "opt"}
                      onClick={() => {
                        setParty(item.id);
                        setStep(2);
                      }}
                    >
                      <Icon name="users" />
                      <b>{item.label}</b>
                      <em aria-hidden="true">→</em>
                    </button>
                  ))}
                </div>
                <button className="builder-back" type="button" onClick={() => setStep(0)}>
                  Voltar
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h3>Por quanto tempo?</h3>
                <p className="builder-q">Se ainda não sabe, tudo bem. A recepção ajuda a fechar.</p>
                <div className="builder-options is-tight">
                  {nights.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={stay === item.id ? "opt is-on" : "opt"}
                      onClick={() => {
                        setStay(item.id);
                        setStep(3);
                      }}
                    >
                      <Icon name="moon" />
                      <b>{item.label}</b>
                      <em aria-hidden="true">→</em>
                    </button>
                  ))}
                </div>
                <button className="builder-back" type="button" onClick={() => setStep(1)}>
                  Voltar
                </button>
              </>
            )}

            {step === 3 && (
              <div className="builder-summary">
                <h3>Sua mensagem está pronta.</h3>
                <dl>
                  <dt>Motivo</dt>
                  <dd>{purposes.find((item) => item.id === purpose)?.label}</dd>
                  <dt>Pessoas</dt>
                  <dd>{parties.find((item) => item.id === party)?.label}</dd>
                  <dt>Estadia</dt>
                  <dd>{nights.find((item) => item.id === stay)?.label}</dd>
                </dl>
                <a className="btn btn--sun" href={wa(planMessage)} target="_blank" rel="noreferrer">
                  Enviar no WhatsApp <Icon name="wa" />
                </a>
                <button className="builder-back" type="button" onClick={() => setStep(0)}>
                  Começar de novo
                </button>
                <small>Enviar a mensagem não confirma reserva. A recepção responde com disponibilidade e valor.</small>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="where section">
        <div className="shell where-grid">
          <div className="where-copy" data-reveal>
            <span className="eyebrow">Como chegar</span>
            <h2>Na AL-220, no Jardim Esperança.</h2>
            <address>
              AL-220 · Jardim Esperança
              <br />
              Arapiraca / AL · CEP 57307-610
            </address>
            <a className="btn btn--ink" href={maps} target="_blank" rel="noreferrer">
              Traçar rota no Google Maps <Icon name="arrowUpRight" />
            </a>
          </div>
          <div className="where-map" data-reveal>
            <iframe
              title="Localização do Hotel Sol Nascente em Arapiraca no Google Maps"
              src={mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="shell foot-top">
          <div>
            <Mark />
            <p>
              Hotel, auditório e restaurante em Arapiraca, no agreste de Alagoas. Seu refúgio no coração da cidade.
            </p>
          </div>
          <div className="foot-col">
            <span>Navegue</span>
            {navItems.slice(0, 5).map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </div>
          <div className="foot-col">
            <span>Falar com a gente</span>
            <a href={`tel:+${phone}`}>{phoneLabel}</a>
            <a href={wa("Olá! Vim pelo site e queria falar sobre hospedagem.")} target="_blank" rel="noreferrer">
              WhatsApp reservas
            </a>
            <a href={wa("Olá! Queria falar sobre o Auditório Sol Nascente.")} target="_blank" rel="noreferrer">
              WhatsApp eventos
            </a>
            <a href={instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
          <div className="foot-col">
            <span>Endereço</span>
            <p>
              AL-220 · Jardim Esperança
              <br />
              Arapiraca / AL
              <br />
              CEP 57307-610
            </p>
          </div>
        </div>
        <div className="shell foot-bottom">
          <span>© {new Date().getFullYear()} Hotel Sol Nascente · Arapiraca/AL</span>
          <span>Nota 4,5 com 219 avaliações públicas no Google</span>
        </div>
      </footer>

      <div className={dockHidden ? "dock is-hidden" : "dock"} aria-label="Contato rápido">
        <a className="dock--ig" href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram do hotel">
          <Icon name="ig" />
          <span>Instagram</span>
        </a>
        <a
          className="dock--wa"
          href={wa("Olá! Vim pelo site do Hotel Sol Nascente.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar no WhatsApp"
        >
          <Icon name="wa" />
          <span>WhatsApp</span>
        </a>
      </div>
    </main>
  );
}
