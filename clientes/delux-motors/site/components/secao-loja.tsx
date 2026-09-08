import Link from "next/link";
import { EMPRESA, ROTA_URL } from "@/lib/contato";

/**
 * A loja, apresentada.
 *
 * A foto é a fachada em Boca do Rio no fim da tarde, a única que existe da
 * loja. Ela vive aqui, e não no herói, por dois motivos: o herói mostra carro,
 * que é o que se vende, e esta foto é de entardecer, escura, então ela vale
 * mais como contraponto no meio de uma página clara do que como fundo.
 *
 * O resto da apresentação é feito com o que existe de verdade: as palavras que
 * eles mesmos usam, o endereço, o horário e o que a loja faz. Sem tempo de
 * mercado inventado, sem número de carros vendidos, sem equipe imaginária.
 */

const PILARES = [
  {
    t: "Loja física, não anúncio",
    d: "Você entra, vê o carro, senta dentro e conversa com quem vende. O endereço está logo abaixo.",
  },
  {
    t: "Carro selecionado",
    d: "O que entra na loja passa por conferência de procedência antes de ficar exposto.",
  },
  {
    t: "As três pontas",
    d: "Comprar, vender e consignar acontecem no mesmo lugar, com a mesma equipe.",
  },
];

export default function SecaoLoja() {
  return (
    <section id="loja" className="secao" style={{ background: "var(--nuvem)" }}>
      <div className="casca">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="etiqueta mb-5">A loja</p>
            <h2 className="display mb-7 text-[clamp(1.9rem,4.4vw,3.4rem)]" data-revela>
              Uma loja de bairro que trata carro como peça de vitrine
            </h2>

            {/* Frase deles, atribuída como deles. */}
            <figure className="m-0" data-revela>
              <blockquote className="m-0">
                <p
                  className="cromo display-leve text-[clamp(1.2rem,2.2vw,1.7rem)]"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  “{EMPRESA.assinatura}”
                </p>
              </blockquote>
              <figcaption className="etiqueta mt-3">
                A própria Delux Motors, no perfil do Instagram
              </figcaption>
            </figure>
          </div>

          <div>
            <figure className="m-0 mb-10" data-revela>
              <img
                src="/images/fachada-1200.webp"
                alt="Fachada da Delux Motors na Boca do Rio ao entardecer, com um conversível preto e uma moto estacionados na frente"
                width={1200}
                height={1600}
                loading="lazy"
                decoding="async"
                className="h-[44svh] w-full object-cover object-bottom md:h-[52svh]"
                style={{ background: "var(--nuvem)" }}
              />
              <figcaption className="etiqueta mt-3">
                A loja no fim da tarde. Foto do{" "}
                <a
                  href={ROTA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-[var(--tinta)]"
                >
                  perfil da empresa no Google
                </a>
                .
              </figcaption>
            </figure>

            <p className="corpo mb-10 max-w-[52ch]" data-revela>
              A Delux Motors fica na Boca do Rio, em Salvador, com o showroom
              envidraçado dando para a Av. Octávio Mangabeira. É uma operação
              enxuta, e isso é a vantagem: quem responde o WhatsApp é quem está
              na loja e sabe o que tem no pátio naquele dia.
            </p>

            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {PILARES.map((p) => (
                <div key={p.t} data-revela>
                  <dt className="display-leve mb-2.5 flex items-start gap-3 text-[1.02rem]">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 inline-block h-px w-5 shrink-0"
                      style={{ background: "var(--tinta)" }}
                    />
                    {p.t}
                  </dt>
                  <dd
                    className="pl-8 text-[0.9rem] leading-relaxed"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    {p.d}
                  </dd>
                </div>
              ))}
              <div data-revela>
                <dt className="display-leve mb-2.5 flex items-start gap-3 text-[1.02rem]">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 inline-block h-px w-5 shrink-0"
                    style={{ background: "var(--tinta)" }}
                  />
                  O dia a dia no Instagram
                </dt>
                <dd className="pl-8 text-[0.9rem] leading-relaxed" style={{ color: "var(--tinta-2)" }}>
                  O que entra e o que sai aparece primeiro em{" "}
                  <a
                    href={`https://www.instagram.com/${EMPRESA.instagram}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors duration-200 hover:text-[var(--tinta)]"
                  >
                    @{EMPRESA.instagram}
                  </a>
                  .
                </dd>
              </div>
            </dl>

            <Link
              data-cta="loja"
              href="/comprar"
              className="mt-11 inline-flex items-center gap-3 px-5 py-3.5 text-[0.74rem] uppercase tracking-[0.13em]"
              style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
              data-revela
            >
              Dizer o que procuro
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
