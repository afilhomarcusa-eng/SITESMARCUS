import { EMPRESA, ENDERECO_LINHA, HORARIO, MAPS_URL, TELEFONE } from "@/lib/contato";

/**
 * A loja de verdade.
 *
 * A foto é a fachada, tirada do perfil do Google. É a única foto do site que
 * não saiu do estúdio, e é de propósito: depois de sete telas de sala preta,
 * ver o prédio com sol e fiação na frente é o que prova que existe endereço.
 *
 * O horário mostrado é só o que está confirmado no Google. Sábado ainda não foi
 * confirmado pelo cliente, e por isso não aparece nem aqui nem no schema.
 */

export default function SecaoLoja() {
  return (
    <section id="loja" className="secao">
      <div className="casca">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div data-revela="lado">
            <img
              src="/images/fachada-1520.webp"
              alt="Fachada da Usados de Luxo no Setor Bela Vista, com carros do estoque estacionados na frente"
              width={1520}
              height={2027}
              loading="lazy"
              decoding="async"
              className="h-[52svh] w-full object-cover md:h-[68svh]"
            />
            <p className="etiqueta mt-3">
              A loja no Setor Bela Vista, Goiânia. Foto do{" "}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--latao)]"
              >
                perfil da empresa no Google
              </a>
              .
            </p>
          </div>

          <div>
            <p className="etiqueta mb-5">A loja</p>
            <h2 className="display mb-8 text-[clamp(2rem,4.6vw,3.6rem)]" data-revela="sobe">
              Endereço, telefone e horário
            </h2>

            <dl className="mb-10">
              {[
                { k: "Endereço", v: ENDERECO_LINHA },
                { k: "Telefone", v: TELEFONE.exibicao, href: TELEFONE.tel },
                { k: "Horário", v: HORARIO.linha },
                {
                  k: `Nota no Google, em ${EMPRESA.googleNotaColetadaEm}`,
                  v: "4,5",
                  href: MAPS_URL,
                },
              ].map((l) => (
                <div
                  key={l.k}
                  className="grid gap-1 border-t py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-6"
                  style={{ borderColor: "var(--linha)" }}
                  data-revela="sobe"
                >
                  <dt className="etiqueta pt-1">{l.k}</dt>
                  <dd className="text-[0.98rem]" style={{ color: "var(--tinta)" }}>
                    {l.href ? (
                      <a
                        href={l.href}
                        {...(l.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="underline decoration-[var(--tinta-3)] underline-offset-4 transition-colors duration-200 hover:text-[var(--latao)]"
                      >
                        {l.v}
                      </a>
                    ) : (
                      l.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: "16 / 10", background: "var(--fumaca)" }}
            >
              <iframe
                title="Mapa com a localização da Usados de Luxo em Goiânia"
                src={`https://www.google.com/maps?q=${EMPRESA.lat},${EMPRESA.lng}&hl=pt-BR&z=16&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(0.86)" }}
              />
            </div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="dado mt-4 inline-block text-[0.72rem] uppercase tracking-[0.14em]"
              style={{ color: "var(--latao)" }}
            >
              Abrir no Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
