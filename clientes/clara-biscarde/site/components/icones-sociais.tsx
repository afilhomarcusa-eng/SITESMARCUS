/**
 * WhatsApp e Instagram nas silhuetas reconhecidas de cada um.
 *
 * A primeira versão daqui era traço próprio, para fugir da "bolinha verde de
 * plugin" que botao-flutuante.tsx rejeita. Só que em 16px aquilo não lia como
 * WhatsApp nenhum: virava um balão com um risco dentro.
 *
 * A decisão do botão flutuante continua valendo, porque lá o problema era o
 * verde e o tamanho. Aqui são dois selos pequenos e monocromáticos, que herdam
 * a cor do cabeçalho: reconhecíveis sem puxar a marca de ninguém para dentro
 * da paleta dela.
 */

type Props = { className?: string };

export function IconeWhatsapp({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.19 8.19 0 0 1 2.42 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Z"
      />
      <path
        fill="currentColor"
        d="M9.11 7.1c-.19-.42-.38-.43-.56-.44h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.72 2.75 4.23 3.74 2.09.83 2.52.66 2.97.62.45-.04 1.46-.6 1.67-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.17-.48-.29-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.63.8-.78.96-.14.17-.29.19-.54.07-.25-.13-1.04-.39-1.99-1.23-.74-.65-1.23-1.46-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.55-1.35-.76-1.84Z"
      />
    </svg>
  );
}

export function IconeInstagram({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
        <circle cx="12" cy="12" r="4.1" />
      </g>
      <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" />
    </svg>
  );
}
