"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Footer, Header, useReveal, WhatsApp } from "@/components/chrome";
import { MapaUnidades } from "@/components/mapa-unidades";
import { Preloader } from "@/components/preloader";
import { modalidades, rede, unidades, waLink } from "@/lib/unidades";

export default function Home() {
  useReveal();

  const comNota = unidades.filter((u) => u.nota !== null);
  const somaAval = comNota.reduce((t, u) => t + (u.avaliacoes ?? 0), 0);

  return (
    <main>
      <Preloader />
      <Header sobreFoto />

      <section className="enter" id="topo">
        <div className="enter-shot">
          <img src="/images/hero.jpg" alt="Área de treino do CT Abitah" fetchPriority="high" />
        </div>
        <div className="shell enter-in">
          <span className="tag tag--plain enter-tag">Centro de treinamento · Bahia</span>
          <h1>
            Liberte o atleta que <em>Abitah</em> em você.
          </h1>
          <p>
            Oito unidades entre Salvador, Lauro de Freitas e Feira de Santana. Turma pequena, professor por perto e um
            lugar onde a presença é cobrada com carinho.
          </p>
          <div className="enter-actions">
            <a className="btn btn--brand" href="#unidades">
              Escolher unidade <ArrowRight />
            </a>
            <a className="btn btn--line" href="#metodo">
              O método
            </a>
          </div>
        </div>
        <div className="shell enter-foot">
          <span>Aqui você não desiste</span>
        </div>
      </section>

      <section className="strip">
        <div className="shell strip-grid" data-reveal>
          <div>
            <strong>08</strong>
            <span>Unidades na Bahia</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Cidades</span>
          </div>
          <div>
            <strong>05:15</strong>
            <span>A primeira turma do dia</span>
          </div>
          <div>
            <strong>{rede.seguidores}</strong>
            <span>Seguidores no Instagram</span>
          </div>
        </div>
      </section>

      <section className="section on-dark" id="metodo">
        <div className="shell">
          <div className="head" data-reveal>
            <div>
              <span className="tag">O método</span>
              <h2>Seis formas de treinar. Uma só forma de acompanhar.</h2>
            </div>
            <p>
              A Abitah trabalha com turmas limitadas e presença constante do professor, do iniciante ao atleta. O que muda
              de uma modalidade para outra é o estímulo, não o cuidado.
            </p>
          </div>
          <div className="mod-grid" data-reveal>
            {modalidades.map((m, i) => (
              <article className="mod" key={m.nome}>
                <i>0{i + 1}</i>
                <h3>{m.nome}</h3>
                <p>{m.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="creed section">
        <div className="shell creed-grid">
          <div data-reveal>
            <span className="tag">Por que a gente existe</span>
            <blockquote>
              Mais do que um espaço para treinar, a Abitah é uma <em>comunidade que te puxa</em> para evoluir.
            </blockquote>
            <ul className="creed-list">
              <li>
                <b>01</b>
                <span>
                  Acompanhamento de verdade. Turma pequena, professor corrigindo movimento, plano ajustado ao seu nível.
                </span>
              </li>
              <li>
                <b>02</b>
                <span>
                  Do iniciante ao atleta. Tem gente de sessenta anos e gente competindo treinando no mesmo horário.
                </span>
              </li>
              <li>
                <b>03</b>
                <span>
                  Presença cobrada com carinho. É o que está por trás do &ldquo;aqui você não desiste&rdquo;.
                </span>
              </li>
            </ul>
          </div>
          <div className="creed-photo" data-reveal>
            <img src="/images/patamares.jpg" alt="Parede da unidade Patamares com o lema Liberte o atleta que Abitah em você" />
          </div>
        </div>
      </section>

      <section className="map-section section" id="unidades">
        <div className="shell">
          <div className="head" data-reveal>
            <div>
              <span className="tag">Onde treinar</span>
              <h2>Oito endereços. Escolha o seu.</h2>
            </div>
            <p>
              Cada unidade tem equipe, horário e WhatsApp próprios. Toque num ponto do mapa ou na lista para ver os
              detalhes e falar direto com quem atende ali.
            </p>
          </div>
          <MapaUnidades />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="units-grid" data-reveal>
            {unidades.map((u) => (
              <Link className={u.foto ? "unit-card" : "unit-card unit-card--flat"} href={`/unidades/${u.slug}`} key={u.slug}>
                {u.foto ? <img src={u.foto} alt={u.fotoAlt} loading="lazy" decoding="async" /> : null}
                <small>{u.cidade}</small>
                <h3>{u.nome}</h3>
                <p>{u.destaque}</p>
                <span className="link-line">
                  Ver unidade <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="franchise section" id="franquia">
        <div className="shell franchise-grid">
          <div data-reveal>
            <span className="tag tag--plain">Seja um franqueado</span>
            <h2>Leve o CT Abitah para a sua cidade.</h2>
            <p>
              A rede começou em Salvador, provou o modelo em Patamares e hoje tem oito endereços em três cidades. Se você
              quer levar saúde, performance e resultado para a sua região, a conversa começa aqui.
            </p>
            <p style={{ marginTop: 26 }}>
              <a
                className="btn btn--dark"
                href={waLink(rede.whatsapp, "Olá! Tenho interesse em ser franqueado do CT Abitah.")}
                target="_blank"
                rel="noreferrer"
              >
                Falar sobre franquia <WhatsApp />
              </a>
            </p>
          </div>
          <div className="franchise-facts" data-reveal>
            <div>
              <strong>2 cidades</strong>
              <span>Salvador e Lauro de Freitas, mais Feira de Santana no interior</span>
            </div>
            <div>
              <strong>
                {comNota.length > 0
                  ? (comNota.reduce((t, u) => t + (u.nota ?? 0), 0) / comNota.length).toFixed(1).replace(".", ",")
                  : "—"}
              </strong>
              <span>Média das unidades avaliadas no Google, em {somaAval} avaliações</span>
            </div>
            <div>
              <strong>{rede.telefone}</strong>
              <span>{rede.email}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell head" data-reveal>
          <div>
            <span className="tag">Ainda em dúvida</span>
            <h2>Faça uma aula experimental.</h2>
          </div>
          <div>
            <p>
              Escolha a unidade mais perto e fale com a equipe dela. Quem atende no WhatsApp é quem vai estar na sala no
              dia do seu treino.
            </p>
            <p style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn--brand" href="#unidades">
                Ver as unidades <ArrowRight />
              </a>
              <a className="btn btn--line" href={rede.instagram} target="_blank" rel="noreferrer">
                Instagram <ArrowUpRight />
              </a>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
