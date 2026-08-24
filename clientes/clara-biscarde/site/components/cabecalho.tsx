"use client";

/**
 * Cabeçalho fixo. Encolhe depois de 80px de scroll.
 * Transição de 250ms só em altura e fundo, conforme o Bloco 6 do briefing.
 * Isso não conta como animação de seção.
 */

import Image from "next/image";
import { useEffect, useState } from "react";
import { clara, links, menu, agendar } from "@/lib/clara";
import { cn } from "@/lib/utils";
import { IconeWhatsapp, IconeInstagram } from "@/components/icones-sociais";

/**
 * WhatsApp e Instagram no canto superior esquerdo, colados na assinatura.
 *
 * Os dois aparecem sempre, porque são peça de design do cabeçalho. O que não
 * aparece é destino inventado: enquanto o dado não estiver em lib/clara.ts o
 * ícone é um selo, não um link. Assim que o número e o @ entrarem, cada um
 * vira link sozinho.
 */
function Redes({
  encolhido,
  sempre = false,
}: {
  encolhido: boolean;
  /** Ignora o corte por largura. Usado dentro do menu do celular. */
  sempre?: boolean;
}) {
  const redes = [
    { nome: "WhatsApp", href: links.whatsapp, Icone: IconeWhatsapp },
    { nome: "Instagram", href: links.instagram, Icone: IconeInstagram },
  ];

  const forma = cn(
    "flex items-center justify-center rounded-full border border-borda",
    "text-tinta-media transition-[height,width,color,border-color]",
    "duration-[250ms] ease-out",
    encolhido ? "h-8 w-8" : "h-9 w-9",
  );

  return (
    <div
      className={cn("items-center gap-2", sempre ? "flex" : "hidden sm:flex")}
    >
      {redes.map(({ nome, href, Icone }) =>
        href ? (
          <a
            key={nome}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={nome}
            className={cn(forma, "hover:border-coral hover:text-coral-texto")}
          >
            <Icone className="h-4 w-4" />
          </a>
        ) : (
          <span key={nome} aria-hidden className={forma}>
            <Icone className="h-4 w-4" />
          </span>
        ),
      )}
    </div>
  );
}

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
          : "py-4 shadow-[0_1px_0_transparent]",
      )}
    >
      <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-6 px-6 md:px-10">
        {/* Canto superior esquerdo: assinatura e, colado nela, as redes. */}
        <div className="flex shrink-0 items-center gap-4">
          {/*
            Só a assinatura entra como imagem. A profissão e o CRP viram texto
            de verdade: no logo original eles são miúdos demais e viram borrão
            em qualquer tamanho de cabeçalho.
          */}
          {/* A assinatura entra sem filtro nenhum, nas cores originais do logo. */}
          <a href="#topo" className="flex shrink-0 items-center gap-3.5">
            <Image
              src="/logo-assinatura.png"
              sizes="220px"
              alt={clara.nome}
              width={3124}
              height={841}
              priority
              className={cn(
                "w-auto transition-[height] duration-[250ms] ease-out",
                encolhido ? "h-9" : "h-12",
              )}
            />
            {/* Some na faixa em que o menu horizontal disputa espaço: a profissão
                e o CRP já aparecem na capa e no rodapé, o menu não tem onde
                mais aparecer. */}
            <span className="hidden border-l border-borda pl-3.5 leading-[1.35] sm:max-[1099px]:block 2xl:block">
              <span className="block text-micro uppercase tracking-[0.16em] text-tinta-media">
                {clara.profissao}
              </span>
              <span className="block text-micro uppercase tracking-[0.16em] text-tinta-media">
                {clara.registro}
              </span>
            </span>
          </a>

          <Redes encolhido={encolhido} />
        </div>

        {/*
          whitespace-nowrap para "Sobre mim" e "Como começa" não quebrarem em
          duas linhas.

          Em linha única os cinco itens pedem 589px fixos, e isso muda onde o
          menu horizontal cabe. Abaixo de 1100px não cabe de jeito nenhum ao
          lado da assinatura e do botão, então ali é o hambúrguer que atende.
          Daí para cima o gap abre junto com a tela.
        */}
        <nav className="hidden items-center gap-4 min-[1100px]:flex xl:gap-6 2xl:gap-8">
          {menu.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-mini uppercase tracking-[0.14em] text-tinta-media transition-colors hover:text-coral-texto"
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
            /* 44px é o mínimo confortável para o dedo. Antes eram 36. */
            className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px] min-[1100px]:hidden"
          >
            <span className="h-px w-5 bg-tinta" />
            <span className="h-px w-5 bg-tinta" />
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="mt-3 border-t border-borda px-6 pb-2 pt-4 min-[1100px]:hidden">
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

            {/* No celular não sobra largura ao lado da assinatura, então as
                redes descem para cá em vez de sumirem. */}
            <li className="pt-1">
              <Redes encolhido={false} sempre />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
