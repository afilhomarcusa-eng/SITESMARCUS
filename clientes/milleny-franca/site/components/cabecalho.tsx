"use client";

import { useEffect, useRef, useState } from "react";
import { secoes } from "@/lib/navegacao";
import { linkWhatsApp, contato } from "@/lib/dados";
import { IconeMenu, IconeFechar, IconeInstagram } from "@/components/icones";

export function Cabecalho() {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [ativa, setAtiva] = useState<string>("");
  const botaoMenu = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Indicador de secao ativa.
  useEffect(() => {
    const alvos = secoes
      .map((s) => document.getElementById(s.id))
      .filter((e): e is HTMLElement => e !== null);
    if (alvos.length === 0) return;

    const obs = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visivel) setAtiva(visivel.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    alvos.forEach((a) => obs.observe(a));
    return () => obs.disconnect();
  }, []);

  // Escape fecha o menu e devolve o foco para o botao que o abriu.
  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
    };
    document.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header className={`cabecalho ${rolou ? "cabecalho-rolou" : ""}`}>
      <div className="cabecalho-linha">
        <a href="#topo" className="marca" aria-label="Milleny França, início">
          <span className="marca-nome">Milleny França</span>
          <span className="marca-papel">Psicóloga infantil</span>
        </a>

        <nav className="nav-desktop" aria-label="Seções do site">
          {secoes.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="nav-link"
              aria-current={ativa === s.id ? "true" : undefined}
            >
              {s.rotulo}
            </a>
          ))}
        </nav>

        <div className="cabecalho-acoes">
          <a
            href={contato.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cabecalho-ig"
            aria-label={`Instagram de Milleny França, @${contato.instagramUsuario}`}
          >
            <IconeInstagram />
          </a>
          <a
            data-cta="cabecalho"
            className="btn btn-primario btn-agendar"
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar
          </a>
          <button
            ref={botaoMenu}
            type="button"
            className="botao-menu"
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto((v) => !v)}
          >
            {aberto ? <IconeFechar /> : <IconeMenu />}
            <span className="oculto-visual">{aberto ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>

      <div
        id="menu-celular"
        className={`menu-celular ${aberto ? "menu-aberto" : ""}`}
        hidden={!aberto}
      >
        <nav aria-label="Seções do site, celular">
          {secoes.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setAberto(false)}
              style={{ transitionDelay: `${60 + i * 45}ms` }}
            >
              <span className="menu-numero">{String(i + 1).padStart(2, "0")}</span>
              {s.rotulo}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
