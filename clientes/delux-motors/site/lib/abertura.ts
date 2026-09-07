/**
 * A abertura, em um lugar só.
 *
 * Antes, quem contava o tempo da abertura era o componente do céu, e o DOM
 * esperava o aviso dele para revelar a loja e a copy. O efeito colateral era
 * caro: o relógio só começava depois que o pacote do three baixava e o
 * primeiro quadro saía, então o tempo de carregar a biblioteca entrava
 * inteiro na conta e empurrava o LCP para quase três segundos.
 *
 * Agora o relógio é este, e ele começa quando o componente monta. O céu
 * acompanha o mesmo tempo por conta própria. Se o three demorar, ou nunca
 * chegar, o conteúdo aparece na hora certa do mesmo jeito, sobre o degradê de
 * CSS que já está no fundo.
 */

export const DURACAO_ABERTURA = 1700;

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
