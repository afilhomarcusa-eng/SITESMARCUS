/*
 * Dados revisados em 05/09/2026.
 * Contatos: diretorio publicado no Instagram oficial (linkbio.co/CTAbitah).
 * Enderecos e horarios: fichas publicas do Maps, com divergencias registradas
 * em ../AUDITORIA-DADOS.md. Horarios de funcionamento nao sao horarios de turma.
 */
import { fotosUnidades } from "./fotos-unidades";

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
  localizacaoAproximada?: boolean;
  contatoDescricao?: string;
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
    foto: fotosUnidades["vitoria"].src,
    fotoAlt: "Área de treino da unidade Vitória",
    aberta: true,
  },
  {
    slug: "pituba",
    nome: "Pituba",
    cidade: "Salvador",
    regiao: "Salvador",
    endereco: "R. das Rosas, 492 · Sala 4",
    bairro: "Pituba",
    cep: "41810-070",
    telefone: "(71) 98161-4388",
    whatsapp: "5571981614388",
    lat: -12.9904262,
    lng: -38.4571642,
    nota: null,
    avaliacoes: null,
    horarios: [...semanaPadrao, { dias: "Sábado", horas: "07:15 às 10:15" }, { dias: "Domingo", horas: "Fechado" }],
    instagram: null,
    destaque: "Rua das Rosas",
    sobre:
      "Numa rua residencial da Pituba, longe do barulho da Paulo VI. Turmas pequenas e horário que abre às 5h30 para quem treina antes de tudo.",
    foto: fotosUnidades["pituba"].src,
    fotoAlt: "Acompanhamento de treino apresentado pela Abitah Pituba",
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
    nota: null,
    avaliacoes: null,
    horarios: [
      { dias: "Segunda a sexta", horas: "05:30 às 21:00" },
      { dias: "Sábado", horas: "07:00 às 09:00" },
      { dias: "Domingo", horas: "Fechado" },
    ],
    instagram: "https://www.instagram.com/abitah.patamares/",
    destaque: "Treino em Patamares",
    sobre:
      "Na Rua Bicuíba, a unidade oferece treinamento funcional com acompanhamento. Fale com a equipe para escolher a turma e conhecer os programas disponíveis.",
    foto: fotosUnidades["patamares"].src,
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
    nota: null,
    avaliacoes: null,
    horarios: [...semanaPadrao, { dias: "Sábado", horas: "07:15 às 10:15" }, { dias: "Domingo", horas: "08:00 às 10:00" }],
    instagram: null,
    destaque: "Perto da praia",
    sobre:
      "Na Rua Gilberto Freyre, em Stella Maris. Um espaço para treinar com acompanhamento e encaixar o movimento na rotina do bairro.",
    foto: fotosUnidades["stella-maris"].src,
    fotoAlt: "Área de treino e acompanhamento na unidade Stella Maris",
    aberta: true,
  },
  {
    slug: "vilas-do-atlantico",
    nome: "Vilas do Atlântico",
    cidade: "Lauro de Freitas",
    regiao: "Lauro de Freitas",
    endereco: "R. Praia do Tubarão, 196",
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
    destaque: "No coração de Vilas",
    sobre:
      "Na Rua Praia do Tubarão, em Vilas do Atlântico. Consulte a equipe para conhecer as turmas, os programas e a disponibilidade de aulas.",
    foto: fotosUnidades["vilas-do-atlantico"].src,
    fotoAlt: "Recepção da unidade Vilas do Atlântico",
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
    nota: null,
    avaliacoes: null,
    horarios: [...semanaPadrao, { dias: "Sábado", horas: "07:00 às 10:30" }, { dias: "Domingo", horas: "07:00 às 10:00" }],
    instagram: null,
    destaque: "No Prime Center",
    sobre:
      "No Edifício Prime Center, em Buraquinho. A região também recebe os espaços de Spinning e Flow da rede, em outro endereço na Rua Francisco das Mercês.",
    foto: fotosUnidades["buraquinho"].src,
    fotoAlt: "Sala de treino da unidade Buraquinho",
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
    telefone: "(71) 99736-0060",
    whatsapp: "5571997360060",
    lat: -12.8868403,
    lng: -38.3011965,
    nota: null,
    avaliacoes: null,
    horarios: null,
    instagram: null,
    destaque: "A mais nova da rede",
    sobre:
      "Treino em cobertura em Vilas do Atlântico. Fale com o atendimento da rede para confirmar o acesso, os horários e agendar sua experiência no Rooftop.",
    foto: fotosUnidades["vilas-roof-top"].src,
    fotoAlt: "Área de treino do Rooftop em Vilas do Atlântico",
    aberta: true,
    localizacaoAproximada: true,
    contatoDescricao: "Atendimento da rede",
  },
  {
    slug: "feira-de-santana",
    nome: "Feira de Santana",
    cidade: "Feira de Santana",
    regiao: "Feira de Santana",
    endereco: "Av. Artêmia Pires Freitas, 9000",
    bairro: "Sim",
    cep: "44085-370",
    telefone: "(71) 99952-1106",
    whatsapp: "5571999521106",
    lat: -12.2467009,
    lng: -38.9049844,
    nota: null,
    avaliacoes: null,
    horarios: [
      { dias: "Segunda a sexta", horas: "05:15 às 21:00" },
      { dias: "Sábado", horas: "08:30 às 10:30" },
      { dias: "Domingo", horas: "08:00 às 09:00" },
    ],
    instagram: null,
    destaque: "A única fora da região metropolitana",
    sobre:
      "Na Avenida Artêmia Pires Freitas, no bairro Sim. O contato publicado pela rede orienta sobre as turmas e o agendamento da unidade de Feira de Santana.",
    foto: fotosUnidades["feira-de-santana"].src,
    fotoAlt: "Fachada da unidade de Feira de Santana",
    aberta: true,
  },
];

export function getUnidade(slug: string) {
  return unidades.find((u) => u.slug === slug);
}

/** As modalidades vieram da home do site oficial da rede. */
export const modalidades = [
  {
    foto: "/images/sala.jpg",
    nome: "Funcional",
    texto: "A base da casa. Movimento que serve para a vida fora daqui, em turma pequena e com correção o tempo todo.",
  },
  {
    foto: "/images/kettlebell.jpg",
    nome: "Performance",
    texto: "Para quem já treina e quer número: carga, tempo, potência. O acompanhamento vira plano individual.",
  },
  {
    foto: "/images/recepcao.jpg",
    nome: "Spinning",
    texto: "Sala própria, bike e volume. Serve tanto de cardio para quem faz funcional quanto de treino inteiro.",
  },
  {
    foto: "/images/feira-sala.jpg",
    nome: "Corrida",
    texto: "Assessoria de rua com o pessoal da unidade. Sai do centro de treinamento e vai para o asfalto junto.",
  },
  {
    foto: "/images/vilas-roof-top.jpg",
    nome: "Weekend",
    texto: "Os horários de sábado e domingo, que quase toda unidade abre. Treino mais longo, ritmo mais solto.",
  },
  {
    foto: "/images/buraquinho.jpg",
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
