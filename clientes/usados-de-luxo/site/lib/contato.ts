/**
 * Fonte única de todo dado de contato do site.
 * Nada de telefone ou endereço escrito solto em componente.
 *
 * Os números foram conferidos dígito a dígito em 07/09/2026:
 * celular no Brasil em formato internacional tem 13 dígitos (55 + DDD + 9 dígitos),
 * fixo tem 12 (55 + DDD + 8 dígitos). O script de QA reconfere isso a cada build.
 */

export const EMPRESA = {
  nome: "Usados de Luxo",
  nomeCompleto:
    "Usados de Luxo - Venda de Veiculos, Veiculos Importados, Usados de Luxo, Carros Importados",
  cidade: "Goiânia",
  estado: "GO",
  endereco: "R. S-2, QD S-4, Lote 05",
  bairro: "Setor Bela Vista",
  cep: "74823-430",
  lat: -16.7147597,
  lng: -49.262889,
  /** Nota do Google coletada em 07/09/2026. Sempre exibir com a data. */
  googleNota: 4.5,
  googleNotaColetadaEm: "07/09/2026",
  instagram: "usadosdeluxobrasil",
  instagramSeguidores: "382 mil",
  youtube: "https://www.youtube.com/channel/UCNS45Cw4WOtSWQJlzsKiCGA",
} as const;

export const ENDERECO_LINHA = `${EMPRESA.endereco}, ${EMPRESA.bairro}, ${EMPRESA.cidade} - ${EMPRESA.estado}, ${EMPRESA.cep}`;

/** Fixo da loja. 12 dígitos com o 55. */
export const TELEFONE = {
  e164: "556234346026",
  exibicao: "(62) 3434-6026",
  tel: "tel:+556234346026",
} as const;

/**
 * Equipe que atende, com os números que existem de verdade no link da bio.
 * Kamilla e Claudia ficaram de fora de propósito: o número delas na bio
 * (556291587028) tem 12 dígitos e nenhum celular brasileiro tem 12.
 */
export const EQUIPE = [
  {
    nome: "Sérgio",
    papel: "Vendas",
    e164: "5562984081074",
    exibicao: "(62) 98408-1074",
  },
  {
    nome: "Luany",
    papel: "Financiamento",
    e164: "5562998211020",
    exibicao: "(62) 99821-1020",
  },
  {
    nome: "Eduardo",
    papel: "Vendas",
    e164: "5562993757336",
    exibicao: "(62) 99375-7336",
  },
] as const;

/** Quem recebe o clique principal do site. */
export const WHATSAPP_PRINCIPAL = EQUIPE[0];

export function whatsapp(mensagem: string, e164: string = WHATSAPP_PRINCIPAL.e164) {
  return `https://wa.me/${e164}?text=${encodeURIComponent(mensagem)}`;
}

/** Horário confirmado no Google. Sábado ainda não foi confirmado pelo cliente. */
export const HORARIO = {
  linha: "Segunda a sexta, das 08:00 às 18:00",
  abre: "08:00",
  fecha: "18:00",
  /** Formato schema.org. Só os dias que estão confirmados entram aqui. */
  schema: ["Mo-Fr 08:00-18:00"],
} as const;

export const MAPS_URL =
  "https://www.google.com/maps/place/?q=place_id:ChIJ4cJy9TLxXpMRfurPbF35cr8";
