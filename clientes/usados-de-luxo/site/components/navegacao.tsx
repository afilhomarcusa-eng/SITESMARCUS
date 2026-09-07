"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EMPRESA, TELEFONE, whatsapp } from "@/lib/contato";

/**
 * "Estoque" é rota, não âncora: é a página que vende, e ela precisa ter
 * endereço próprio para ser mandada num link e achada no Google.
 */
const LINKS = [
  { href: "/estoque", rotulo: "Estoque" },
  { href: "/#confianca", rotulo: "Por que daqui" },
  { href: "/#distancia", rotulo: "Como funciona" },
  { href: "/#loja", rotulo: "A loja" },
];

const MSG = "Olá! Vim pelo site e queria ver os carros disponíveis.";

export default function Navegacao() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <>
      <header
        data-nav
        className="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500"
        style={{
          backgroundColor: rolou ? "rgba(11,11,12,0.82)" : "transparent",
          backdropFilter: rolou ? "blur(14px)" : "none",
          borderBottom: `1px solid ${rolou ? "var(--linha)" : "transparent"}`,
          transitionTimingFunction: "var(--e-saida)",
        }}
      >
        <div className="casca flex items-center justify-between gap-6 py-4 md:py-5">
          <Link
            href="/"
            className="group flex shrink-0 items-baseline gap-2.5"
            aria-label={`${EMPRESA.nome}, início`}
          >
            <span
              aria-hidden="true"
              className="display text-[1.35rem] leading-none md:text-[1.5rem]"
              style={{ color: "var(--latao)" }}
            >
              U
            </span>
            <span className="display-solto hidden text-[0.78rem] tracking-[0.16em] sm:block">
              Usados de Luxo
            </span>
          </Link>

          <nav aria-label="Seções" className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="dado group relative py-1 text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-200"
                style={{ color: "var(--tinta-2)" }}
              >
                {l.rotulo}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{
                    background: "var(--latao)",
                    transitionTimingFunction: "var(--e-saida)",
                  }}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={TELEFONE.tel}
              className="dado hidden text-[0.72rem] tracking-[0.08em] md:block"
              style={{ color: "var(--tinta-2)" }}
            >
              {TELEFONE.exibicao}
            </a>
            {/* Esta é a ação principal do site. Nunca é animada, nunca some,
                nem durante a abertura. */}
            <a
              data-cta="cabecalho"
              href={whatsapp(MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="dado inline-flex items-center gap-2 px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.14em] transition-colors duration-300"
              style={{
                background: "var(--latao)",
                color: "var(--preto)",
                fontWeight: 500,
              }}
            >
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-controls="menu-movel"
              className="flex h-9 w-9 shrink-0 items-center justify-center lg:hidden"
              style={{ border: "1px solid var(--linha)" }}
            >
              <span className="so-leitor">{aberto ? "Fechar menu" : "Abrir menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span
                  className="absolute left-0 block h-px w-full transition-transform duration-300"
                  style={{
                    background: "var(--tinta)",
                    top: aberto ? "6px" : "1px",
                    transform: aberto ? "rotate(45deg)" : "none",
                    transitionTimingFunction: "var(--e-saida)",
                  }}
                />
                <span
                  className="absolute left-0 block h-px w-full transition-transform duration-300"
                  style={{
                    background: "var(--tinta)",
                    top: aberto ? "6px" : "10px",
                    transform: aberto ? "rotate(-45deg)" : "none",
                    transitionTimingFunction: "var(--e-saida)",
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-movel"
        hidden={!aberto}
        className="fixed inset-0 z-40 lg:hidden"
        style={{ background: "var(--preto)" }}
      >
        <div className="casca flex h-full flex-col justify-center gap-2 pt-20">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className="display-solto border-b py-5 text-[clamp(1.8rem,9vw,2.8rem)]"
              style={{
                borderColor: "var(--linha)",
                opacity: aberto ? 1 : 0,
                transform: aberto ? "none" : "translateY(1rem)",
                transition: `opacity 500ms var(--e-saida) ${i * 60}ms, transform 500ms var(--e-saida) ${i * 60}ms`,
              }}
            >
              {l.rotulo}
            </a>
          ))}
          <a
            href={TELEFONE.tel}
            className="dado mt-8 text-[0.85rem]"
            style={{ color: "var(--latao)" }}
          >
            {TELEFONE.exibicao}
          </a>
        </div>
      </div>
    </>
  );
}
