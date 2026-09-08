"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONTATO, EMPRESA, whatsapp } from "@/lib/contato";

/**
 * "Estoque" é rota, não âncora: precisa de endereço próprio para ser mandada
 * num link e achada no Google. O resto é âncora na home, na forma absoluta,
 * para funcionar também a partir de /estoque.
 */
const LINKS = [
  { href: "/#servicos", rotulo: "Serviços" },
  { href: "/estoque", rotulo: "Estoque" },
  { href: "/procuro", rotulo: "Não achou?" },
  { href: "/#loja", rotulo: "A loja" },
  { href: "/#local", rotulo: "Como chegar" },
];

const MSG = "Olá! Vim pelo site da Delux Motors e queria falar com vocês.";

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
        className="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500"
        style={{
          backgroundColor: rolou ? "rgba(255,255,255,0.9)" : "transparent",
          backdropFilter: rolou ? "blur(16px)" : "none",
          borderBottom: `1px solid ${rolou ? "var(--linha)" : "transparent"}`,
          transitionTimingFunction: "var(--e-saida)",
        }}
      >
        <div className="casca flex items-center justify-between gap-6 py-4">
          <Link
            href="/"
            className="shrink-0"
            aria-label={`${EMPRESA.nome}, início`}
          >
            <span className="cromo display text-[1.3rem] leading-none md:text-[1.5rem]">
              Delux
            </span>
            <span className="etiqueta ml-2 hidden align-middle sm:inline">Motors</span>
          </Link>

          <nav aria-label="Seções" className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group relative py-1 text-[0.76rem] uppercase tracking-[0.13em] transition-colors duration-200"
                style={{ color: "var(--tinta-2)" }}
              >
                {l.rotulo}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{
                    background: "var(--tinta)",
                    transitionTimingFunction: "var(--e-saida)",
                  }}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Estoque fica visível na barra também no celular, fora do menu
                sanfona. É o destino que mais interessa a quem chega, e escondê-lo
                atrás de um botão de menu custa um toque a mais logo no começo. */}
            <Link
              data-atalho-estoque
              href="/estoque"
              className="px-3 py-2 text-[0.72rem] uppercase tracking-[0.12em] lg:hidden"
              style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
            >
              Estoque
            </Link>

            <a
              href={CONTATO.tel}
              className="dado hidden text-[0.76rem] md:block"
              style={{ color: "var(--tinta-2)" }}
            >
              {CONTATO.exibicao}
            </a>
            {/* A ação principal do site. Nunca é animada, nunca some, nem
                durante a abertura. */}
            <a
              data-cta="cabecalho"
              href={whatsapp(MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.13em] sm:px-4"
              style={{ background: "var(--tinta)", color: "var(--branco)" }}
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
        style={{ background: "var(--branco)" }}
      >
        <div className="casca flex h-full flex-col justify-center gap-1 pt-20">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className="display-leve border-b py-5 text-[clamp(1.8rem,9vw,2.6rem)]"
              style={{
                borderColor: "var(--linha)",
                opacity: aberto ? 1 : 0,
                transform: aberto ? "none" : "translateY(1rem)",
                transition: `opacity 460ms var(--e-saida) ${i * 60}ms, transform 460ms var(--e-saida) ${i * 60}ms`,
              }}
            >
              {l.rotulo}
            </Link>
          ))}
          <a
            href={CONTATO.tel}
            className="dado mt-8 text-[0.9rem]"
            style={{ color: "var(--tinta)" }}
          >
            {CONTATO.exibicao}
          </a>
        </div>
      </div>
    </>
  );
}
