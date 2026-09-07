import Link from "next/link";
import { EMPRESA, whatsapp } from "@/lib/contato";

/**
 * A chamada do estoque.
 *
 * Enquanto o cliente não cadastra os carros em /admin, esta faixa não finge que
 * existe vitrine. Ela diz o que é verdade: o estoque gira, o que tem hoje sai
 * primeiro no Instagram deles, e a resposta mais rápida é perguntar.
 *
 * No dia em que o estoque entrar, esta faixa passa a mostrar os carros e a
 * frase muda. O que não pode é prometer catálogo e entregar página vazia.
 */

export default function SecaoEstoqueChamada({ total }: { total: number }) {
  const temEstoque = total > 0;

  return (
    <section
      id="estoque"
      className="secao"
      style={{ background: "var(--noite)" }}
      aria-labelledby="titulo-estoque"
    >
      <div className="casca">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
          <div>
            <p className="etiqueta mb-5">Estoque</p>
            <h2
              id="titulo-estoque"
              className="display max-w-[16ch] text-[clamp(1.9rem,4.4vw,3.4rem)]"
              data-revela
            >
              {temEstoque
                ? `${total} carros na loja agora`
                : "O estoque gira toda semana"}
            </h2>
          </div>

          <div data-revela>
            <p className="corpo mb-8 max-w-[44ch]">
              {temEstoque
                ? "Veja o estoque completo, com preço, ano e quilometragem de cada carro, e filtre por marca e faixa de preço."
                : `Carro bom não fica parado. O que entrou nesta semana sai primeiro no Instagram, em @${EMPRESA.instagram}, e quem pergunta no WhatsApp descobre antes de todo mundo.`}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                data-cta="estoque-whatsapp"
                href={whatsapp(
                  "Olá! Vim pelo site e queria saber quais carros vocês têm disponíveis agora.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 py-4 text-[0.76rem] font-medium uppercase tracking-[0.13em]"
                style={{ background: "var(--brasa)", color: "var(--breu)" }}
              >
                Perguntar o que tem hoje
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  style={{ transitionTimingFunction: "var(--e-saida)" }}
                >
                  &rarr;
                </span>
              </a>

              <Link
                data-cta="ver-estoque"
                href="/estoque"
                className="group relative py-1 text-[0.76rem] uppercase tracking-[0.13em]"
                style={{ color: "var(--tinta-2)" }}
              >
                Abrir a página de estoque
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
        </div>
      </div>
    </section>
  );
}
