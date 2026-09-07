/**
 * Fonte única de todo dado de contato do site.
 * Nada de telefone ou endereço escrito solto em componente.
 *
 * Tudo aqui foi conferido em 07/09/2026 no perfil do Google e na própria
 * fachada da loja, que traz o WhatsApp e o Instagram pintados no letreiro.
 */

export const EMPRESA = {
  nome: "Delux Motors",
  cidade: "Salvador",
  estado: "BA",
  endereco: "Av. Octávio Mangabeira, 20, Loja 20",
  bairro: "Boca do Rio",
  cep: "41706-690",
  lat: -12.9775529,
  lng: -38.4241148,
  instagram: "deluxmotorsba",
  /** Assinatura do próprio perfil deles. */
  assinatura: "Exclusividade ao seu alcance",
} as const;

export const ENDERECO_LINHA = `${EMPRESA.endereco}, ${EMPRESA.bairro}, ${EMPRESA.cidade} - ${EMPRESA.estado}, ${EMPRESA.cep}`;

/**
 * Um número só, e ele é celular: 55 + DDD 71 + 9 dígitos = 13.
 * É o mesmo que está escrito na fachada, ao lado do ícone do WhatsApp.
 */
export const CONTATO = {
  e164: "5571983402324",
  exibicao: "(71) 98340-2324",
  tel: "tel:+5571983402324",
} as const;

export function whatsapp(mensagem: string) {
  return `https://wa.me/${CONTATO.e164}?text=${encodeURIComponent(mensagem)}`;
}

/** Semana inteira confirmada no Google, inclusive sábado e domingo. */
export const HORARIO = {
  semana: "Segunda a sexta, das 09:00 às 18:00",
  sabado: "Sábado, das 09:00 às 14:00",
  domingo: "Domingo fechado",
  linhas: [
    { dia: "Segunda a sexta", hora: "09:00 às 18:00" },
    { dia: "Sábado", hora: "09:00 às 14:00" },
    { dia: "Domingo", hora: "Fechado" },
  ],
  schema: ["Mo-Fr 09:00-18:00", "Sa 09:00-14:00"],
} as const;

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Delux+Motors&query_place_id=";

/** Link direto para traçar rota até a loja. */
export const ROTA_URL = `https://www.google.com/maps/dir/?api=1&destination=${EMPRESA.lat},${EMPRESA.lng}`;

/**
 * Os três serviços saíram dos próprios posts deles, que são exatamente estes
 * três: Compra, Venda e Consignação. A página inteira é organizada em cima
 * disso, porque é assim que o negócio funciona de verdade.
 */
export const SERVICOS = [
  {
    id: "comprar",
    verbo: "Comprar",
    titulo: "Quero comprar um carro",
    resumo:
      "Carros selecionados, com procedência conferida antes de entrar na loja.",
    mensagem: "Olá! Vim pelo site e quero comprar um carro. Podem me mostrar o que tem?",
  },
  {
    id: "vender",
    verbo: "Vender",
    titulo: "Quero vender o meu",
    resumo:
      "Avaliamos o seu carro e fechamos a compra. Você sai com o negócio resolvido.",
    mensagem: "Olá! Vim pelo site e quero vender o meu carro. Como funciona a avaliação?",
  },
  {
    id: "consignar",
    verbo: "Consignar",
    titulo: "Quero deixar em consignação",
    resumo:
      "Seu carro fica exposto na loja e a gente cuida da venda inteira para você.",
    mensagem:
      "Olá! Vim pelo site e quero deixar meu carro em consignação. Como funciona?",
  },
] as const;
