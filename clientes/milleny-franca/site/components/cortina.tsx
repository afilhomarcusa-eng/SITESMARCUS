/**
 * Cortina de abertura. O livro que abre.
 *
 * Regras que mandam aqui, nao a coreografia:
 *  - a marcacao sai no HTML do servidor, entao nao existe um quadro sequer
 *    em que a pagina apareca sem ela;
 *  - quem anima e o CSS, no compositor, entao ela sai mesmo se o bundle
 *    quebrar, sem WebGL e com JavaScript desligado;
 *  - o script bloqueante no <head> decide ANTES do primeiro pixel se ela roda;
 *  - o hero ja esta pintado, opaco, embaixo. A cortina e que esconde.
 *
 * Um relogio so: as animacoes CSS abaixo. Nenhuma camada opcional participa.
 */
export function Cortina() {
  return (
    <div id="cortina" aria-hidden="true">
      <div className="cortina-folha cortina-folha-esq" />
      <div className="cortina-folha cortina-folha-dir" />

      <div className="cortina-centro">
        <svg
          className="cortina-traco"
          viewBox="0 0 300 150"
          fill="none"
          aria-hidden="true"
        >
          {/* a linha que uma crianca desenha, e que volta no CTA final */}
          <path
            className="traco-linha"
            d="M14 118 C 52 118, 58 62, 96 62 S 140 108, 178 96 S 226 40, 262 52 C 282 58, 288 76, 286 92"
            stroke="var(--cobalto)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle className="traco-forma traco-f1" cx="96" cy="40" r="9" fill="var(--ocre)" />
          <rect
            className="traco-forma traco-f2"
            x="170" y="118" width="17" height="17" rx="3"
            fill="var(--coral)"
          />
          <path
            className="traco-forma traco-f3"
            d="M262 2 l6.5 13.5 15 2 -11 10.5 2.7 14.8 -13.2-7 -13.2 7 2.7-14.8 -11-10.5 15-2z"
            fill="var(--verde)"
          />
        </svg>

        <p className="cortina-nome">
          Milleny França
          <span>Psicóloga infantil</span>
        </p>
      </div>

      {/* Sem JavaScript a cortina ja sai sozinha pelo CSS. Isto so cobre o caso
          de alguem com animacoes desligadas no sistema e JS fora. */}
      <noscript>
        <style>{`#cortina{display:none!important}`}</style>
      </noscript>
    </div>
  );
}

/**
 * Roda antes do primeiro pixel. Nao toca no layout, so decide se a cortina
 * existe. Fica inline no <head>, sem async e sem defer, de proposito.
 */
export const scriptDecideCortina = `
(function(){
  try{
    var pular = false;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) pular = true;
    if (sessionStorage.getItem('mf-abertura') === 'vista') pular = true;
    if (pular) { document.documentElement.setAttribute('data-abertura','nao'); }
    else { sessionStorage.setItem('mf-abertura','vista'); }
  }catch(e){ /* sessionStorage bloqueado: a cortina roda, e sai sozinha */ }
})();
`;
