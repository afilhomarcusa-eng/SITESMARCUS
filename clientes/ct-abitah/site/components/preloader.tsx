"use client";

import { useEffect, useState } from "react";

/*
 * A cortina que abre o site, no formato da referencia que o cliente mandou:
 * fundo liso, um circulo de traco fino e a marca dentro, apagada. O circulo se
 * desenha, a marca aparece e a cortina sobe revelando a entrada.
 *
 * Quem pediu menos animacao no sistema pula tudo: a cortina nem chega a montar.
 */
const DURACAO = 1750;

export function Preloader() {
  const [fase, setFase] = useState<"entrando" | "saindo" | "fora">("entrando");

  useEffect(() => {
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (semMovimento) {
      setFase("fora");
      document.documentElement.classList.add("curtain-done");
      return;
    }
    document.documentElement.classList.add("curtain-on");
    const sai = window.setTimeout(() => setFase("saindo"), DURACAO);
    const fim = window.setTimeout(() => {
      setFase("fora");
      document.documentElement.classList.remove("curtain-on");
      document.documentElement.classList.add("curtain-done");
    }, DURACAO + 900);
    return () => {
      window.clearTimeout(sai);
      window.clearTimeout(fim);
    };
  }, []);

  if (fase === "fora") return null;

  return (
    <div className={fase === "saindo" ? "curtain is-out" : "curtain"} aria-hidden="true">
      <div className="curtain-in">
        <svg className="curtain-ring" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="99" />
        </svg>
        <img className="curtain-logo" src="/images/logo.png" alt="" width={1200} height={330} />
      </div>
    </div>
  );
}
