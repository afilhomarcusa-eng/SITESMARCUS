"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CONTATO, EMPRESA, HORARIO, whatsapp } from "@/lib/contato";
import { DURACAO_ABERTURA, deveAbrir } from "@/lib/abertura";
import { CARROS_INICIAIS } from "@/lib/carros";
import { brl } from "@/lib/fmt";

const Ceu = dynamic(() => import("./ceu"), { ssr: false });

const MSG = "Olá! Vim pelo site da Delux Motors e queria falar com vocês.";

/**
 * A chegada.
 *
 * A abertura não é uma tela de carregamento na frente do site: é o próprio
 * site num momento anterior. A luz sobe pela borda de baixo, o céu de Salvador
 * abre, a marca se apresenta no meio da tela e recolhe, e o carro aparece
 * embaixo do céu que já estava lá. Nunca há corte.
 *
 * O carro do herói é do estoque de verdade e está identificado, com preço e
 * link. Foto de carro em site de revenda sem dizer que carro é vira papel de
 * parede.
 *
 * O botão de WhatsApp do cabeçalho fica de fora de tudo isso, cheio e clicável
 * desde o primeiro quadro. Abertura que apaga a ação principal por alguns
 * segundos custa conversa, e ninguém percebe isso no olho.
 */

/** O carro da vitrine: o mais caro do estoque, que é o que puxa a atenção. */
const DESTAQUE = [...CARROS_INICIAIS].sort((a, b) => b.preco - a.preco)[0];

