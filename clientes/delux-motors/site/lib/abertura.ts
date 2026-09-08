/**
 * A abertura.
 *
 * Este arquivo guarda um número e conta uma história curta, porque a história
 * explica por que a abertura é feita do jeito que é.
 *
 * Primeira versão: quem contava o tempo era o componente do céu, em WebGL. O
 * relógio só começava depois que o pacote do three baixava, então o tempo de
 * carregar a biblioteca entrava inteiro na conta e o LCP ia para 4,2s.
 *
 * Segunda: separei os relógios. Aí eles passaram a começar em momentos
 * diferentes, o do DOM na montagem e o do céu quando o three chegava, e o
 * conteúdo abria antes de o céu terminar.
 *
 * Terceira: um relógio só, no React. Ainda errado, e esse era o mais difícil de
 * ver. O véu era criado depois da hidratação, mas o navegador pinta o HTML do
 * servidor muito antes disso, e esse HTML não tinha véu nenhum. A página
 * aparecia inteira, aberta, e só então a abertura caía por cima. Em aparelho ou
 * conexão lenta a janela entre uma coisa e outra é enorme.
 *
 * Quarta, esta: a cortina está no HTML desde o servidor e quem anima é o CSS.
 * Não existe momento em que a página exista sem ela. Não depende de React, de
 * hidratação, do three, nem de rede. Um script bloqueante no head decide, antes
 * da primeira pintura, se a abertura roda; se não roda, a cortina nem aparece.
 *
 * E se o JavaScript falhar por completo, a animação do CSS termina do mesmo
 * jeito e a cortina sai. Abertura que depende de script para sumir é uma tela
 * preta esperando para acontecer.
 */

/**
 * Duração da cortina, em milissegundos.
 *
 * O briefing pede entre 1,5 e 3,5 segundos. Este número é a fonte da verdade:
 * o layout injeta ele como variável CSS e o QA mede contra ele.
 */
export const DURACAO_ABERTURA = 3200;

/** Onde a abertura roda. Só na home: em /estoque ela seria um obstáculo. */
export const ROTA_ABERTURA = "/";

/**
 * O script que decide, antes da primeira pintura.
 *
 * Roda bloqueante no head, então acontece antes de o navegador pintar o body.
 * É por isso que ele é uma string e não um componente: componente é React, e
 * React só entra depois da pintura, que é exatamente o problema que esta
 * abertura já teve.
 *
 * Marca a sessão no começo, não no fim: quem sai no meio da abertura não deve
 * ver ela de novo na mesma sessão.
 */
export const SCRIPT_ABERTURA = `
(function () {
  try {
    if (location.pathname !== ${JSON.stringify(ROTA_ABERTURA)}) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("dlx:abriu") === "1") return;
    sessionStorage.setItem("dlx:abriu", "1");
    document.documentElement.dataset.abrir = "1";
  } catch (e) {
    /* Sem armazenamento, sem abertura. Melhor não ter do que repetir sempre. */
  }
})();
`.trim();

/** Encerra a cortina no primeiro gesto, sem esperar a animação terminar. */
export const SCRIPT_PULAR = `
(function () {
  var raiz = document.documentElement;
  if (raiz.dataset.abrir !== "1") return;
  function pular() { raiz.dataset.abrir = "0"; }
  ["pointerdown", "wheel", "keydown", "touchstart"].forEach(function (ev) {
    addEventListener(ev, pular, { once: true, passive: true });
  });
})();
`.trim();
