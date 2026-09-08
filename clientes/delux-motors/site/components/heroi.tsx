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
 * site num momento anterior. A cena já está montada e pintada, e o que existe
 * por cima é um véu escuro que recua de baixo para cima, como a luz do dia
 * entrando. A marca se apresenta no meio da tela e recolhe. Nunca há corte.
 *
 * O conteúdo fica em opacidade cheia o tempo todo, inclusive a foto. Quem
 * esconde é o véu. Isso resolve duas coisas de uma vez: o navegador conta a
 * pintura para o LCP e o elemento está pintado desde o começo, então a abertura
 * pode ser longa sem custar carregamento; e não existe segunda animação para
 * sair de sincronia com esta.
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
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setP(0);
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

  const trava = (x: number) => Math.max(0, Math.min(1, x));

  // A luz sobe da borda de baixo até passar do topo. O véu é o negativo disso.
  const luz = trava(p / 0.66);
  // Sobe rápido e assenta devagar, como luz do dia entrando.
  const subida = 1 - Math.pow(1 - luz, 2.6);
  const borda = -8 + subida * 128; // em porcentagem da altura da tela

  // A marca entra cedo, segura enquanto a luz sobe, e recolhe no fim.
  const marcaEntra = trava((p - 0.1) / 0.18);
  const marcaSai = trava((p - 0.62) / 0.18);

  return (
    <section
      id="conteudo"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden pb-10 pt-28 md:pb-14"
    >
      <Ceu />

      {/* No celular o carro é um bloco no fluxo, embaixo do texto, e só o topo
          dele esmaece no céu. No desktop ele é painel à direita e a costura é
          na horizontal.

          As duas máscaras vivem aqui, na folha de estilo, e não no style inline
          do elemento. Estilo inline vence regra de media query, então a máscara
          do celular ficava valendo também no desktop: o painel não tinha
          esmaecimento nenhum do lado esquerdo e a emenda com o céu aparecia
          como uma linha reta atravessando a tela. */}
      <style>{`
        [data-foto-carro] {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 12%, #000 30%);
          mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 12%, #000 30%);
        }
        @media (min-width: 768px) {
          [data-foto-carro] {
            /* O esmaecimento da esquerda é longo de propósito. Curto demais, o
               céu da foto encosta no céu do shader com um degrau visível. */
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

      {/* Véu de leitura, só no desktop. Ali a copy fica por cima da foto e
          precisa de chão. No celular a foto está embaixo do texto, no fluxo, e
          não há nada para velar. Não é animado: faz parte da composição, não da
          abertura. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[15] hidden md:block"
        style={{
          background:
            "linear-gradient(95deg, var(--branco) 0%, rgba(255,255,255,0.94) 34%, rgba(255,255,255,0.45) 56%, transparent 76%)",
        }}
      />

      {/* o que precisa ser lido */}
      <div className="casca relative z-20">
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
                style={{ color: "var(--tinta)" }}
              >
                ou consignar
              </span>
            </span>
          </h1>

          <p className="corpo mb-8 max-w-[46ch]">
            Loja de carros na Av. Octávio Mangabeira. A gente compra o seu,
            vende os nossos selecionados e cuida da consignação do começo ao
            fim. A conversa começa no WhatsApp, direto com quem está na loja.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              data-cta="heroi"
              href={whatsapp(MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-4 text-[0.78rem] font-medium uppercase tracking-[0.14em]"
              style={{ background: "var(--tinta)", color: "var(--branco)" }}
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
              background: "var(--tinta)",
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

        {/* O CARRO.
            No celular é um bloco no fluxo, logo depois da legenda: o texto em
            cima, a foto embaixo, um debaixo do outro. Antes ele era absoluto
            também aqui, ancorado no fim da SEÇÃO, que é mais alta que a tela, e
            brigava com a faixa de dados: sobrava um pedaço do meio da picape
            cortado pela borda.
            No desktop volta a ser painel à direita, fora do fluxo. */}
        <div className="relative -mx-[calc((100vw-var(--casca))/2)] mt-8 md:absolute md:inset-y-0 md:right-0 md:mx-0 md:mt-0 md:flex md:w-[58%] md:items-end md:justify-end">
          <img
            data-foto-carro
            src={`/images/${DESTAQUE.foto}-1-1280.webp`}
            alt={`${DESTAQUE.marca} ${DESTAQUE.modelo} ${DESTAQUE.versao} ${DESTAQUE.ano}, no pátio da Delux Motors`}
            width={1280}
            height={1697}
            fetchPriority="high"
            decoding="async"
            className="h-[38svh] w-full object-cover object-[50%_56%] md:h-[84svh] md:w-auto md:max-w-none md:object-bottom"
            style={{
              // Quase sem cor de propósito. No herói a foto é atmosfera, e a
              // cor fica guardada para o catálogo, onde ajuda a escolher carro.
              //
              // Sem animação de opacidade: a foto é o maior elemento da tela e
              // precisa estar pintada desde o primeiro quadro, senão o LCP passa
              // a medir o fim da abertura.
              filter: "saturate(0.28) contrast(1.05)",
            }}
          />
        </div>

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

      {/* A ABERTURA.
          Um véu escuro cobrindo a cena inteira, que recua de baixo para cima.
          A cena por baixo já está montada e pintada: o véu só decide quando ela
          é vista. Sai do fluxo e não recebe clique, então o botão do cabeçalho
          continua clicável do primeiro quadro ao último. */}
      {p < 1 ? (
        <div
          data-abertura
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            background: `linear-gradient(to top,
              transparent ${borda - 26}%,
              rgba(10,10,10,0.55) ${borda - 9}%,
              rgba(10,10,10,0.97) ${borda}%,
              rgba(10,10,10,0.99) 100%)`,
          }}
        />
      ) : null}

      {/* A marca, no meio da tela, só durante a abertura. */}
      {p < 1 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
          style={{
            opacity: marcaEntra * (1 - marcaSai),
            transform: `scale(${1 - marcaSai * 0.14})`,
          }}
        >
          <p
            className="display text-center text-[clamp(3rem,13vw,10rem)] leading-none"
            style={{ color: "var(--branco)" }}
          >
            Delux
          </p>
        </div>
      ) : null}

    </section>
  );
}
