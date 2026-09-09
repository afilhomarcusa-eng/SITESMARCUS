/**
 * Fonte da verdade do site.
 * Tudo aqui foi conferido no Google Business Profile e no Instagram da Milleny
 * em 09/09/2026. Nenhum componente guarda fato solto: se um dado nao esta aqui,
 * ele nao aparece no site.
 */

export const negocio = {
  nome: "Milleny França",
  nomeCompleto: "Psicóloga Milleny França",
  categoria: "Psicóloga infantil",
  crp: "CRP 19/3459",
  /** Bio do Instagram, palavras dela. */
  foco: "Intervenção precoce",
  bio: "Apoio ao desenvolvimento com acolhimento e ciência.",
  cidade: "Aracaju",
  estado: "SE",
} as const;

export const contato = {
  /** (79) 99831-4942, no perfil do Google. 13 digitos no formato internacional. */
  whatsappDigitos: "5579998314942",
  telefoneExibicao: "(79) 99831-4942",
  telefoneTel: "+5579998314942",
  instagramUsuario: "psi.millenyfranca",
  instagramUrl: "https://www.instagram.com/psi.millenyfranca/",
  mapsUrl:
    "https://www.google.com/maps/place/Psic%C3%B3loga+Milleny+Fran%C3%A7a/@-10.9450479,-37.0610386,17z/data=!3m1!4b1!4m6!3m5!1s0x71ab3aac2b4e605:0xbd03c913aad76b8f!8m2!3d-10.9450479!4d-37.0610386!16s%2Fg%2F11p99h47fd",
} as const;

export const endereco = {
  logradouro: "Av. Dr. José Machado de Souza, 120",
  bairro: "Jardins",
  cidade: "Aracaju",
  estado: "SE",
  cep: "49025-740",
  latitude: -10.9450479,
  longitude: -37.0610386,
  linhaUnica:
    "Av. Dr. José Machado de Souza, 120, Jardins, Aracaju, SE, 49025-740",
} as const;

/** Horario publicado no Google. Sabado e domingo aparecem como fechado. */
export const horarios = [
  { dia: "Segunda", abre: "08:00", fecha: "19:00" },
  { dia: "Terça", abre: "08:00", fecha: "19:00" },
  { dia: "Quarta", abre: "08:00", fecha: "19:00" },
  { dia: "Quinta", abre: "08:00", fecha: "19:00" },
  { dia: "Sexta", abre: "08:00", fecha: "19:00" },
  { dia: "Sábado", abre: null, fecha: null },
  { dia: "Domingo", abre: null, fecha: null },
] as const;

/** Comodidades listadas na aba "Sobre" do perfil do Google. */
export const estrutura = [
  "Entrada acessível para cadeira de rodas",
  "Banheiro acessível para cadeira de rodas",
  "Estacionamento acessível para cadeira de rodas",
] as const;

/** Tambem do perfil do Google, em "Planejamento". */
export const agendamentoRecomendado = "É recomendado marcar hora";

export type Foto = {
  arquivo: string;
  larguraNativa: number;
  alturaNativa: number;
  alt: string;
  fonte: string;
};

/**
 * As duas unicas fotos publicas da Milleny no perfil do Google.
 * Cada uma aparece uma vez so na pagina. As outras quatro fotos que o Maps
 * mostrava eram do carrossel "Lugares tambem pesquisados", de outros
 * consultorios, e por isso ficaram de fora.
 */
export const fotos: Record<"hero" | "sobre", Foto> = {
  hero: {
    arquivo: "milleny-livro-rede",
    larguraNativa: 3648,
    alturaNativa: 5472,
    alt: "Milleny França sentada em uma rede colorida, sorrindo enquanto lê um livro pop-up de animais.",
    fonte: "Perfil da Milleny no Google",
  },
  sobre: {
    arquivo: "milleny-livro-comportamento",
    larguraNativa: 1170,
    alturaNativa: 1164,
    alt: "Milleny França de pé na sala de atendimento, lendo um livro de modificação de comportamento, com brinquedos ao fundo.",
    fonte: "Perfil da Milleny no Google",
  },
};

const mensagemPadrao =
  "Olá, Milleny. Vim pelo site e gostaria de saber sobre horários para atendimento.";

export function linkWhatsApp(mensagem: string = mensagemPadrao) {
  return `https://wa.me/${contato.whatsappDigitos}?text=${encodeURIComponent(mensagem)}`;
}

/** Numeros calculados a partir dos dados acima. Nada digitado a mao. */
export const diasAbertos = horarios.filter((h) => h.abre !== null);
export const totalDiasAbertos = diasAbertos.length;
export const horaAbre = diasAbertos[0]?.abre ?? null;
export const horaFecha = diasAbertos[0]?.fecha ?? null;
