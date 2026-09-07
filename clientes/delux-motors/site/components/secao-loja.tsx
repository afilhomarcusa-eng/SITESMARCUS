import { EMPRESA, whatsapp } from "@/lib/contato";

/**
 * A loja, apresentada.
 *
 * Aqui não entra segunda fotografia, e não é descuido: existe uma só, a da
 * fachada, e ela já está no herói. Repetir a mesma imagem embaixo, cortada
 * diferente, seria a mesma foto fingindo ser duas, e todo mundo percebe.
 *
 * Então a apresentação é feita com o que existe de verdade: as palavras que
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
    <section id="loja" className="secao" style={{ background: "var(--noite)" }}>
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
                      style={{ background: "var(--brasa)" }}
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
                    style={{ background: "var(--brasa)" }}
                  />
                  O dia a dia no Instagram
                </dt>
                <dd className="pl-8 text-[0.9rem] leading-relaxed" style={{ color: "var(--tinta-2)" }}>
                  O que entra e o que sai aparece primeiro em{" "}
                  <a
                    href={`https://www.instagram.com/${EMPRESA.instagram}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors duration-200 hover:text-[var(--brasa)]"
                  >
                    @{EMPRESA.instagram}
                  </a>
                  .
                </dd>
              </div>
            </dl>

            <a
              data-cta="loja"
              href={whatsapp(
                "Olá! Vim pelo site e queria saber o que tem na loja hoje.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-11 inline-flex items-center gap-3 px-5 py-3.5 text-[0.74rem] uppercase tracking-[0.13em]"
              style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
              data-revela
            >
              Perguntar o que tem hoje
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
