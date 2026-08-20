"use client";

/**
 * Cabeçalho fixo. Encolhe depois de 80px de scroll.
 * Transição de 250ms só em altura e fundo, conforme o Bloco 6 do briefing.
 * Isso não conta como animação de seção.
 */

import Image from "next/image";
import { useEffect, useState } from "react";
import { clara, menu, agendar } from "@/lib/clara";
import { cn } from "@/lib/utils";

export function Cabecalho() {
  const [encolhido, setEncolhido] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setEncolhido(window.scrollY > 80);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    /*
      Fundo claro conforme o manual: a assinatura tem uso preferencial em
      fundo claro e limpo, e as cores do lettering não podem ser trocadas.
    */
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-creme/95 backdrop-blur-sm",
        "transition-[padding,box-shadow] duration-[250ms] ease-out",
        encolhido
          ? "py-2 shadow-[0_1px_0_var(--color-borda)]"
          : "py-4 shadow-[0_1px_0_transparent]"
      )}
    >
      <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-6 px-6 md:px-10">
        {/*
          Só a assinatura entra como imagem. A profissão e o CRP viram texto
          de verdade: no logo original eles são miúdos demais e viram borrão
          em qualquer tamanho de cabeçalho.
        */}
        {/* A assinatura entra sem filtro nenhum, nas cores originais do logo. */}
        <a href="#topo" className="flex shrink-0 items-center gap-3.5">
          <Image
            src="/logo-assinatura.png"
            alt={clara.nome}
            width={3124}
            height={841}
            priority
            className={cn(
              "w-auto transition-[height] duration-[250ms] ease-out",
              encolhido ? "h-9" : "h-12"
            )}
          />
          <span className="hidden border-l border-borda pl-3.5 leading-[1.35] sm:block">
            <span className="block text-micro uppercase tracking-[0.16em] text-tinta-media">
              {clara.profissao}
            </span>
            <span className="block text-micro uppercase tracking-[0.16em] text-tinta-media">
              {clara.registro}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {menu.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-mini uppercase tracking-[0.14em] text-tinta-media transition-colors hover:text-coral-texto"
            >
              {item.rotulo}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {agendar && (
            <a
              href={agendar}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-botao bg-coral px-6 py-2.5 text-mini font-semibold uppercase tracking-[0.1em] text-tinta transition-transform duration-300 hover:scale-[1.03] sm:inline-block"
            >
              Agendar
            </a>
          )}

          <button
            type="button"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-label="Abrir menu"
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span className="h-px w-5 bg-tinta" />
            <span className="h-px w-5 bg-tinta" />
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="mt-3 border-t border-borda px-6 pb-2 pt-4 lg:hidden">
          <ul className="flex flex-col gap-4">
            {menu.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="text-mini uppercase tracking-[0.14em] text-tinta-media"
                >
                  {item.rotulo}
                </a>
              </li>
            ))}
            {agendar && (
              <li>
                <a
                  href={agendar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-botao bg-coral px-5 py-2 text-mini font-semibold uppercase tracking-[0.1em] text-tinta"
                >
                  Agendar
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
