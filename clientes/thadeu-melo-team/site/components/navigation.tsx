"use client";
import { useEffect, useRef, useState } from "react";
import { club } from "@/lib/content";
import { Arrow, Wordmark } from "./icons";
export function Navigation() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    const onClick = (event: MouseEvent) => { if (!navRef.current?.contains(event.target as Node)) setOpen(false); };
    const query = matchMedia("(min-width: 761px)");
    const onSize = () => { if (query.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    query.addEventListener("change", onSize);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); query.removeEventListener("change", onSize); };
  }, [open]);
  return <header className="site-header" ref={navRef}>
    <a className="brand" href="#inicio" aria-label="Thadeu Melo Team, início" onClick={() => setOpen(false)}><Wordmark /></a>
    <span className="header-location">Clube de corrida<br />Aracaju, Sergipe</span>
    <button ref={buttonRef} type="button" className="menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? "Fechar" : "Menu"}<span aria-hidden="true">{open ? "−" : "+"}</span></button>
    <nav id="main-nav" className={open ? "main-nav is-open" : "main-nav"} aria-label="Navegação principal">
      <a href="#clube" onClick={() => setOpen(false)}>O clube</a>
      <a href="#treinos" onClick={() => setOpen(false)}>Onde treinamos</a>
      <a href="#duvidas" onClick={() => setOpen(false)}>Dúvidas</a>
    </nav>
    <a className="header-cta" href={club.whatsapp} target="_blank" rel="noopener noreferrer">Quero correr<Arrow diagonal /></a>
  </header>;
}
