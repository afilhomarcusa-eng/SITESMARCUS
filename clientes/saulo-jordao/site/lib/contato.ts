/**
 * Todo dado de negócio mora aqui. Componente não guarda dado solto.
 *
 * Cada campo abaixo tem fonte declarada. O que não tem fonte não existe no site:
 * não há endereço porque ele não publica endereço, não há horário porque ele não
 * publica horário, e inventar qualquer um dos dois seria mandar um cliente para
 * uma porta que não abre.
 */

export const EMPRESA = {
  nome: "Saulo Jordão",
  assinatura: "Saulo Jordão Premium Cars",
  /** Fonte: página "Quem somos" do site atual. */
  atividade: "Corretor de veículos premium",
  /** Fonte: página "Quem somos" do site atual, "Saulo Jordão é um aracajuano". */
  cidade: "Aracaju",
  estado: "Sergipe",
  uf: "SE",
  /** Fonte: "Corretor de Veículos Premium desde 2019", página "Quem somos". */
  desde: 2019,
  /** Fonte: bio do Instagram, lida em 08/09/2026. */
  instagram: "saulojord",
  email: "saulojord@live.com",
} as const;

export const CONTATO = {
  /**
   * (79) 99959-2905, do rodapé do site atual e da página de contato.
   *
   * Em internacional: 55 + DDD 79 + 9 dígitos = 13. Contados um a um, porque
   * número com um dígito a menos parece certo e não abre conversa nenhuma.
   */
  e164: "5579999592905",
  exibicao: "(79) 99959-2905",
} as const;

if (CONTATO.e164.length !== 13) {
  throw new Error("O número em formato internacional tem que ter 13 dígitos.");
}

export const INSTAGRAM_URL = `https://www.instagram.com/${EMPRESA.instagram}/`;

/** Monta o link do WhatsApp com a mensagem já escrita. */
export function whatsapp(mensagem: string): string {
  return `https://wa.me/${CONTATO.e164}?text=${encodeURIComponent(mensagem)}`;
}

/**
 * A conversa em branco.
 *
 * Só o botão do cabeçalho e o do rodapé usam esta. É a saída de quem só quer
 * falar. Todo o resto do site leva a um caminho que já chega qualificado: o
 * carro, o que a pessoa procura, ou o carro que ela quer vender.
 */
export const MENSAGEM_DIRETA = "Olá, Saulo. Vim pelo site.";

export const ONDE_ATENDE = `${EMPRESA.cidade}, ${EMPRESA.uf}. Atendimento em todo o Brasil.`;
