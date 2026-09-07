import { EMPRESA, ENDERECO_LINHA, EQUIPE, HORARIO } from "@/lib/contato";

/**
 * Dúvidas.
 *
 * Escritas a partir do que trava de verdade quem compra de outro estado, não a
 * partir de uma lista genérica. Toda resposta só afirma coisa que dá para
 * confirmar nas fontes do cliente.
 */

export const DUVIDAS = [
  {
    p: "Dá para comprar sem ver o carro pessoalmente?",
    r: `Dá, e é assim que a maior parte das vendas acontece. Antes de fechar, peça no WhatsApp o que faltar: vídeo andando, detalhe da roda, do banco, do porta-malas, do que você quiser. ${EQUIPE[0].nome} manda.`,
  },
  {
    p: "Vocês entregam no meu estado?",
    r: "Entregamos em todo o Brasil. O envio é combinado junto com o fechamento da compra.",
  },
  {
    p: "Aceitam meu carro na troca?",
    r: "Aceitamos. Trabalhamos com compra do seu usado e também com consignação, quando você prefere que a gente venda para você.",
  },
  {
    p: "Tem financiamento?",
    r: `Tem. ${EQUIPE[1].nome} é quem cuida da parte de financiamento bancário e atende no ${EQUIPE[1].exibicao}.`,
  },
  {
    p: "O preço do site é o mesmo do Instagram?",
    r: "É o mesmo. Cada carro mostra aqui o valor que publicamos no perfil. Condição de pagamento e frete a gente acerta na conversa.",
  },
  {
    p: "Posso ir até a loja?",
    r: `Pode. Estamos em ${ENDERECO_LINHA}. ${HORARIO.linha}.`,
  },
];

export default function SecaoDuvidas() {
  return (
    <section
      id="duvidas"
      className="secao"
      style={{ background: "var(--fumaca)" }}
      aria-labelledby="titulo-duvidas"
    >
      <div className="casca">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="etiqueta mb-5">Dúvidas</p>
            <h2
              id="titulo-duvidas"
              className="display text-[clamp(1.8rem,3.4vw,2.8rem)]"
              data-revela="sobe"
            >
              O que perguntam antes de fechar
            </h2>
          </div>

          <div>
            {DUVIDAS.map((d, i) => (
              <details
                key={d.p}
                name="duvidas"
                open={i === 0}
                className="group border-t"
                style={{ borderColor: "var(--linha)" }}
                data-revela="sobe"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6">
                  <h3 className="display-solto text-[clamp(1.05rem,1.8vw,1.4rem)]">
                    {d.p}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-[1.1rem] leading-none transition-transform duration-300 group-open:rotate-45"
                    style={{
                      color: "var(--latao)",
                      transitionTimingFunction: "var(--e-saida)",
                    }}
                  >
                    +
                  </span>
                </summary>
                <p className="corpo max-w-[58ch] pb-7 text-[0.98rem]">{d.r}</p>
              </details>
            ))}
            <div className="border-t" style={{ borderColor: "var(--linha)" }} />
            <p className="corpo mt-7 text-[0.9rem]">
              Ficou alguma coisa de fora? Chame no WhatsApp e pergunte direto.
              Quem responde é a equipe da loja em {EMPRESA.cidade}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
