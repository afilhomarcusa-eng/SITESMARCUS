/**
 * A abertura, em um lugar só.
 *
 * Duas coisas já deram errado aqui, e as duas viraram regra.
 *
 * 1. Quem contava o tempo era o componente do céu, e o DOM esperava o aviso
 *    dele. O relógio só começava depois que o pacote do three baixava, então o
 *    tempo de carregar a biblioteca entrava inteiro na conta e o LCP ia para
 *    quase três segundos.
 *
 * 2. Ao separar os dois relógios, eles passaram a começar em momentos
 *    diferentes: o do DOM na montagem, o do céu quando o three chegava. O
 *    conteúdo abria antes de o céu terminar, e a abertura parecia quebrada.
 *
 * A saída não foi sincronizar dois relógios, foi ter um só. Hoje a abertura é
 * um véu em cima da cena, animado pelo relógio do herói. O céu desenha sempre
 * o estado assentado e pode chegar quando quiser: atrasado, adiantado ou nunca.
 * Nada na abertura depende dele.
 *
 * O conteúdo fica em opacidade cheia o tempo todo, inclusive a foto do herói.
 * É o véu que esconde. Isso mantém o LCP baixo mesmo com abertura longa,
 * porque o navegador conta a pintura, e o elemento é pintado desde o começo.
 */

/**
 * Duração da abertura.
 *
 * O briefing pede entre 1,5 e 3,5 segundos. Estava em 1,7 e ficou curta demais:
 * a marca mal aparecia antes de a cena abrir. Em 3,2 a sequência tem tempo de
 * respirar, e como o conteúdo já está pintado por baixo do véu, alongar aqui
 * não custa carregamento.
 */
export const DURACAO_ABERTURA = 3200;

const CHAVE = "dlx:abriu";

/**
 * Decide se a abertura roda, e marca como vista no mesmo passo.
 *
 * Marca no começo, não no fim: quem sai da página no meio da abertura não deve
 * ver ela de novo na mesma sessão.
 */
export function deveAbrir(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (sessionStorage.getItem(CHAVE) === "1") return false;
    sessionStorage.setItem(CHAVE, "1");
    return true;
  } catch {
    // Navegador com armazenamento bloqueado: não roda abertura nenhuma, para
    // não repetir a cada navegação.
    return false;
  }
}
