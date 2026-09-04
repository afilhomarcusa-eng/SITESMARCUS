/*
 * As oito unidades do CT Abitah.
 *
 * A lista veio da placa da propria marca, fotografada na fachada da unidade de
 * Feira de Santana: SALVADOR (Vitoria, Pituba, Patamares, Stella) ·
 * LAURO DE FREITAS (Vilas do Atlantico, Buraquinho, Vilas Roof Top) ·
 * FEIRA DE SANTANA (Sim).
 *
 * Endereco, telefone, nota e horario de cada uma vieram da ficha publica da
 * unidade no Google Maps, conferida em 04/09/2026. Nada aqui foi inventado:
 * onde o Google nao publica, o campo fica nulo e o site diz que falta.
 */

export type Unidade = {
  slug: string;
  nome: string;
  cidade: string;
  regiao: "Salvador" | "Lauro de Freitas" | "Feira de Santana";
  endereco: string;
  bairro: string;
  cep: string | null;
  telefone: string | null;
  whatsapp: string | null;
  lat: number;
  lng: number;
  nota: number | null;
  avaliacoes: number | null;
  horarios: { dias: string; horas: string }[] | null;
  instagram: string | null;
  destaque: string;
  sobre: string;
  foto: string | null;
  fotoAlt: string;
  aberta: boolean;
};

