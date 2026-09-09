/**
 * Todo icone do site e SVG. Nenhum caractere unicode decorativo: no iOS eles
 * chegam coloridos, fora da familia, e a seta vira emoji.
 */
type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Seta = ({ className }: P) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
);

export const IconeWhatsApp = ({ className }: P) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.26-8.24zm-3.2 4.2c-.15 0-.4.06-.6.29-.21.22-.8.78-.8 1.9s.82 2.2.93 2.36c.12.15 1.6 2.45 3.89 3.43.54.24.97.38 1.3.48.55.17 1.05.15 1.44.09.44-.07 1.35-.55 1.55-1.09.19-.54.19-1 .13-1.09-.05-.1-.2-.15-.42-.26-.22-.11-1.32-.65-1.53-.73-.2-.07-.35-.11-.5.12-.15.22-.57.72-.7.87-.13.15-.26.17-.48.06-.22-.11-.94-.35-1.79-1.11-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.08-.15.04-.28-.02-.39-.05-.11-.5-1.21-.68-1.66-.18-.43-.36-.37-.5-.38h-.42z" />
  </svg>
);

export const IconeInstagram = ({ className }: P) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconeLocal = ({ className }: P) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M20 10.5c0 5.2-8 11.5-8 11.5s-8-6.3-8-11.5a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10.3" r="2.8" />
  </svg>
);

export const IconeRelogio = ({ className }: P) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.3l3.4 2" />
  </svg>
);

export const IconeAcesso = ({ className }: P) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <circle cx="12" cy="4.4" r="1.9" />
    <path d="M8.4 8.2h7.2M12 8.2v6.1h4.1l2.2 5.5" />
    <path d="M12 14.3H8.6a3.9 3.9 0 1 0 3.5 5.6" />
  </svg>
);

export const IconeMais = ({ className }: P) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconeMenu = ({ className }: P) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconeFechar = ({ className }: P) => (
  <svg className={className} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
