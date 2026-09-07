/**
 * Estoque.
 *
 * Está vazio de propósito, e isso é o achado mais importante da pesquisa.
 *
 * A Delux Motors não publica estoque em lugar nenhum. O perfil no Instagram
 * (@deluxmotorsba, 7.698 seguidores em 07/09/2026) tem doze publicações: três
 * são artes institucionais sobre Compra, Venda e Consignação, e nove são reels
 * de conteúdo, sem carro anunciado. O domínio deluxmotors.com.br, que eles
 * informam no Google, não resolve. Não existe uma única ficha pública com
 * marca, ano, quilometragem e preço.
 *
 * Então não tem carro aqui. Inventar ficha, preço ou quilometragem para a
 * página parecer cheia seria mentira publicada em nome do cliente, e a foto da
 * fachada mostra carros que podem nem estar à venda.
 *
 * O caminho certo: o cliente cadastra o estoque real em /admin, ou manda a
 * lista para entrar aqui como carga inicial. Até lá, /estoque mostra um estado
 * vazio honesto que continua vendendo, com os três serviços e o WhatsApp.
 */

export type Carro = {
  slug: string;
  marca: string;
  modelo: string;
  versao: string;
  motor: string;
  potencia: number;
  combustivel: string;
  cambio: string;
  tracao: string;
  ano: string;
  km: number;
  preco: number;
  destaques: string[];
  /** Nome do arquivo em public/images, sem tamanho nem extensão. */
  foto: string;
  /** Dimensão nativa da origem. O QA compara o desenho contra isto. */
  nativa: { w: number; h: number };
  origem: string;
};

export const CARROS_INICIAIS: Carro[] = [];
