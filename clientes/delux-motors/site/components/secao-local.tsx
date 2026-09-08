import { CONTATO, EMPRESA, ENDERECO_LINHA, HORARIO, ROTA_URL } from "@/lib/contato";

/**
 * Como chegar.
 *
 * Numa loja de rua, esta seção é conversão, não rodapé: quem está decidindo se
 * vale a viagem precisa do endereço, do horário de hoje e de um botão que abre
 * a rota no celular. A semana inteira está confirmada no perfil do Google,
 * inclusive sábado e domingo, então nada aqui fica em aberto.
 */

export default function SecaoLocal() {
  return (
    <section id="local" className="secao" style={{ background: "var(--branco)" }}>
      <div className="casca">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <p className="etiqueta mb-5">Como chegar</p>
            {/* A medida fica no próprio elemento em display: ch é relativo à
                fonte de quem tem a classe, e no pai valeria a do corpo. */}
            <h2
              className="display max-w-[13ch] text-[clamp(1.9rem,4.2vw,3.2rem)]"
              data-revela
            >
              Boca do Rio, na Octávio Mangabeira
            </h2>
          </div>

          <a
            data-cta="rota"
            href={ROTA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 px-6 py-4 text-[0.76rem] font-medium uppercase tracking-[0.13em]"
            style={{ background: "var(--tinta)", color: "var(--branco)" }}
          >
            Traçar rota até a loja
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              style={{ transitionTimingFunction: "var(--e-saida)" }}
            >
              &rarr;
            </span>
          </a>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          <div>
            <dl>
              <div
                className="grid gap-1 border-t py-5 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6"
                style={{ borderColor: "var(--linha)" }}
                data-revela
              >
                <dt className="etiqueta pt-1">Endereço</dt>
                <dd className="text-[0.98rem]">{ENDERECO_LINHA}</dd>
              </div>

              {HORARIO.linhas.map((l) => (
                <div
                  key={l.dia}
                  className="grid gap-1 border-t py-5 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6"
                  style={{ borderColor: "var(--linha)" }}
                  data-revela
                >
                  <dt className="etiqueta pt-1">{l.dia}</dt>
                  <dd className="dado text-[0.98rem]">{l.hora}</dd>
                </div>
              ))}

              <div
                className="grid gap-1 border-t py-5 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6"
                style={{ borderColor: "var(--linha)" }}
                data-revela
              >
                <dt className="etiqueta pt-1">WhatsApp</dt>
                <dd>
                  <a
                    href={CONTATO.tel}
                    className="dado text-[0.98rem] underline decoration-[var(--tinta-3)] underline-offset-4 transition-colors duration-200 hover:text-[var(--tinta)]"
                  >
                    {CONTATO.exibicao}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "16 / 11", background: "var(--nuvem)" }}
            data-revela
          >
            <iframe
              title="Mapa com a localização da Delux Motors na Boca do Rio, em Salvador"
              src={`https://www.google.com/maps?q=${EMPRESA.lat},${EMPRESA.lng}&hl=pt-BR&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
              // Mapa sem filtro nenhum, nas cores do Google. Ele estava
              // dessaturado para combinar com o preto e branco do resto, mas
              // mapa é ferramenta antes de ser composição: as cores do Google
              // são as que a pessoa já sabe ler, verde de praça, azul de mar,
              // amarelo de avenida. Tingir isso custa orientação para economizar
              // harmonia.
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
