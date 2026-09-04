"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { rede, unidades } from "@/lib/unidades";

/* ------------------------------------------------------------------ icones */

const base = {
  className: "ico",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowRight() {
  return (
    <svg {...base}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight() {
  return (
    <svg {...base}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg {...base}>
      <path d="M20 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function Pin() {
  return (
    <svg {...base}>
      <path d="M19.5 10c0 5.2-7.5 11-7.5 11S4.5 15.2 4.5 10a7.5 7.5 0 0 1 15 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function Phone() {
  return (
    <svg {...base}>
      <path d="M7.3 4h2.1l1.4 3.5-1.7 1.4a11.5 11.5 0 0 0 5 5l1.4-1.7 3.5 1.4v2.1c0 1.2-1 2.2-2.2 2.1A15.4 15.4 0 0 1 5.2 6.2 2.1 2.1 0 0 1 7.3 4Z" />
    </svg>
  );
}

export function Clock() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.4V12l3 1.8" />
    </svg>
  );
}

/** Marca oficial do WhatsApp, cheia. Contorno nao le bem em tamanho pequeno. */
export function WhatsApp() {
  return (
    <svg className="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2.02c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.33 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9a9.82 9.82 0 0 0-2.9-7.01 9.82 9.82 0 0 0-7.01-2.9Zm0 18.05h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.69 8.24-8.24 8.24Zm4.52-6.17c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06a6.73 6.73 0 0 1-1.98-1.22 7.42 7.42 0 0 1-1.37-1.71c-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.3-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.02s.87 2.35.99 2.51c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.11-.22-.17-.47-.3Z" />
    </svg>
  );
}

export function Instagram() {
  return (
    <svg {...base}>
      <rect x="3" y="3" width="18" height="18" rx="5.2" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" strokeWidth="1.6" />
      <circle cx="16.9" cy="7.1" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * A marca sai do PDF oficial que o cliente enviou. Sao duas versoes do mesmo
 * arquivo: a escura para fundo claro e a clara para fundo escuro. O
 * mix-blend-mode no CSS derruba o branco do PNG, entao nao precisa de recorte.
 */
export function Mark({ claro = false, pequeno = false }: { claro?: boolean; pequeno?: boolean }) {
  return (
    <span className={pequeno ? "mark mark--sm" : "mark"}>
      <img
        src={claro ? "/images/logo-claro.png" : "/images/logo.png"}
        alt="Abitah Centro de Treinamento"
        width={1200}
        height={354}
      />
    </span>
  );
}

/* ------------------------------------------------------------ cabecalho */

const nav: [string, string][] = [
  ["O método", "/#metodo"],
  ["Unidades", "/#unidades"],
  ["Franquia", "/#franquia"],
];

export function Header({ atual, sobreFoto = false }: { atual?: string; sobreFoto?: boolean }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    return () => document.body.classList.remove("is-locked");
  }, [open]);

  return (
    <>
      <header className={stuck ? "topbar is-stuck" : sobreFoto ? "topbar is-over" : "topbar"}>
        <div className="shell topbar-in">
          <Link href="/" aria-label="Abitah, início">
            <Mark claro={sobreFoto && !stuck} />
          </Link>
          <nav aria-label="Navegação principal">
            {nav.map(([label, href]) => (
              <a key={href} href={href} className={atual === href ? "is-on" : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <Link className="btn btn--brand" href="/aula-experimental">
            Aula experimental
          </Link>
          <button className="burger" type="button" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={open ? "drawer is-open" : "drawer"} aria-hidden={!open}>
        <div className="drawer-top">
          <Mark claro pequeno />
          <button type="button" onClick={() => setOpen(false)} aria-label="Fechar menu">
            ×
          </button>
        </div>
        <nav>
          {nav.map(([label, href], i) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              <i>0{i + 1}</i>
              {label}
            </a>
          ))}
          {unidades.slice(0, 3).map((u, i) => (
            <Link key={u.slug} href={`/unidades/${u.slug}`} onClick={() => setOpen(false)}>
              <i>0{i + 4}</i>
              {u.nome}
            </Link>
          ))}
        </nav>
        <div className="drawer-foot">
          <span>{rede.telefone}</span>
          <span>{rede.email}</span>
        </div>
      </div>
    </>
  );
}

/* --------------------------------------------------------------- rodape */

export function Footer() {
  return (
    <>
      <footer className="foot">
        <div className="shell foot-top">
          <div>
            <Mark claro />
            <p>
              Oito unidades entre Salvador, Lauro de Freitas e Feira de Santana. Treino com acompanhamento de verdade e
              uma turma que te puxa para evoluir.
            </p>
          </div>
          <div className="foot-col">
            <h4>Unidades</h4>
            {unidades.slice(0, 4).map((u) => (
              <Link key={u.slug} href={`/unidades/${u.slug}`}>
                {u.nome}
              </Link>
            ))}
          </div>
          <div className="foot-col">
            <h4>&nbsp;</h4>
            {unidades.slice(4).map((u) => (
              <Link key={u.slug} href={`/unidades/${u.slug}`}>
                {u.nome}
              </Link>
            ))}
          </div>
          <div className="foot-col">
            <h4>Rede</h4>
            <a href={`tel:+${rede.whatsapp}`}>{rede.telefone}</a>
            <a href={`mailto:${rede.email}`}>{rede.email}</a>
            <a href={rede.instagram} target="_blank" rel="noreferrer">
              @ctabitah
            </a>
            <a href={rede.siteOficial} target="_blank" rel="noreferrer">
              abitahoficial.com.br
            </a>
          </div>
        </div>
        <div className="shell foot-bottom">
          <span>© {new Date().getFullYear()} Abitah Centro de Treinamento</span>
          <span>Salvador · Lauro de Freitas · Feira de Santana</span>
        </div>
      </footer>

      <div className="dock">
        <a
          href={`https://wa.me/${rede.whatsapp}?text=${encodeURIComponent("Olá! Vim pelo site do CT Abitah.")}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Falar no WhatsApp"
        >
          <WhatsApp />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
}

/** Marca as seções com data-reveal conforme entram na tela. */
export function useReveal() {
  useEffect(() => {
    const alvos = document.querySelectorAll("[data-reveal]");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    alvos.forEach((a) => obs.observe(a));
    return () => obs.disconnect();
  }, []);
}
