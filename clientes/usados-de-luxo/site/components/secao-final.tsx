import {
  EMPRESA,
  ENDERECO_LINHA,
  EQUIPE,
  HORARIO,
  MAPS_URL,
  TELEFONE,
  whatsapp,
} from "@/lib/contato";

/**
 * O fecho.
 *
 * Repete o motivo da abertura: a parede escura, a luz entrando de lado e o U.
 * Começo e fim se referenciando é o que dá sensação de coisa terminada, em vez
 * de página que simplesmente acabou.
 */

const MSG = "Olá! Vim pelo site e queria falar sobre um carro.";

const LINKS = [
  { href: "/estoque", rotulo: "Estoque" },
  { href: "/#confianca", rotulo: "Por que daqui" },
  { href: "/#distancia", rotulo: "Como funciona" },
  { href: "/#loja", rotulo: "A loja" },
  { href: "/#duvidas", rotulo: "Dúvidas" },
];

export default function SecaoFinal({ total }: { total: number }) {
  return (
    <>
      <section
        className="parede relative isolate overflow-hidden"
        aria-labelledby="titulo-final"
      >
        {/* o feixe da abertura, de volta */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 14% 8%, rgba(208,176,96,0.16) 0%, transparent 62%)",
          }}
        />

        <div className="casca relative py-[clamp(5rem,14vh,11rem)]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end lg:gap-20">
            <div>
              <p
                aria-hidden="true"
                className="display mb-6 text-[2.4rem] leading-none"
                style={{ color: "var(--latao)" }}
              >
                U
              </p>
              <h2
                id="titulo-final"
                className="display max-w-[15ch] text-[clamp(2.2rem,6.2vw,5rem)]"
                data-revela="sobe"
              >
                Escolhe o carro. O resto a gente resolve daqui
              </h2>
            </div>

            <div data-revela="sobe">
              <p className="corpo mb-8 max-w-[38ch]">
                São {total} carros no estoque agora, todos fotografados na mesma
                sala. Diga qual chamou atenção e a equipe manda o que você
                precisar ver antes de decidir.
              </p>

              <a
                data-cta="final"
                href={whatsapp(MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="dado group inline-flex w-full items-center justify-between gap-6 px-6 py-5 text-[0.76rem] uppercase tracking-[0.16em] transition-transform duration-300 sm:w-auto"
                style={{
                  background: "var(--latao)",
                  color: "var(--preto)",
                  fontWeight: 500,
                  transitionTimingFunction: "var(--e-saida)",
                }}
              >
                Chamar no WhatsApp
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                  style={{ transitionTimingFunction: "var(--e-saida)" }}
                >
                  &rarr;
                </span>
              </a>

              <p className="dado mt-4 text-[0.72rem]" style={{ color: "var(--tinta-3)" }}>
                Ou ligue: {TELEFONE.exibicao}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="secao" style={{ paddingBlock: "clamp(3rem,7vh,5rem)" }}>
        <div className="casca">
          <div
            className="grid gap-10 border-t pt-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-14"
            style={{ borderColor: "var(--linha)" }}
          >
            <div>
              <p className="display-solto mb-4 text-[0.85rem] tracking-[0.16em]">
                Usados de Luxo
              </p>
              <p className="corpo max-w-[34ch] text-[0.88rem]">
                Revenda de seminovos premium em {EMPRESA.cidade}. Compra, venda,
                consignação e financiamento, com entrega em todo o Brasil.
              </p>
            </div>

            <nav aria-label="Rodapé">
              <p className="etiqueta mb-4">Seções</p>
              <ul className="grid gap-2.5">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-[0.88rem] transition-colors duration-200 hover:text-[var(--latao)]"
                      style={{ color: "var(--tinta-2)" }}
                    >
                      {l.rotulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="etiqueta mb-4">Contato</p>
              <ul className="grid gap-2.5 text-[0.88rem]">
                <li>
                  <a
                    href={TELEFONE.tel}
                    className="transition-colors duration-200 hover:text-[var(--latao)]"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    {TELEFONE.exibicao}
                  </a>
                </li>
                {EQUIPE.map((p) => (
                  <li key={p.e164}>
                    <a
                      href={whatsapp(`Olá, ${p.nome}! Vim pelo site.`, p.e164)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-200 hover:text-[var(--latao)]"
                      style={{ color: "var(--tinta-2)" }}
                    >
                      {p.nome}, {p.papel.toLowerCase()}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`https://www.instagram.com/${EMPRESA.instagram}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:text-[var(--latao)]"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={EMPRESA.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:text-[var(--latao)]"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="mt-10 flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between"
            style={{ borderColor: "var(--linha)" }}
          >
            <p className="dado text-[0.68rem]" style={{ color: "var(--tinta-3)" }}>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--latao)]"
              >
                {ENDERECO_LINHA}
              </a>
            </p>
            <p className="dado text-[0.68rem]" style={{ color: "var(--tinta-3)" }}>
              {HORARIO.linha}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
