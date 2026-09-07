"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CARROS_INICIAIS } from "@/lib/carros";
import { lerTudo, useFoto, type CarroSalvo } from "@/lib/estoque";
import { brl, km, nome } from "@/lib/fmt";
import { CONTATO, SERVICOS, whatsapp } from "@/lib/contato";

/**
 * A ficha de um carro.
 *
 * Procura primeiro na lista publicada, em lib/carros.ts, que é o que sai
 * pronto do build com preço no HTML. Se não achar, procura no que a gerência
 * gravou neste navegador, e é isso que faz um carro recém cadastrado em /admin
 * ter página antes de existir banco.
 */

type Estado = "procurando" | "achou" | "nao-achou";

export default function FichaCarro({ slug }: { slug: string }) {
  const [carro, setCarro] = useState<CarroSalvo | null>(
    () => (CARROS_INICIAIS as CarroSalvo[]).find((c) => c.slug === slug) ?? null,
  );
  const [estado, setEstado] = useState<Estado>(() =>
    (CARROS_INICIAIS as CarroSalvo[]).some((c) => c.slug === slug)
      ? "achou"
      : "procurando",
  );

  useEffect(() => {
    if (estado === "achou") return;
    let vivo = true;
    lerTudo().then((salvo) => {
      if (!vivo) return;
      const achado = salvo?.find((c) => c.slug === slug) ?? null;
      setCarro(achado);
      setEstado(achado ? "achou" : "nao-achou");
    });
    return () => {
      vivo = false;
    };
  }, [slug, estado]);

  if (estado === "procurando") {
    return (
      <div className="casca py-24">
        <p className="corpo">Carregando o carro.</p>
      </div>
    );
  }

  if (!carro) {
    return (
      <div className="casca py-20">
        <p className="etiqueta mb-5">Carro não encontrado</p>
        <h1 className="display mb-5 max-w-[18ch] text-[clamp(1.8rem,4vw,3rem)]">
          Esse carro saiu do estoque
        </h1>
        <p className="corpo mb-9 max-w-[46ch]">
          Pode ter sido vendido ou o endereço mudou. Diga o que você procura e a
          equipe responde com o que tem hoje na loja.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            data-cta="nao-achou"
            href={whatsapp(
              "Olá! Vim pelo site e o carro que eu abri não estava mais lá. Queria ver o que tem disponível.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 text-[0.74rem] font-medium uppercase tracking-[0.13em]"
            style={{ background: "var(--brasa)", color: "var(--areia)" }}
          >
            Ver o que tem hoje
          </a>
          <Link
            href="/estoque"
            className="px-5 py-3.5 text-[0.74rem] uppercase tracking-[0.13em]"
            style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
          >
            Voltar ao estoque
          </Link>
        </div>
      </div>
    );
  }

  return <Ficha carro={carro} />;
}

function Ficha({ carro }: { carro: CarroSalvo }) {
  const src = useFoto(carro, "grande");
  const titulo = nome(carro);
  // Todas as fotos do carro, e não uma só. Quem compra sem ver quer olhar por
  // todos os lados antes de mandar mensagem.
  const galeria =
    carro.fotoEnviada || !carro.foto
      ? []
      : Array.from({ length: Math.max(0, carro.fotos - 1) }, (_, i) =>
          `/images/${carro.foto}-${i + 1}-1280.webp`,
        );

  const ficha = [
    { k: "Ano", v: carro.ano },
    { k: "Quilometragem", v: km(carro.km) },
    { k: "Motor", v: carro.motor },
    { k: "Potência", v: `${carro.potencia} cv` },
    { k: "Combustível", v: carro.combustivel },
    { k: "Câmbio", v: carro.cambio },
    { k: "Tração", v: carro.tracao },
  ].filter((l) => l.v && l.v !== "0 cv");

  return (
    <div className="casca">
      <Link
        href="/estoque"
        className="mb-8 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.13em] md:mb-12"
        style={{ color: "var(--tinta-3)" }}
      >
        <span aria-hidden="true">&larr;</span> Voltar ao estoque
      </Link>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="grid gap-3">
          {src ? (
            <img
              src={src}
              alt={`${titulo} ${carro.ano} na Delux Motors`}
              width={carro.nativa?.w ?? 1288}
              height={carro.nativa?.h ?? 1610}
              fetchPriority="high"
              decoding="async"
              className="w-full"
              style={{ background: "var(--nuvem)" }}
            />
          ) : (
            <p
              className="etiqueta flex aspect-[4/5] items-center justify-center px-6 text-center"
              style={{ background: "var(--nuvem)" }}
            >
              Foto ainda não publicada
            </p>
          )}
          {galeria.map((g, i) => (
            <img
              key={g}
              src={g}
              alt={`${titulo} ${carro.ano}, foto ${i + 2}`}
              width={carro.nativa?.w ?? 1288}
              height={carro.nativa?.h ?? 1610}
              loading="lazy"
              decoding="async"
              className="w-full"
              style={{ background: "var(--nuvem)" }}
            />
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="etiqueta mb-4">
            {carro.marca} · {carro.ano}
          </p>
          <h1 className="display mb-3 text-[clamp(1.9rem,4.2vw,3.2rem)]">
            {carro.modelo} {carro.versao}
          </h1>
          <p
            className="dado mb-8 text-[clamp(1.3rem,2.4vw,1.9rem)]"
            style={{ color: "var(--brasa)" }}
          >
            {brl(carro.preco)}
          </p>

          {carro.alertas?.length ? (
            <ul className="mb-7 grid gap-2">
              {carro.alertas.map((a) => (
                <li
                  key={a}
                  className="dado px-4 py-3 text-[0.78rem]"
                  style={{
                    border: "1px solid var(--brasa)",
                    color: "var(--brasa)",
                  }}
                >
                  {a}
                </li>
              ))}
            </ul>
          ) : null}

          <a
            data-cta="carro"
            href={whatsapp(
              `Olá! Vim pelo site e queria saber mais sobre o ${titulo} ${carro.ano}, de ${brl(carro.preco)}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-3 flex items-center justify-between gap-6 px-6 py-5 text-[0.76rem] font-medium uppercase tracking-[0.14em]"
            style={{ background: "var(--brasa)", color: "var(--areia)" }}
          >
            Perguntar sobre este carro
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1.5"
              style={{ transitionTimingFunction: "var(--e-saida)" }}
            >
              &rarr;
            </span>
          </a>
          <p className="dado mb-10 text-[0.72rem]" style={{ color: "var(--tinta-3)" }}>
            Ou ligue: {CONTATO.exibicao}
          </p>

          {ficha.length ? (
            <dl className="mb-10">
              {ficha.map((f) => (
                <div
                  key={f.k}
                  className="grid grid-cols-2 gap-4 border-t py-3.5"
                  style={{ borderColor: "var(--linha)" }}
                >
                  <dt className="etiqueta pt-0.5">{f.k}</dt>
                  <dd className="dado text-[0.86rem]">{f.v}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {carro.destaques?.length ? (
            <>
              <h2 className="etiqueta mb-4">O que tem neste</h2>
              <ul className="mb-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {carro.destaques.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-3 text-[0.9rem]"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 inline-block h-px w-3.5 shrink-0"
                      style={{ background: "var(--brasa)" }}
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <p className="corpo text-[0.84rem]">
            Tem o seu para dar de entrada? A gente{" "}
            <a
              href={whatsapp(SERVICOS[1].mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-[var(--brasa)]"
            >
              avalia na mesma conversa
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
