// A conversa começa no WhatsApp, com a mensagem já escrita. O Instagram fica só
// para acompanhar o dia a dia. Trocar o número aqui troca em todos os CTAs.
const primeiraMensagem = "Olá! Vim pelo site da Thadeu Melo Team e quero saber como começar a treinar com o clube.";
export const club = {
  name: "Thadeu Melo Team",
  instagram: "https://www.instagram.com/thadeumeloteam/",
  whatsappNumber: "5579998276343",
  whatsapp: "https://wa.me/5579998276343?text=" + encodeURIComponent(primeiraMensagem),
  whatsappLabel: "+55 79 99827-6343",
  city: "Aracaju, SE",
  tagline: "A cidade é a nossa pista.",
};

// De onde vem cada foto. Nada aqui é ilustração genérica: são registros do clube
// e da corrida em Aracaju, e o crédito aparece na página, na seção 03.
export const sources = {
  arquivo: { href: "https://www.jornaldacidade.net/inbox/2018/05/300987/thadeu-melo-comanda-time-de-corrida.html", label: "Jornal da Cidade" },
  atlet: { href: "https://www.atletstore.com.br/correr-em-descidas/", label: "Atlet" },
  unit: { href: "https://portal.unit.br/blog/noticias/corrida-tiradentes-inova-com-desafio-de-6-horas-de-revezamento/", label: "Unit" },
};

// Cada seção tem a sua foto, e cada foto tem o seu arquivo. `w` e `h` são o
// tamanho real do webp gerado em scripts/prepare-assets.mjs, conferido contra o
// espaço de layout em public/images/manifest.json: nenhuma é pedida acima do que
// existe. Quando chegarem fotos novas do clube, é trocar `src`, `alt` e as
// medidas aqui, rodar `npm run assets` e o layout acompanha.
export type Photo = { src: string; alt: string; w: number; h: number; caption?: string };
export const photos = {
  orla: {
    src: "/images/orla-corrida.webp", w: 852, h: 1065,
    alt: "Corredor em treino na orla de Aracaju, entre coqueiros e a avenida",
    caption: "Orla de Aracaju / Foto Atlet",
  },
  vertical: {
    src: "/images/pista-vertical.webp", w: 575, h: 767,
    alt: "Três corredores em prova na pista de atletismo da Unit, ao entardecer",
    caption: "Desafio Tiradentes / Foto Unit",
  },
  dupla: {
    src: "/images/pista-dupla.webp", w: 700, h: 572,
    alt: "Dois corredores lado a lado na pista de atletismo da Unit, durante o Desafio Tiradentes",
    caption: "Desafio Tiradentes / Foto Unit",
  },
  grupo: {
    src: "/images/pista-grupo.webp", w: 1220, h: 893,
    alt: "Quatro corredores espalhados pela pista de atletismo da Unit durante o revezamento de 2024",
    caption: "Desafio Tiradentes, 2024",
  },
  equipe: {
    src: "/images/equipe-2018.webp", w: 420, h: 300,
    alt: "Corredores da Thadeu Melo Team reunidos com a tenda e a bandeira do clube, em registro de 2018",
    caption: "Arquivo do clube, 2018",
  },
  solo: {
    src: "/images/pista-solo.webp", w: 504, h: 324,
    alt: "Corredora sozinha na raia da pista de atletismo, no fim da tarde",
    caption: "Na pista / Foto Unit",
  },
  largada: {
    src: "/images/pista-largada.webp", w: 640, h: 460,
    alt: "Corredores na largada da pista de atletismo durante o Desafio Tiradentes",
    caption: "Revezamento de 6 horas",
  },
} satisfies Record<string, Photo>;

export const week = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;
export const locations = [
  {
    id: "13-de-julho", name: "13 de Julho", short: "13 de Julho",
    days: ["Ter", "Qui"], description: "Dois períodos no mesmo dia, para a corrida caber na sua rotina.",
    map: "13 de Julho, Aracaju, Sergipe",
    sessions: [{ days: "Terça e quinta", time: "5h30 às 7h30", period: "Manhã" }, { days: "Terça e quinta", time: "17h às 20h", period: "Tarde e noite" }],
  },
  {
    id: "atalaia", name: "Orla de Atalaia", short: "Orla de Atalaia",
    days: ["Ter", "Qui", "Sáb"], description: "Começo de dia na orla durante a semana, e a manhã inteira no sábado.",
    map: "Orla de Atalaia, Aracaju, Sergipe",
    sessions: [{ days: "Terça e quinta", time: "4h30 às 6h30", period: "Manhã" }, { days: "Sábado", time: "5h30 às 8h", period: "Manhã" }],
  },
  {
    id: "sementeira", name: "Parque da Sementeira", short: "Sementeira",
    days: ["Seg", "Qua"], description: "A semana abre em movimento, no parque, antes de o dia começar.",
    map: "Parque da Sementeira, Aracaju, Sergipe",
    sessions: [{ days: "Segunda e quarta", time: "5h às 7h", period: "Manhã" }],
  },
];

