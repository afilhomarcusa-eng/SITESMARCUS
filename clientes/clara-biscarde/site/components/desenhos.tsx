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

const traco = {
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Castelo({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        {/* torres laterais com ameias */}
        <path d="M10 54V28h12v26" />
        <path d="M10 28v-5h3v3h3v-3h3v3h3v-3h0v5" />
        <path d="M42 54V28h12v26" />
        <path d="M42 28v-5h3v3h3v-3h3v3h3v-3h0v5" />
        {/* corpo central */}
        <path d="M22 54V36h20v18" />
        <path d="M22 36v-4h3v2h3v-2h3v2h3v-2h3v2h3v-2h2v4" />
        {/* portão em arco */}
        <path d="M28 54V45a4 4 0 0 1 8 0v9" />
        {/* janelinhas */}
        <path d="M15 36v4M48 36v4" />
        {/* mastro e bandeira */}
        <path d="M32 32V18" />
        <path d="M32 19h9l-3 3 3 3h-9" />
        {/* chão */}
        <path d="M4 54h56" />
      </g>
    </svg>
  );
}

export function Dragao({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g {...traco} stroke="currentColor">
        {/* corpo e pescoço */}
        <path d="M14 50c0-8 6-12 13-12 6 0 9 3 12 3 3 0 5-2 5-5 0-4-4-6-8-5" />
        {/* cabeça */}
        <path d="M36 31c-3-1-5-4-4-7 1-4 5-6 9-5 4 1 6 4 6 7l4 2-4 2c-1 3-4 4-7 4" />
        {/* olho */}
        <circle cx="43" cy="26" r="1.4" fill="currentColor" stroke="none" />
        {/* chifres */}
        <path d="M42 19l2-5M46 20l4-3" />
        {/* asa */}
        <path d="M22 40c2-8 8-13 14-12-4 3-5 8-4 12" />
        <path d="M27 39l3-5M31 40l2-6" />
        {/* patas */}
        <path d="M18 50v4M26 51v3M34 49v5" />
        {/* cauda com espinho */}
        <path d="M14 50c-5 0-8-3-8-7 0-3 2-5 4-5" />
        <path d="M8 41l-4-3 5-1" />
        {/* chão */}
        <path d="M4 56h56" />
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
        d="M0,40 C 90,26 150,50 250,34 S 420,24 520,40 S 700,50 800,32 S 940,26 1000,38"
        fill="none"
        stroke="var(--color-oliva-apoio)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="2 12"
      />
    </svg>
  );
}