export default function Heroi() {
  // O relógio é daqui, e começa na montagem. Antes quem contava era o
  // componente do céu, e o DOM só revelava depois que o pacote do three
  // baixava: o tempo de carregar a biblioteca entrava na conta e empurrava o
  // LCP para quase três segundos.
  const [p, setP] = useState(1);
  // Valor estável: se isto mudasse a cada quadro, o efeito do céu remontaria e
  // o WebGL seria recriado quadro a quadro.
  const [rodarAbertura, setRodarAbertura] = useState(false);
  const abriuRef = useRef(false);

  /**
   * Esconder antes da primeira pintura.
   *
   * O estado nasce em 1, ou seja visível, porque é assim que o servidor
   * renderiza e é assim que fica sem JavaScript. Quando a abertura tem que
   * rodar, este efeito derruba para 0.
   *
   * Tem que ser useLayoutEffect: ele roda antes do navegador pintar, então o
   * visitante nunca vê o herói aparecer e sumir. Num useEffect comum, ou dentro
   * do requestAnimationFrame, o primeiro quadro já teria sido pintado com o
   * conteúdo na tela, e a abertura começaria com um pisca.
   *
   * A regra abaixo existe para evitar renderização em cascata, e está certa no
   * caso geral. Aqui é uma renderização a mais, antes da pintura, e é
   * exatamente o que se quer.
   */
  useLayoutEffect(() => {
    if (!deveAbrir()) return;
    abriuRef.current = true;
    /* eslint-disable react-hooks/set-state-in-effect */
    setRodarAbertura(true);
    setP(0);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!abriuRef.current) return;
    let raf = 0;
    let t0 = 0;
    let pulou = false;
    const pular = () => {
      pulou = true;
    };
    for (const ev of ["pointerdown", "wheel", "keydown", "touchstart"] as const) {
      window.addEventListener(ev, pular, { once: true, passive: true });
    }
    const passo = (agora: number) => {
      if (!t0) t0 = agora;
      const v = pulou ? 1 : Math.min(1, (agora - t0) / DURACAO_ABERTURA);
      setP(v);
      if (v < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => {
      cancelAnimationFrame(raf);
      for (const ev of ["pointerdown", "wheel", "keydown", "touchstart"] as const) {
        window.removeEventListener(ev, pular);
      }
    };
  }, []);

  // Os tempos não se sobrepõem e são apertados de propósito. A foto do herói é
  // o maior elemento da tela, então o momento em que ela aparece É o LCP.
  const trava = (x: number) => Math.max(0, Math.min(1, x));
  const marcaEntra = trava((p - 0.2) / 0.2);
  const marcaSai = trava((p - 0.44) / 0.14);
  const carro = trava((p - 0.48) / 0.2);
  const conteudo = trava((p - 0.56) / 0.22);

  return (
    <section
      id="conteudo"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden pb-10 pt-28 md:pb-14"
    >
      <Ceu abertura={rodarAbertura} />

      {/* O carro. Painel retrato à direita no desktop, faixa embaixo no
          celular, com o céu do shader continuando em volta. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-full items-end justify-end md:w-[58%]">
        <img
          data-foto-carro
          src={`/images/${DESTAQUE.foto}-1-1280.webp`}
          alt={`${DESTAQUE.marca} ${DESTAQUE.modelo} ${DESTAQUE.versao} ${DESTAQUE.ano}, no pátio da Delux Motors`}
          width={1280}
          height={1697}
          fetchPriority="high"
          decoding="async"
          className="h-[52svh] w-full object-cover object-bottom md:h-[84svh] md:w-auto md:max-w-none"
          style={{
            opacity: carro,
            transition: "opacity 600ms var(--e-saida)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 16%, #000 40%)",
          }}
        />
      </div>

      {/* No desktop o carro costura na horizontal, com o céu continuando à
          esquerda dele. No celular ele é faixa e a costura é na vertical. */}
      <style>{`
        @media (min-width: 768px) {
          [data-foto-carro] {
            /* O esmaecimento da esquerda é longo de propósito. Curto demais,
               o céu da foto encosta no céu do shader com um degrau visível, e
               a emenda entre os dois entrega que são duas imagens. */
            -webkit-mask-image:
              linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 26%, rgba(0,0,0,0.62) 48%, #000 72%),
              linear-gradient(to bottom, transparent 0%, #000 14%);
            mask-image:
              linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 26%, rgba(0,0,0,0.62) 48%, #000 72%),
              linear-gradient(to bottom, transparent 0%, #000 14%);
            -webkit-mask-composite: source-in;
            mask-composite: intersect;
          }
        }
      `}</style>

      {/* Véu por trás do texto. O céu e o carro são claros e a tinta é escura,
          então aqui o véu é da cor da página, não sombra. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[15] md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, var(--areia) 0%, rgba(242,239,234,0.94) 40%, rgba(242,239,234,0.45) 58%, transparent 78%)",
          opacity: conteudo,
          transition: "opacity 900ms var(--e-saida)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[15] hidden md:block"
        style={{
          background:
            "linear-gradient(95deg, var(--areia) 0%, rgba(242,239,234,0.92) 34%, rgba(242,239,234,0.42) 56%, transparent 76%)",
          opacity: conteudo,
          transition: "opacity 900ms var(--e-saida)",
        }}
      />

      {/* o que precisa ser lido */}
      <div
        className="casca relative z-20"
        style={{
          opacity: conteudo,
          transform: `translate3d(0, ${(1 - conteudo) * 2.5}rem, 0)`,
          transition: "opacity 800ms var(--e-saida), transform 800ms var(--e-saida)",
        }}
      >
        <div className="max-w-[54ch]">
          <p className="etiqueta mb-5">
            {EMPRESA.bairro} · {EMPRESA.cidade}, {EMPRESA.estado}
          </p>

          <h1 className="mb-6 md:mb-7">
            <span className="mascara">
              <span className="display block text-[clamp(2.4rem,6.4vw,5.4rem)]">
                Comprar, vender
              </span>
            </span>
            <span className="mascara">
              <span
                className="display block text-[clamp(2.4rem,6.4vw,5.4rem)]"
                style={{ color: "var(--brasa)" }}
              >
                ou consignar
              </span>
            </span>
          </h1>

          <p className="corpo mb-8 max-w-[46ch]">
            Loja de carros na Av. Octávio Mangabeira. A gente compra o seu,
            vende os nossos selecionados e cuida da consignação do começo ao
            fim. Sem formulário e sem espera: a conversa começa no WhatsApp.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              data-cta="heroi"
              href={whatsapp(MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-4 text-[0.78rem] font-medium uppercase tracking-[0.14em]"
              style={{ background: "var(--brasa)", color: "var(--areia)" }}
            >
              Falar no WhatsApp
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                style={{ transitionTimingFunction: "var(--e-saida)" }}
              >
                &rarr;
              </span>
            </a>

            <Link
              data-cta="heroi-estoque"
              href="/estoque"
              className="group relative py-1 text-[0.78rem] uppercase tracking-[0.14em]"
              style={{ color: "var(--tinta-2)" }}
            >
              Ver os {CARROS_INICIAIS.length} carros
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-300 group-hover:scale-x-0"
                style={{
                  background: "var(--tinta-3)",
                  transitionTimingFunction: "var(--e-saida)",
                }}
              />
            </Link>
          </div>
        </div>

        {/* O carro da cena, identificado. */}
        <Link
          href={`/estoque/${DESTAQUE.slug}`}
          data-destaque
          className="group mt-9 inline-flex items-start gap-4 md:mt-12"
        >
          <span
            aria-hidden="true"
            className="mt-2 block h-px w-8 shrink-0 transition-all duration-500 group-hover:w-12"
            style={{
              background: "var(--brasa)",
              transitionTimingFunction: "var(--e-saida)",
            }}
          />
          <span>
            <span className="etiqueta mb-1.5 block">Na foto, no estoque</span>
            <span className="display-leve block text-[clamp(1.02rem,1.6vw,1.32rem)]">
              {DESTAQUE.marca} {DESTAQUE.modelo} {DESTAQUE.versao}
            </span>
            <span
              className="dado mt-1.5 block text-[0.76rem]"
              style={{ color: "var(--tinta-3)" }}
            >
              {DESTAQUE.ano} · {brl(DESTAQUE.preco)}
            </span>
          </span>
        </Link>

        {/* No celular, este vão é o espaço do carro. */}
        <div aria-hidden="true" className="h-[26svh] md:hidden" />

        <dl className="faixa-dados risco -mx-[calc((100vw-var(--casca))/2)] mt-9 grid grid-cols-2 gap-x-6 gap-y-6 px-[calc((100vw-var(--casca))/2)] pb-6 pt-6 md:mx-0 md:mt-12 md:grid-cols-4 md:gap-x-10 md:px-0 md:pb-0">
          {[
            { k: "Onde", v: "Av. Octávio Mangabeira, 20" },
            { k: "Segunda a sexta", v: "09:00 às 18:00" },
            { k: "Sábado", v: "09:00 às 14:00" },
            { k: "WhatsApp", v: CONTATO.exibicao },
          ].map((d) => (
            <div key={d.k}>
              <dt className="etiqueta mb-1.5">{d.k}</dt>
              <dd className="dado text-[clamp(0.86rem,1.1vw,1rem)]">{d.v}</dd>
            </div>
          ))}
        </dl>
        <p className="so-leitor">{HORARIO.domingo}</p>
      </div>

      {/* A marca no meio da tela, só durante a abertura. Fica fora do fluxo e
          não recebe clique, então nunca fica na frente do botão do cabeçalho. */}
      {p < 1 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          style={{
            opacity: marcaEntra * (1 - marcaSai),
            transform: `scale(${1 - marcaSai * 0.22})`,
          }}
        >
          <p className="cromo display text-center text-[clamp(3rem,13vw,10rem)] leading-none">
            Delux
          </p>
        </div>
      ) : null}
    </section>
  );
}
