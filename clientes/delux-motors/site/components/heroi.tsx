"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { CONTATO, EMPRESA, HORARIO } from "@/lib/contato";
import { CARROS_INICIAIS } from "@/lib/carros";
import { brl } from "@/lib/fmt";

const Ceu = dynamic(() => import("./ceu"), { ssr: false });

/**
 * A chegada.
 *
 * Este componente nao sabe que existe uma abertura, e isso e a correcao.
 *
 * Ele ja foi o dono do relogio dela, e ali estava o problema: o veu nascia do
 * estado do React, ou seja depois da hidratacao, enquanto o HTML do servidor
 * ja tinha sido pintado sem veu nenhum. A cena aparecia aberta e a abertura
 * caia por cima atrasada.
 *
 * Agora a cortina e um elemento do servidor, animado por CSS, em
 * components/cortina.tsx. O heroi so monta a cena e a pinta imediatamente, na
 * opacidade cheia, sempre. Quem decide quando ela e vista e a cortina, por
 * cima. Sem estado compartilhado, nao ha o que sair de sincronia.
 *
 * O carro do heroi e do estoque de verdade e esta identificado, com preco e
 * link. Foto de carro em site de revenda sem dizer que carro e vira papel de
 * parede.
 */

/** O carro da vitrine: o mais caro do estoque, que é o que puxa a atenção. */
const DESTAQUE = [...CARROS_INICIAIS].sort((a, b) => b.preco - a.preco)[0];

export default function Heroi() {
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
            {/* Vai para o formulário de compra, e não direto para a conversa.
                A pessoa escolhe outro serviço numa aba lá em cima se for o
                caso. A saída direta para o WhatsApp continua existindo, no
                botão do cabeçalho, para quem só quer falar. */}
            <Link
              data-cta="heroi"
              href="/comprar"
              className="group inline-flex items-center gap-3 px-6 py-4 text-[0.78rem] font-medium uppercase tracking-[0.14em]"
              style={{ background: "var(--tinta)", color: "var(--branco)" }}
            >
              Falar com a loja
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                style={{ transitionTimingFunction: "var(--e-saida)" }}
              >
                &rarr;
              </span>
            </Link>

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

    </section>
  );
}
