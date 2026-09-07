"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { EMPRESA, whatsapp } from "@/lib/contato";
import { brl, km } from "@/lib/fmt";
import Link from "next/link";

const CenaEstudio = dynamic(() => import("./cena-estudio"), { ssr: false });

const MSG = "Olá! Vim pelo site e queria falar sobre um carro do estoque.";

type Props = {
  /** Números calculados do próprio estoque, nunca escritos à mão. */
  total: number;
  menorPreco: number;
  maiorPreco: number;
  /** O carro que aparece na cena. Fica identificado, não é enfeite. */
  destaque: {
    slug: string;
    marca: string;
    modelo: string;
    versao: string;
    ano: string;
    km: number;
    preco: number;
    foto: string;
  };
};

export default function Heroi({ total, menorPreco, maiorPreco, destaque }: Props) {
  const foto = `${destaque.foto}-0`;
  const fotoAlt = `${destaque.marca} ${destaque.modelo} ${destaque.versao} branco, fotografado no estúdio da Usados de Luxo`;
  const [cenaPronta, setCenaPronta] = useState(false);
  const aoPronto = useCallback(() => setCenaPronta(true), []);

  const dados = [
    { k: "No estoque hoje", v: `${total} carros` },
    { k: "Faixa de preço", v: `${brl(menorPreco)} a ${brl(maiorPreco)}` },
    { k: `Google, ${EMPRESA.googleNotaColetadaEm}`, v: "4,5" },
    { k: "No Instagram", v: EMPRESA.instagramSeguidores },
  ];

  return (
    <section
      id="conteudo"
      className="parede relative isolate flex min-h-svh flex-col justify-start overflow-hidden pb-8 pt-24 md:justify-end md:pb-12 md:pt-28"
    >
      {/* fundo: o nome da casa em escala monumental. É decoração de textura,
          repete o que já está no cabeçalho e no rodapé, então pode ficar
          parcialmente coberto pelo carro sem esconder informação de ninguém. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-[14vh] z-10 select-none text-right md:top-[11vh]"
      >
        <p
          className="display leading-[0.82] text-[13vw] md:text-[10.5vw]"
          style={{
            color: "transparent",
            WebkitTextStroke: "1px rgba(237,235,231,0.10)",
          }}
        >
          Usados
          <br />
          de Luxo
        </p>
      </div>

      {/* meio: a foto real dentro da sala 3D. Passa na frente do texto acima. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <img
          src={`/images/${foto}-1440.webp`}
          alt={fotoAlt}
          width={1440}
          height={1800}
          fetchPriority="high"
          decoding="async"
          className="absolute bottom-0 right-[2%] h-[68vh] w-auto max-w-[62%] object-contain object-bottom transition-opacity duration-700 md:right-[6%] md:h-[80vh]"
          style={{
            opacity: cenaPronta ? 0 : 1,
            transitionTimingFunction: "var(--e-saida)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
          }}
        />
        <CenaEstudio
          foto={`/images/${foto}-1440.webp`}
          abertura
          onPronto={aoPronto}
        />
      </div>

      {/* Véu só no celular, atrás do texto. Na tela pequena o carro e a coluna
          de texto disputam o mesmo espaço, e sem isto o link secundário some
          em cima da lataria clara. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[25] h-[62%] md:hidden"
        style={{
          background:
            "linear-gradient(to bottom, var(--parede) 34%, rgba(19,19,19,0.86) 62%, transparent 100%)",
        }}
      />

      {/* frente: o que precisa ser lido. Nada passa por cima disto. */}
      <div className="casca relative z-30">
        <div>
          <p className="etiqueta mb-5 md:mb-7">
            {EMPRESA.cidade}, {EMPRESA.estado} · entrega em todo o Brasil
          </p>

          <h1 className="mb-6 md:mb-8">
            <span className="mascara" data-mascara>
              <span className="display block text-[clamp(2.6rem,7.6vw,6.4rem)]">
                Cada carro
              </span>
            </span>
            <span className="mascara" data-mascara>
              <span className="display-solto block text-[clamp(2rem,5.4vw,4.4rem)]">
                passa pelo
              </span>
            </span>
            <span className="mascara" data-mascara>
              <span
                className="display block text-[clamp(2.6rem,7.6vw,6.4rem)]"
                style={{ color: "var(--latao)" }}
              >
                estúdio
              </span>
            </span>
          </h1>

          <p className="corpo mb-8 max-w-[46ch] md:mb-10">
            Revenda de seminovos premium em Goiânia. Antes de entrar no estoque, o
            carro vai para a nossa sala de fotografia: parede preta, luz montada,
            placa da casa. Quem compra de outro estado decide por essa foto, então
            ela precisa mostrar o carro como ele é.
          </p>

          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              data-cta="heroi"
              href={whatsapp(MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="dado group inline-flex items-center gap-3 px-6 py-4 text-[0.74rem] uppercase tracking-[0.16em] transition-transform duration-300"
              style={{
                background: "var(--latao)",
                color: "var(--preto)",
                fontWeight: 500,
                transitionTimingFunction: "var(--e-saida)",
              }}
            >
              Falar com a equipe
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                style={{ transitionTimingFunction: "var(--e-saida)" }}
              >
                &rarr;
              </span>
            </a>

            <a
              href="#estoque"
              className="dado group relative py-1 text-[0.74rem] uppercase tracking-[0.16em]"
              style={{ color: "var(--tinta-2)" }}
            >
              Ver os {total} carros
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-300 group-hover:scale-x-0"
                style={{
                  background: "var(--tinta-3)",
                  transitionTimingFunction: "var(--e-saida)",
                }}
              />
            </a>
          </div>
        </div>

        {/* legenda do carro que está na cena. Foto de carro em site de revenda
            sem dizer que carro é vira papel de parede. */}
        <Link
          href={`/estoque/${destaque.slug}`}
          data-destaque
          className="group mt-10 inline-flex items-start gap-4 md:mt-14"
        >
          <span
            aria-hidden="true"
            className="mt-2 block h-px w-8 shrink-0 transition-all duration-500 group-hover:w-12"
            style={{ background: "var(--latao)", transitionTimingFunction: "var(--e-saida)" }}
          />
          <span>
            <span className="etiqueta mb-1.5 block">Na cena, em estoque</span>
            <span className="display-solto block text-[clamp(1.05rem,1.7vw,1.4rem)]">
              {destaque.marca} {destaque.modelo} {destaque.versao}
            </span>
            <span className="dado mt-1.5 block text-[0.74rem]" style={{ color: "var(--tinta-3)" }}>
              {destaque.ano} · {km(destaque.km)} · {brl(destaque.preco)}
            </span>
          </span>
        </Link>

        {/* No celular, este vão é o espaço do carro. O texto fica em cima, o
            carro no meio, os números embaixo, um embaixo do outro em vez de
            todos disputando o mesmo pedaço de tela. */}
        <div aria-hidden="true" className="h-[30svh] md:hidden" />

        {/* faixa de dados: tudo aqui é medido, nada é adjetivo. Também é o que
            segura a largura de telas grandes sem virar vazio.
            No celular ela ganha fundo próprio, sangrando de ponta a ponta,
            para não cair por cima da lataria clara. */}
        <dl
          className="faixa-dados risco -mx-[calc((100vw-var(--casca))/2)] grid grid-cols-2 gap-x-6 gap-y-7 px-[calc((100vw-var(--casca))/2)] pb-7 pt-7 md:mx-0 md:mt-16 md:grid-cols-4 md:gap-x-10 md:px-0 md:pb-0"
        >
          {dados.map((d) => (
            <div key={d.k}>
              <dt className="etiqueta mb-2">{d.k}</dt>
              <dd className="dado text-[clamp(0.95rem,1.5vw,1.35rem)]">{d.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
