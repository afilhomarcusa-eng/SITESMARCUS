/**
 * Ícones de WhatsApp e Instagram para o cabeçalho, em traço próprio — não é
 * o logo de marca de nenhum dos dois. Mesma decisão já tomada em
 * botao-flutuante.tsx: marca reconhecida de plugin instalado não entra aqui.
 */

type Props = { className?: string };

export function IconeWhatsapp({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g
        fill="none"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      >
        <path d="M5 20l1.2-3.6A7.5 7.5 0 1 1 9.8 19z" />
        <path d="M9 10.5c.5 2 2 3.5 4 4" />
      </g>
    </svg>
  );
}

export function IconeInstagram({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g
        fill="none"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      >
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.4" />
        <circle cx="16.3" cy="7.7" r="0.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}
