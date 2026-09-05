"use client";

import Link from "next/link";
import { FotoUnidade } from "@/components/foto-unidade";
import { MapaUnidade } from "@/components/mapa-unidade";
import { ArrowLeft, ArrowUpRight, Footer, Header, Instagram, useReveal, WhatsApp } from "@/components/chrome";
import { mapaLink, telHref, unidades, waLink, type Unidade } from "@/lib/unidades";

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
              <FotoUnidade slug={u.slug} alt={u.fotoAlt} principal />
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
              {u.horarios ? <p className="u-hours-note">Funcionamento publicado no Google Maps. Confirme os horários das turmas e feriados com a equipe.</p> : null}
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
                  Consulte o atendimento da rede para confirmar os horários e a disponibilidade das turmas.
                </p>
              )}
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

              {u.contatoDescricao ? <><dt>Atendimento</dt><dd>{u.contatoDescricao}</dd></> : null}
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
            {!u.localizacaoAproximada ? <a className="btn btn--line" href={mapaLink(u)} target="_blank" rel="noreferrer">
              Traçar rota <ArrowUpRight />
            </a> : null}
            {u.instagram ? (
              <a className="btn btn--line" href={u.instagram} target="_blank" rel="noreferrer">
                Instagram da unidade <Instagram />
              </a>
            ) : null}
          </aside>
        </div>
      </section>

      {!u.localizacaoAproximada ? <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="u-map-frame" data-reveal>
            <MapaUnidade unidade={u} />
          </div>
        </div>
      </section> : null}
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
              <a className={o.foto ? "u-other u-other--photo" : "u-other"} href={`/unidades/${o.slug}`} key={o.slug}>
                {o.foto ? <FotoUnidade slug={o.slug} alt={o.fotoAlt} /> : null}
                <span className="u-other-content">
                <b>{o.nome}</b>
                <small>{o.cidade}</small>
                <em>Conhecer unidade <ArrowUpRight /></em>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer unidade={u} />
    </main>
  );
}
