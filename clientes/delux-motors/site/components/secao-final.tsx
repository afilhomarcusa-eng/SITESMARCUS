import Link from "next/link";
import {
  CONTATO,
  EMPRESA,
  ENDERECO_LINHA,
  HORARIO,
  ROTA_URL,
  SERVICOS,
  whatsapp,
} from "@/lib/contato";

/**
 * O fecho.
 *
 * Repete o motivo da abertura: a luz do horizonte, agora como uma sombra
 * rasa na borda de baixo. Começo e fim se referenciando é o que dá sensação de coisa
 * terminada, em vez de página que simplesmente acabou.
 */

const MSG = "Olá! Vim pelo site da Delux Motors e queria falar com vocês.";

const LINKS = [
  { href: "/#servicos", rotulo: "Serviços" },
  { href: "/estoque", rotulo: "Estoque" },
  { href: "/#loja", rotulo: "A loja" },
  { href: "/#local", rotulo: "Como chegar" },
  { href: "/#duvidas", rotulo: "Dúvidas" },
];

export default function SecaoFinal() {
  return (
    <>
      <section className="relative isolate overflow-hidden" aria-labelledby="titulo-final">
        {/* a brasa da abertura, agora na borda de baixo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.07) 0%, rgba(10,10,10,0.03) 26%, transparent 62%)",
          }}
        />

        <div className="casca relative py-[clamp(4.5rem,13vh,10rem)]">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-20">
            <div>
              <p className="cromo display mb-6 text-[2rem] leading-none">Delux</p>
              <h2
                id="titulo-final"
                className="display max-w-[16ch] text-[clamp(2rem,5.6vw,4.4rem)]"
                data-revela
              >
                Diga o que você precisa e a gente resolve daqui
              </h2>
            </div>

            <div data-revela>
              <p className="corpo mb-8 max-w-[38ch]">
                Comprar, vender ou consignar. A conversa começa no WhatsApp e
                continua na loja, na Boca do Rio, se você quiser ver de perto.
              </p>

              <a
                data-cta="final"
                href={whatsapp(MSG)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-4 flex w-full items-center justify-between gap-6 px-6 py-5 text-[0.78rem] font-medium uppercase tracking-[0.14em] sm:w-auto"
                style={{ background: "var(--tinta)", color: "var(--branco)" }}
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

              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {SERVICOS.map((s) => (
                  <a
                    key={s.id}
                    href={whatsapp(s.mensagem)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.78rem] underline decoration-[var(--tinta-3)] underline-offset-4 transition-colors duration-200 hover:text-[var(--tinta)]"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    {s.verbo}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="secao" style={{ paddingBlock: "clamp(3rem,7vh,4.5rem)" }}>
        <div className="casca">
          <div
            className="grid gap-10 border-t pt-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-14"
            style={{ borderColor: "var(--linha)" }}
          >
            <div>
              <p className="cromo display mb-3 text-[1.3rem] leading-none">Delux</p>
              <p className="corpo max-w-[34ch] text-[0.88rem]">
                Compra, venda e consignação de carros em {EMPRESA.cidade}, na{" "}
                {EMPRESA.bairro}.
              </p>
            </div>

            <nav aria-label="Rodapé">
              <p className="etiqueta mb-4">Seções</p>
              <ul className="grid gap-2.5">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[0.88rem] transition-colors duration-200 hover:text-[var(--tinta)]"
                      style={{ color: "var(--tinta-2)" }}
                    >
                      {l.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="etiqueta mb-4">Contato</p>
              <ul className="grid gap-2.5 text-[0.88rem]">
                <li>
                  <a
                    href={CONTATO.tel}
                    className="dado transition-colors duration-200 hover:text-[var(--tinta)]"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    {CONTATO.exibicao}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://www.instagram.com/${EMPRESA.instagram}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:text-[var(--tinta)]"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    @{EMPRESA.instagram}
                  </a>
                </li>
                <li>
                  <a
                    href={ROTA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:text-[var(--tinta)]"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    Traçar rota
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="mt-10 flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between"
            style={{ borderColor: "var(--linha)" }}
          >
            <p className="dado text-[0.7rem]" style={{ color: "var(--tinta-3)" }}>
              {ENDERECO_LINHA}
            </p>
            <p className="dado text-[0.7rem]" style={{ color: "var(--tinta-3)" }}>
              {HORARIO.semana} · {HORARIO.sabado}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
