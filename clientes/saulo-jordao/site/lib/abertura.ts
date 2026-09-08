/**
 * A abertura, em diafragma.
 *
 * Quatro folhas de papel cobrem a tela. Elas recuam até formar uma moldura 3:4
 * em pé, que é a moldura do site inteiro, e dentro dela aparece o nome. Depois
 * as folhas terminam de sair para as bordas enquanto a chapa com o nome sobe, e
 * o que estava embaixo desde o primeiro quadro é o herói.
 *
 * Três coisas aqui não são estilo, são regra:
 *
 * 1. A cortina está no HTML que o servidor manda, e quem anima é o CSS. Se ela
 *    nascesse do React, o navegador pintaria o HTML do servidor bem antes da
 *    hidratação, e nesse intervalo a página apareceria inteira, aberta, sem
 *    abertura nenhuma por cima. Em aparelho lento essa janela é enorme.
 *
 * 2. Ela sai sem depender de JavaScript. A animação do CSS termina de qualquer
 *    jeito, mesmo que o pacote da página falhe, mesmo com o script desligado.
 *    Abertura que precisa de script para sumir é uma tela branca esperando o
 *    dia de dar errado.
 *
 * 3. Um relógio só. O conteúdo por baixo está pintado em opacidade cheia desde
 *    o primeiro quadro, inclusive a foto do herói. A cortina cobre, não
 *    substitui, e por isso a abertura pode durar quase três segundos sem entrar
 *    na conta do carregamento.
 */

/** Duração total, em milissegundos. O CSS lê daqui e o QA mede contra isto. */
export const DURACAO_ABERTURA = 2800;

/** Onde a abertura roda. Só na home: em /estoque ela seria um obstáculo. */
export const ROTA_ABERTURA = "/";

/**
 * Decide antes da primeira pintura.
 *
 * Bloqueante, no head. É por isso que é uma string e não um componente:
 * componente é React, e React só entra depois da pintura.
 *
 * Marca a sessão no começo, não no fim. Quem sai no meio da abertura não deve
 * ver ela de novo na mesma sessão.
 */
export const SCRIPT_ABERTURA = `
(function () {
  // Marca que existe JavaScript vivo. É o que autoriza o CSS a esconder o que
  // vai ser revelado no scroll: sem esta marca nada fica escondido esperando um
  // observador que nunca vai rodar.
  document.documentElement.dataset.js = "1";
  try {
    if (location.pathname !== ${JSON.stringify(ROTA_ABERTURA)}) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (sessionStorage.getItem("sj:abriu") === "1") return;
    sessionStorage.setItem("sj:abriu", "1");
    document.documentElement.dataset.abrir = "1";
  } catch (e) {
    /* Sem armazenamento, sem abertura. Melhor não ter do que repetir sempre. */
  }
})();
`.trim();

/** Encerra no primeiro gesto, sem esperar a animação terminar. */
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