/** Monta o link do WhatsApp com a mensagem ja escrita para aquela unidade. */
export function waLink(numero: string, mensagem: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export function telHref(telefone: string) {
  return `tel:+55${telefone.replace(/\D/g, "")}`;
}

/** Embed do Google Maps centrado na unidade. Nao precisa de chave de API. */
export function mapaEmbed(u: Unidade) {
  return `https://www.google.com/maps?q=${u.lat},${u.lng}&z=17&output=embed`;
}

export function mapaLink(u: Unidade) {
  return `https://www.google.com/maps/search/?api=1&query=${u.lat},${u.lng}`;
}

const semanaPadrao = [
  { dias: "Segunda a quinta", horas: "05:30 às 21:00" },
  { dias: "Sexta", horas: "05:30 às 20:00" },
];

export const unidades: Unidade[] = [
  {
    slug: "vitoria",
    nome: "Vitória",
    cidade: "Salvador",
    regiao: "Salvador",
    endereco: "Av. Sete de Setembro, 2604 · 1º andar",
    bairro: "Vitória",
    cep: "40080-005",
    telefone: "(71) 99907-1306",
    whatsapp: "5571999071306",
    lat: -12.9959113,
    lng: -38.527371,
    nota: null,
    avaliacoes: null,
    horarios: [...semanaPadrao, { dias: "Sábado", horas: "07:30 às 09:30" }, { dias: "Domingo", horas: "Fechado" }],
    instagram: null,
    destaque: "No Corredor da Vitória",
    sobre:
      "Fica no primeiro andar, na Sete de Setembro, entre o Campo Grande e a Barra. É a unidade de quem treina antes do escritório e não quer atravessar a cidade para isso.",
    foto: "/images/vitoria.jpg",
    fotoAlt: "Área de treino da unidade Vitória",
    aberta: true,
  },
  {
    slug: "pituba",
    nome: "Pituba",
    cidade: "Salvador",
    regiao: "Salvador",
    endereco: "R. das Rosas, 492",
    bairro: "Pituba",
    cep: "41810-070",
    telefone: "(71) 98265-0833",
    whatsapp: "5571982650833",
    lat: -12.9904262,
    lng: -38.4571642,
    nota: null,
    avaliacoes: null,
    horarios: [...semanaPadrao, { dias: "Sábado", horas: "07:15 às 10:15" }, { dias: "Domingo", horas: "Fechado" }],
    instagram: null,
    destaque: "Rua das Rosas",
    sobre:
      "Numa rua residencial da Pituba, longe do barulho da Paulo VI. Turmas pequenas e horário que abre às 5h30 para quem treina antes de tudo.",
    foto: null,
    fotoAlt: "Unidade Pituba",
    aberta: true,
  },
  {
    slug: "patamares",
    nome: "Patamares",
    cidade: "Salvador",
    regiao: "Salvador",
    endereco: "R. Bicuíba, 608",
    bairro: "Patamares",
    cep: "41680-050",
    telefone: "(71) 98158-3232",
    whatsapp: "5571981583232",
    lat: -12.9566953,
    lng: -38.4063145,
    nota: 3.7,
    avaliacoes: 3,
    horarios: [
      { dias: "Segunda a sexta", horas: "05:30 às 21:00" },
      { dias: "Sábado", horas: "07:00 às 09:00" },
      { dias: "Domingo", horas: "Fechado" },
    ],
    instagram: "https://www.instagram.com/abitah.patamares/",
    destaque: "A primeira franquia",
    sobre:
      "Foi a primeira unidade franqueada do CT Abitah, e é onde o modelo foi provado antes de virar rede. Funcional, performance e aulas personalizadas, num ambiente que o Google marca como acolhedor para a comunidade LGBTQ+.",
    foto: "/images/patamares.jpg",
    fotoAlt: "Sala de treino da unidade Patamares",
    aberta: true,
  },
  {
    slug: "stella-maris",
    nome: "Stella Maris",
    cidade: "Salvador",
    regiao: "Salvador",
    endereco: "Rua Gilberto Freyre",
    bairro: "Stella Maris",
    cep: "41600-970",
    telefone: "(71) 99936-1307",
    whatsapp: "5571999361307",
    lat: -12.9372295,
    lng: -38.3316777,
    nota: 4.3,
    avaliacoes: 6,
    horarios: [...semanaPadrao, { dias: "Sábado", horas: "07:15 às 10:15" }, { dias: "Domingo", horas: "08:00 às 10:00" }],
    instagram: null,
    destaque: "Perto da praia",
    sobre:
      "A poucos minutos da praia de Stella Maris, e uma das que abrem no domingo de manhã. Combina bem com quem termina o treino e emenda no mar.",
    foto: "/images/stella-maris.jpg",
    fotoAlt: "Turma reunida na unidade Stella Maris",
    aberta: true,
  },
  {
    slug: "vilas-do-atlantico",
    nome: "Vilas do Atlântico",
    cidade: "Lauro de Freitas",
    regiao: "Lauro de Freitas",
    endereco: "R. Praia do Tubarão",
    bairro: "Vilas do Atlântico",
    cep: "42708-730",
    telefone: "(71) 99952-1106",
    whatsapp: "5571999521106",
    lat: -12.8868403,
    lng: -38.3011965,
    nota: null,
    avaliacoes: null,
    horarios: [
      { dias: "Segunda a quinta", horas: "05:15 às 21:15" },
      { dias: "Sexta", horas: "05:15 às 20:15" },
      { dias: "Sábado", horas: "07:15 às 10:15" },
      { dias: "Domingo", horas: "07:30 às 09:30" },
    ],
    instagram: null,
    destaque: "Abre 05:15, a mais cedo da rede",
    sobre:
      "É a unidade que abre mais cedo e fecha mais tarde de toda a rede, e a única com horário nos sete dias da semana. Fica dentro de Vilas, em rua de bairro.",
    foto: "/images/vilas-do-atlantico.jpg",
    fotoAlt: "Área de treino da unidade Vilas do Atlântico",
    aberta: true,
  },
  {
    slug: "buraquinho",
    nome: "Buraquinho",
    cidade: "Lauro de Freitas",
    regiao: "Lauro de Freitas",
    endereco: "Ed. Prime Center · R. Francisco das Mercês, 43, sala 207",
    bairro: "Loteamento Miragem",
    cep: "42700-000",
    telefone: "(71) 99685-0701",
    whatsapp: "5571996850701",
    lat: -12.8738924,
    lng: -38.3007407,
    nota: 5,
    avaliacoes: 15,
    horarios: [...semanaPadrao, { dias: "Sábado", horas: "07:00 às 10:30" }, { dias: "Domingo", horas: "07:00 às 10:00" }],
    instagram: null,
    destaque: "Nota 5,0 no Google",
    sobre:
      "A unidade mais bem avaliada da rede: 5,0 com quinze avaliações públicas. Fica no Prime Center, e é onde funcionam também as salas de Spinning e Flow, a 200 metros dali.",
    foto: "/images/buraquinho.jpg",
    fotoAlt: "Turma reunida na unidade Buraquinho",
    aberta: true,
  },
  {
    slug: "vilas-roof-top",
    nome: "Vilas Roof Top",
    cidade: "Lauro de Freitas",
    regiao: "Lauro de Freitas",
    endereco: "Vilas do Atlântico",
    bairro: "Vilas do Atlântico",
    cep: null,
    telefone: null,
    whatsapp: "5571999521106",
    lat: -12.8858,
    lng: -38.3025,
    nota: null,
    avaliacoes: null,
    horarios: null,
    instagram: null,
    destaque: "A mais nova da rede",
    sobre:
      "Treino em cobertura, aberto, em Vilas do Atlântico. É a unidade mais recente e ainda não tem ficha própria no Google, então endereço exato e horário saem pelo WhatsApp de Vilas.",
    foto: null,
    fotoAlt: "Unidade Vilas Roof Top",
    aberta: true,
  },
  {
    slug: "feira-de-santana",
    nome: "Sim",
    cidade: "Feira de Santana",
    regiao: "Feira de Santana",
    endereco: "Av. Artêmia Pires Freitas, 9000",
    bairro: "Sim",
    cep: "44085-370",
    telefone: "(75) 99929-9473",
    whatsapp: "5575999299473",
    lat: -12.2467009,
    lng: -38.9049844,
    nota: 5,
    avaliacoes: 7,
    horarios: [
      { dias: "Segunda a sexta", horas: "05:15 às 21:00" },
      { dias: "Sábado", horas: "08:30 às 10:30" },
      { dias: "Domingo", horas: "08:00 às 09:00" },
    ],
    instagram: null,
    destaque: "A única fora da região metropolitana",
    sobre:
      "Fica no bairro Sim, na Artêmia Pires, a cerca de cem quilômetros de Salvador. É a primeira unidade da rede no interior da Bahia, e tem 5,0 no Google.",
    foto: "/images/feira-de-santana.jpg",
    fotoAlt: "Turma reunida na unidade de Feira de Santana",
    aberta: true,
  },
];

export function getUnidade(slug: string) {
  return unidades.find((u) => u.slug === slug);
}

/** As modalidades vieram da home do site oficial da rede. */
export const modalidades = [
  {
    nome: "Funcional",
    texto: "A base da casa. Movimento que serve para a vida fora daqui, em turma pequena e com correção o tempo todo.",
  },
  {
    nome: "Performance",
    texto: "Para quem já treina e quer número: carga, tempo, potência. O acompanhamento vira plano individual.",
  },
  {
    nome: "Spinning",
    texto: "Sala própria, bike e volume. Serve tanto de cardio para quem faz funcional quanto de treino inteiro.",
  },
  {
    nome: "Corrida",
    texto: "Assessoria de rua com o pessoal da unidade. Sai do centro de treinamento e vai para o asfalto junto.",
  },
  {
    nome: "Weekend",
    texto: "Os horários de sábado e domingo, que quase toda unidade abre. Treino mais longo, ritmo mais solto.",
  },
  {
    nome: "Abitah Day",
    texto: "O dia em que as unidades se encontram. É onde a rede deixa de ser oito endereços e vira uma turma só.",
  },
];

/* Contatos da rede, do rodape do site oficial. */
export const rede = {
  telefone: "(71) 99736-0060",
  whatsapp: "5571997360060",
  email: "contato@abitahoficial.com.br",
  instagram: "https://www.instagram.com/ctabitah/",
  seguidores: "18,4 mil",
  siteOficial: "https://abitahoficial.com.br",
};
