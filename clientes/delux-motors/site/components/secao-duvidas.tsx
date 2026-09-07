import { CONTATO, EMPRESA, ENDERECO_LINHA, HORARIO } from "@/lib/contato";

/**
 * Dúvidas.
 *
 * Escritas a partir do que trava quem está decidindo, e cada resposta só
 * afirma o que dá para confirmar: os três serviços que eles anunciam, o
 * endereço, o horário e o perfil. Nada de garantia, prazo ou laudo inventado
 * para a seção parecer mais completa.
 */

export const DUVIDAS = [
  {
    p: "Vocês compram meu carro mesmo se eu não comprar outro?",
    r: "Compram. A compra é um serviço por si só: você manda as fotos e os dados pelo WhatsApp, recebe a avaliação e, se fechar, a gente resolve a documentação.",
  },
  {
    p: "Como funciona a consignação?",
    r: "Seu carro fica exposto na loja e a Delux Motors cuida do anúncio, do atendimento e da negociação. Você só entra na conversa quando a venda fecha.",
  },
  {
    p: "Quero trocar o meu por um de vocês. Dá?",
    r: "Dá. Como a loja compra e vende, as duas pontas são acertadas na mesma conversa, e a diferença fica clara antes de qualquer decisão.",
  },
  {
    p: "Onde vejo os carros disponíveis?",
    r: `O que está na loja aparece primeiro no Instagram, em @${EMPRESA.instagram}. Para saber o que tem hoje mesmo, o caminho mais curto é perguntar no ${CONTATO.exibicao}.`,
  },
  {
    p: "Posso ir até a loja sem avisar?",
    r: `Pode. Estamos em ${ENDERECO_LINHA}. ${HORARIO.semana}, e ${HORARIO.sabado.toLowerCase()}. ${HORARIO.domingo}.`,
  },
  {
    p: "Vocês atendem quem é de fora de Salvador?",
    r: "O atendimento começa no WhatsApp de qualquer lugar, com foto e vídeo do carro. A retirada e a forma de envio a gente combina na conversa, caso a caso.",
  },
];

export default function SecaoDuvidas() {
  return (
    <section
      id="duvidas"
      className="secao"
      style={{ background: "var(--nuvem)" }}
      aria-labelledby="titulo-duvidas"
    >
      <div className="casca">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="etiqueta mb-5">Dúvidas</p>
            <h2
              id="titulo-duvidas"
              className="display text-[clamp(1.8rem,3.4vw,2.8rem)]"
              data-revela
            >
              O que perguntam antes de vir
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
                data-revela
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6">
                  <h3 className="display-leve text-[clamp(1.02rem,1.8vw,1.32rem)]">
                    {d.p}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-[1.1rem] leading-none transition-transform duration-300 group-open:rotate-45"
                    style={{
                      color: "var(--tinta)",
                      transitionTimingFunction: "var(--e-saida)",
                    }}
                  >
                    +
                  </span>
                </summary>
                <p className="corpo max-w-[58ch] pb-7 text-[0.96rem]">{d.r}</p>
              </details>
            ))}
            <div className="border-t" style={{ borderColor: "var(--linha)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