// Os números da seção 03 saem da própria agenda, não de estimativa: se um
// horário mudar em `locations`, eles mudam junto. `encontros` conta cada dia de
// cada sessão ("Terça e quinta" são dois), `dias` é a semana coberta.
const encontros = locations.reduce((total, item) =>
  total + item.sessions.reduce((soma, sessao) => soma + sessao.days.split(" e ").length, 0), 0);
const dias = new Set(locations.flatMap(item => item.days));
export const stats = [
  { value: String(locations.length), label: "pontos de treino", note: locations.map(item => item.short).join(", ") },
  { value: String(dias.size), label: "dias por semana", note: week.filter(day => dias.has(day)).join(", ") },
  { value: String(encontros), label: "encontros por semana", note: "somando os três pontos" },
  { value: "2018", label: "primeiro registro", note: "matéria do Jornal da Cidade" },
];

// A linha do tempo só carrega o que tem fonte pública. Cada item aponta para ela.
export const timeline = [
  { when: "2018", title: "O time vira notícia", text: "O Jornal da Cidade registra o time de corrida comandado por Thadeu Melo em Aracaju. A foto de arquivo desta página é desse período.", source: sources.arquivo },
  { when: "2024", title: "Seis horas na pista", text: "O Desafio Tiradentes reuniu 15 equipes na pista de atletismo da Unit, em revezamento de seis horas. As fotos de pista desta página vêm dessa cobertura.", source: sources.unit },
  { when: "Hoje", title: "Três pontos, cinco dias", text: "A semana do clube cobre a 13 de Julho, a Orla de Atalaia e o Parque da Sementeira. A porta de entrada continua sendo uma conversa antes do primeiro treino." },
];

// Como alguém entra no clube, do jeito que a equipe conduz hoje.
export const steps = [
  { title: "Você conta sua rotina", text: "Pelo formulário ou direto no WhatsApp: como está seu ritmo hoje, quantos dias você tem na semana e qual região fica melhor." },
  { title: "A equipe indica o ponto", text: "Entre os três locais, qual encaixa no seu horário. Você recebe o dia, a hora e o que levar no primeiro treino." },
  { title: "Você aparece", text: "Confirma o ponto de encontro com a equipe e vai. O primeiro treino serve para conhecer o grupo e o seu ritmo." },
];

// As opções do formulário em /cadastro. Elas viram a mensagem que chega no
// WhatsApp do clube, então cada rótulo é escrito para ser lido lá do outro lado.
export const signup = {
  levels: ["Nunca corri", "Corro sozinho", "Volto depois de uma pausa", "Já treino com grupo"],
  goals: ["Começar a correr", "Voltar a correr", "Melhorar meu ritmo", "Preparar uma prova"],
  periods: ["Manhã cedo", "Fim de tarde", "Sábado", "Tenho flexibilidade"],
};

export const faqs = [
  { question: "Estou começando a correr. Dá para entrar assim mesmo?", answer: "Dá. Chame a equipe no WhatsApp e conte como está sua rotina hoje, se você já corre e onde quer chegar. A partir daí o clube orienta o ponto de partida e combina com você o primeiro encontro." },
  { question: "Onde e em quais dias acontecem os treinos?", answer: "Na 13 de Julho, terça e quinta. Na Orla de Atalaia, terça, quinta e sábado. No Parque da Sementeira, segunda e quarta. Os horários de cada local estão na agenda acima." },
  { question: "Como consulto os planos e valores?", answer: "Peça à equipe pelo WhatsApp. Conte sua disponibilidade e o local que funciona melhor para você, e o clube passa as condições atuais e o que está incluído no acompanhamento." },
  { question: "Posso aparecer direto no ponto de encontro?", answer: "Combine a primeira ida com a equipe antes. Assim você confirma o ponto exato, o horário do dia e o que levar. A programação muda em feriados, dias de prova e por conta do tempo." },
];
