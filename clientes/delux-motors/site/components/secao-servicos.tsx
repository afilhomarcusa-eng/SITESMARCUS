import { SERVICOS, whatsapp } from "@/lib/contato";

/**
 * As três portas.
 *
 * A Delux Motors faz exatamente três coisas, e não fui eu que decidi isso: as
 * três únicas publicações estáticas do Instagram deles são Compra, Venda e
 * Consignação, uma para cada. A página inteira é organizada assim porque é
 * assim que o negócio funciona.
 *
 * Cada porta tem o próprio botão, com a própria mensagem já escrita. Quem
 * chega querendo vender o carro não deveria ter que abrir uma conversa em
 * branco e explicar do zero.
 */

const PASSOS: Record<string, string[]> = {
  comprar: [
    "Diga o que procura e a faixa de preço",
    "A gente manda o que tem, com foto e vídeo",
    "Você vem ver na loja ou fecha por lá mesmo",
  ],
  vender: [
    "Mande as fotos e os dados do seu carro",
    "A avaliação sai na conversa, sem enrolação",
    "Fechou, a gente resolve a documentação",
  ],
  consignar: [
    "Seu carro fica exposto na loja",
    "A gente anuncia, atende e negocia por você",
    "Você recebe quando a venda fecha",
  ],
};

export default function SecaoServicos() {
  return (
    <section id="servicos" className="secao" style={{ background: "var(--branco)" }}>
      <div className="casca">
        <div className="mb-12 max-w-[46ch] md:mb-16">
          <p className="etiqueta mb-5">O que fazemos</p>
          <h2
            className="display text-[clamp(1.9rem,4.4vw,3.4rem)]"
            data-revela
          >
            Três formas de resolver o seu carro
          </h2>
        </div>

        <div className="grid gap-px" style={{ background: "var(--linha)" }}>
          {SERVICOS.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              data-servico={s.id}
              data-revela
              className="group grid gap-6 px-0 py-9 md:grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-start md:gap-10 md:py-11"
              style={{ background: "var(--branco)" }}
            >
              <p
                className="display text-[clamp(2.2rem,4vw,3rem)] leading-none"
                style={{ color: "var(--tinta)", opacity: 0.85 }}
              >
                0{i + 1}
              </p>

              <div>
                <h3 className="display-leve mb-3 text-[clamp(1.3rem,2.3vw,1.85rem)]">
                  {s.titulo}
                </h3>
                <p className="corpo max-w-[34ch] text-[0.96rem]">{s.resumo}</p>
              </div>

              <ol className="grid gap-2.5">
                {PASSOS[s.id].map((passo, n) => (
                  <li
                    key={passo}
                    className="flex gap-3 text-[0.88rem]"
                    style={{ color: "var(--tinta-2)" }}
                  >
                    <span
                      className="dado shrink-0 pt-0.5 text-[0.7rem]"
                      style={{ color: "var(--tinta-3)" }}
                    >
                      {n + 1}
                    </span>
                    {passo}
                  </li>
                ))}
              </ol>

              <a
                data-cta={`servico-${s.id}`}
                href={whatsapp(s.mensagem)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-3 self-start px-5 py-3.5 text-[0.74rem] uppercase tracking-[0.13em] transition-colors duration-300"
                style={{
                  border: "1px solid var(--tinta)",
                  color: "var(--tinta)",
                }}
              >
                {s.verbo}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  style={{ transitionTimingFunction: "var(--e-saida)" }}
                >
                  &rarr;
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
