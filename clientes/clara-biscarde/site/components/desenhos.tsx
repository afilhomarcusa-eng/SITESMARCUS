/**
 * Desenhos da jornada, em traço à mão.
 *
 * Tudo SVG inline, sem emoji e sem biblioteca de ícone. O traço irregular
 * conversa com o rabisco do cérebro que já existe no logo dela.
 *
 * Castelo marca conquista, dragão marca o momento difícil, ponte marca a
 * travessia. As cores vêm dos tokens, nunca fixas no componente.
 */

type Props = { className?: string };

export const traco = {
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Curva da Trilha, exportada para a carroça ambiente andar por cima dela. */
export const TRILHA_D =
  "M0,40 C 90,26 150,50 250,34 S 420,24 520,40 S 700,50 800,32 S 940,26 1000,38";

export function Conversa({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        {/* balão de quem escreve primeiro */}
        <path d="M8 14h30a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H20l-8 7v-7H8a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" />
        <path d="M13 22h20M13 28h13" />
        {/* balão da resposta, atrás e deslocado */}
        <path d="M48 26h8a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-2v6l-7-6h-9" />
      </g>
    </svg>
  );
}

export function Casa({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        {/* telhado e paredes */}
        <path d="M10 30 32 12l22 18" />
        <path d="M16 27v25h32V27" />
        {/* porta e janela */}
        <path d="M27 52V38h10v14" />
        <path d="M20 33h6v6h-6z" />
        {/* chão */}
        <path d="M6 52h52" />
      </g>
    </svg>
  );
}

/**
 * Coração, alvo, raio e estrela: os quatro ícones da seção "Cada fase",
 * pedidos por ela numa referência de design (mockup em cartões coloridos).
 * Mesma família de traço dos outros desenhos, para não destoar do resto.
 */

export function Coracao({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        <path d="M32 52C20 43 9 33 9 21c0-7 6-13 13-13 4 0 8 2 10 6 2-4 6-6 10-6 7 0 13 6 13 13 0 12-11 22-23 31z" />
      </g>
    </svg>
  );
}

export function Alvo({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        <circle cx="32" cy="32" r="19" />
        <circle cx="32" cy="32" r="10" />
        <circle cx="32" cy="32" r="2" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

export function Raio({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor" strokeLinejoin="round">
        <path d="M34 4 14 36h14l-6 24 28-34H32z" />
      </g>
    </svg>
  );
}

export function Estrela({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor" strokeLinejoin="round">
        <path d="M32 4 40 26 60 32 40 38 32 60 24 38 4 32 24 26Z" />
      </g>
    </svg>
  );
}

/** Tela e alfinete de mapa: os selos de Online e Presencial. */

export function Monitor({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        <rect x="8" y="14" width="48" height="32" rx="4" />
        <path d="M24 54h16" />
        <path d="M32 46v8" />
      </g>
    </svg>
  );
}

export function Local({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        <path d="M32 56c10-12 16-20 16-27a16 16 0 1 0-32 0c0 7 6 15 16 27z" />
        <circle cx="32" cy="28" r="6" />
      </g>
    </svg>
  );
}

export function Ponte({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        {/* tabuleiro */}
        <path d="M4 30h56" />
        {/* arcos */}
        <path d="M12 30a10 10 0 0 1 20 0" />
        <path d="M32 30a10 10 0 0 1 20 0" />
        {/* pilares */}
        <path d="M8 30v14M32 30v14M56 30v14" />
        {/* guarda corpo */}
        <path d="M4 24h56M12 24v6M22 24v6M42 24v6M52 24v6" />
        {/* água */}
        <path d="M4 50c4-3 8-3 12 0s8 3 12 0 8-3 12 0 8 3 12 0" />
      </g>
    </svg>
  );
}

export function Bussola({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        <circle cx="32" cy="32" r="22" />
        <circle cx="32" cy="32" r="17" />
        {/* agulha */}
        <path d="M40 24l-5 13-13 5 5-13z" />
        <circle cx="32" cy="32" r="1.6" fill="currentColor" stroke="none" />
        {/* marcas dos pontos */}
        <path d="M32 10v3M32 51v3M10 32h3M51 32h3" />
      </g>
    </svg>
  );
}

export function Bandeira({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        {/* mastro */}
        <path d="M20 54V10" />
        {/* pano ondulado */}
        <path d="M20 13c6-3 11 3 17 0s10-3 14 0v14c-4-3-8-3-14 0s-11-3-17 0z" />
        {/* base */}
        <path d="M12 54h18" />
        {/* montinho */}
        <path d="M34 54c3-5 8-8 14-8s12 3 14 8" />
      </g>
    </svg>
  );
}

export function Trilha({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1000 72"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      {/* Amplitude presa entre y 24 e y 48 para nunca invadir os rótulos */}
      <path
        d={TRILHA_D}
        fill="none"
        stroke="var(--color-oliva-apoio)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 12"
      />
    </svg>
  );
}

/*
 * Livro e Labirinto, os dois da lista de formação.
 *
 * Aqui o viewBox é 24, não o 64 dos desenhos da trilha. Eles rodam a 22px
 * dentro da faixa, e nesse tamanho o traço de 2 sobre 64 vira borrão: o
 * detalhe fecha e some. Menos linha e proporção maior é o que mantém a forma
 * legível pequena.
 *
 * A beca de formatura e a medalha de fita que vieram antes foram recusadas
 * por parecerem ícone de banco genérico, e eram mesmo: qualquer biblioteca
 * entrega as duas iguais. Estes partem do que ela de fato tem escrito.
 */
const tracoMiudo = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Livro aberto, para a formação acadêmica.
 *
 * As páginas são arcos irregulares e a lombada não desce reta, que é o que
 * separa isto de um livro de biblioteca de ícone. Duas linhas de texto, não
 * quatro: a 22px, quatro linhas encostam umas nas outras e viram mancha.
 */
export function Livro({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g {...tracoMiudo} stroke="currentColor">
        <path d="M12 7.3C9.6 5.4 6.3 4.9 3.5 5.8c-.4.1-.6.5-.6.9l.4 10.4c0 .5.5.8.9.7 2.6-.7 5.6-.2 7.8 1.3" />
        <path d="M12 7.3c2.3-1.9 5.6-2.5 8.4-1.6.4.1.6.5.6.9l-.5 10.4c0 .5-.5.8-.9.6-2.6-.7-5.5-.1-7.6 1.4" />
        <path d="M12.1 7.4c-.3 4-.2 8 0 12" />
        <path d="M6 11.2c1.5-.4 3-.3 4.4 0" />
        <path d="M17.9 11c-1.4-.3-2.9-.2-4.3.2" />
      </g>
    </svg>
  );
}

/**
 * Labirinto, para o treinamento na Escala LABIRINTO.
 *
 * É o nome da escala desenhado, não um selo de curso concluído: o caminho
 * entra pelo topo e dá duas voltas até o centro.
 */
export function Labirinto({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g {...tracoMiudo} stroke="currentColor">
        <path d="M10.3 3.4H4.5c-.7 0-1.1.5-1.1 1.2l.1 14.7c0 .7.5 1.2 1.1 1.2h14.9c.6 0 1.1-.6 1.1-1.2l-.1-14.7c0-.7-.5-1.2-1.2-1.2h-5.6" />
        <path d="M13.8 6.9h2.9c.6 0 1.1.5 1.1 1.1v8c0 .6-.5 1.1-1.1 1.1H7.4c-.6 0-1.1-.5-1.1-1.1l.1-8c0-.6.5-1.1 1.1-1.1h3" />
        <path d="M13.7 10.4h.9c.6 0 1 .4 1 1l-.1 2c0 .6-.4 1-1 1h-5" />
        <path d="M12 3.5v6.9" />
      </g>
    </svg>
  );
}
