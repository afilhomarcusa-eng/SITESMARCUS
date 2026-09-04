"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Footer, Header, Instagram, useReveal, WhatsApp } from "@/components/chrome";
import { mapaEmbed, mapaLink, telHref, unidades, waLink, type Unidade } from "@/lib/unidades";

export function UnidadeView({ unidade: u }: { unidade: Unidade }) {
  useReveal();
  const outras = unidades.filter((o) => o.slug !== u.slug);

  return (
    <main>
      <Header />

      <section className="u-hero">
        <div className="shell">
          <Link className="u-back" href="/#unidades">
            <ArrowLeft /> Todas as unidades
          </Link>
          <span className="tag" style={{ display: "flex", marginTop: 18 }}>
            {u.destaque}
          </span>
          <h1>{u.nome}</h1>
          <div className="u-hero-sub">
            <span>{u.cidade}</span>
            <span className="dot" />
            <span>{u.bairro}</span>
            {u.nota ? (
              <>
                <span className="dot" />
                <span>
                  {u.nota.toString().replace(".", ",")} no Google · {u.avaliacoes} avaliações
                </span>
              </>
            ) : null}
          </div>
        </div>
        <div className="shell" style={{ marginTop: 32 }}>
          {u.foto ? (
            <div className="u-shot" data-reveal>
              <img src={u.foto} alt={u.fotoAlt} />
            </div>
          ) : (
            <div className="u-shot--none" data-reveal>
              Foto desta unidade em breve
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="shell u-body">
          <div className="u-about" data-reveal>
            <h2>A unidade</h2>
            <p>{u.sobre}</p>

            <div className="u-hours">
              {u.horarios ? (
                <table>
                  <thead>
                    <tr>
                      <th>Dia</th>
                      <th style={{ textAlign: "right" }}>Funcionamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {u.horarios.map((h) => (
                      <tr key={h.dias}>
                        <td>{h.dias}</td>
                        <td className={h.horas === "Fechado" ? "is-shut" : undefined}>{h.horas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="u-missing">
                  Esta unidade ainda não tem ficha própria no Google, então o horário não está publicado em nenhum lugar
                  oficial. Em vez de chutar, a gente prefere que você confirme no WhatsApp de Vilas do Atlântico, que
                  responde por ela.
                </p>
              )}
              <p className="u-missing" style={{ marginTop: 18 }}>
                Horários conferidos na ficha pública do Google em 04/09/2026. Feriado e período de férias podem mudar a
                grade, então vale confirmar antes de vir pela primeira vez.
              </p>
            </div>
          </div>

          <aside className="u-card" data-reveal>
            <h3>Falar com a {u.nome}</h3>
            <dl>
              <dt>Endereço</dt>
              <dd>
                {u.endereco}
                <br />
                {u.bairro} · {u.cidade}
                {u.cep ? (
                  <>
                    <br />
                    CEP {u.cep}
                  </>
                ) : null}
              </dd>

              {u.telefone ? (
                <>
                  <dt>Telefone</dt>
                  <dd>
                    <a href={telHref(u.telefone)}>{u.telefone}</a>
                  </dd>
                </>
              ) : null}
            </dl>

            {u.whatsapp ? (
              <a
                className="btn btn--brand"
                href={waLink(u.whatsapp, `Olá! Quero fazer uma aula experimental na Abitah ${u.nome}.`)}
                target="_blank"
                rel="noreferrer"
              >
                Aula experimental <WhatsApp />
              </a>
            ) : null}
            <a className="btn btn--line" href={mapaLink(u)} target="_blank" rel="noreferrer">
              Traçar rota <ArrowUpRight />
            </a>
            {u.instagram ? (
              <a className="btn btn--line" href={u.instagram} target="_blank" rel="noreferrer">
                Instagram da unidade <Instagram />
              </a>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="u-map-frame" data-reveal>
            <iframe
              title={`Localização da Abitah ${u.nome} no Google Maps`}
              src={mapaEmbed(u)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="u-others section">
        <div className="shell">
          <div className="head" data-reveal>
            <div>
              <span className="tag">Outras unidades</span>
              <h2>Talvez uma fique mais perto de você.</h2>
            </div>
            <p>São oito no total, entre Salvador, Lauro de Freitas e Feira de Santana.</p>
          </div>
          <div className="u-others-grid" data-reveal>
            {outras.map((o) => (
              <Link className="u-other" href={`/unidades/${o.slug}`} key={o.slug}>
                <b>{o.nome}</b>
                <small>{o.cidade}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
