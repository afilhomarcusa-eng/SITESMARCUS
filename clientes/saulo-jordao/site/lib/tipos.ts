/**
 * As formas que o site inteiro usa.
 *
 * Uma foto é sempre a mesma coisa, venha ela do pipeline de imagem que roda na
 * máquina ou do envio que o Saulo faz em /admin: uma lista de larguras com as
 * URLs delas, mais a dimensão da origem. É a dimensão da origem que o QA usa
 * para cobrar a lei da resolução, e é por isso que ela viaja junto com a foto,
 * e não num arquivo à parte que alguém pode esquecer de atualizar.
 */

export type Fonte = { w: number; url: string };

export type Foto = {
  /** Larguras disponíveis, da menor para a maior. */
  fontes: Fonte[];
  /** A dimensão do arquivo de origem. Nenhuma foto é desenhada além disso. */
  nativa: { w: number; h: number };
};

export type Carro = {
  slug: string;
  marca: string;
  /** Nome curto, o que aparece no cartão da grade. */
  modelo: string;
  /** Nome inteiro, o que aparece no topo da ficha. */
  nome: string;
  ano: number;
  /** Quando o anúncio traz fabricação e modelo, como "2026/2026". */
  anoTexto?: string;
  preco: number;
  km?: number;
  potencia?: number;
  motor?: string;
  cambio?: string;
  tracao?: string;
  cor?: string;
  interior?: string;
  /** O que já está resolvido: dono, IPVA, garantia, revisões, proteção. */
  conferido: string[];
  /** Opcionais e equipamentos. */
  itens: string[];
  /** Um fato concreto que muda o valor do carro. Aparece no cartão e na ficha. */
  nota?: string;
  fotos: Foto[];
  /** Quantas fotos o anúncio original tinha, quando são mais que as do site. */
  fotosNoAnuncio?: number;
};

/** O que o site precisa saber sobre o estoque de hoje, calculado, nunca escrito. */
export type Numeros = {
  carros: number;
  marcas: number;
  menorPreco: number;
  maiorPreco: number;
  somaPrecos: number;
  fotos: number;
};

/** Larguras de saída. Uma lista só, usada pelo pipeline e pela gerência. */
export const LARGURAS_FOTO = [420, 840] as const;
export const LARGURA_GRANDE = 1440;

/** A moldura do site: todo retrato é 3:4 em pé. */
export const PROPORCAO_FOTO = 4 / 3;

/** Quantas fotos de cada carro o site mostra. */
export const FOTOS_POR_CARRO = 6;
