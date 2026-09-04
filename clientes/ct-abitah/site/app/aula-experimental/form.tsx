"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Footer, Header, useReveal, WhatsApp } from "@/components/chrome";
import { modalidades, rede, unidades, waLink } from "@/lib/unidades";

/*
 * Cadastro de aula experimental. Nao existe backend nem CRM aqui, entao o
 * formulario nao finge que envia: ele monta a mensagem e abre o WhatsApp da
 * unidade escolhida, que e quem de fato marca a aula. Cada unidade tem numero
 * proprio, e e esse numero que recebe.
 */
const objetivos = ["Sair do sedentarismo", "Emagrecer", "Ganhar força", "Performance e competição", "Voltar a treinar"];
const experiencias = ["Nunca treinei", "Já treinei, parei", "Treino hoje"];

export function Form() {
  useReveal();
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [objetivo, setObjetivo] = useState(objetivos[0]);
  const [experiencia, setExperiencia] = useState(experiencias[0]);
  const [interesse, setInteresse] = useState<string[]>([]);
  const [quando, setQuando] = useState("");
  const [obs, setObs] = useState("");

  const unidade = unidades.find((u) => u.slug === slug) ?? null;

  const alterna = (item: string) =>
    setInteresse((atual) => (atual.includes(item) ? atual.filter((x) => x !== item) : [...atual, item]));

  const mensagem = useMemo(() => {
    let data = "a combinar";
    if (quando) {
      const [a, m, d] = quando.split("-");
      data = `${d}/${m}/${a}`;
    }
    const onde = unidade ? ` ${unidade.nome}` : "";
    const quem = nome.trim();
    const linhas = [
      quem
        ? `Olá! Aqui é ${quem}. Quero marcar uma aula experimental na Abitah${onde}.`
        : `Olá! Quero marcar uma aula experimental na Abitah${onde}.`,
      "",
      `Objetivo: ${objetivo}`,
      `Experiência: ${experiencia}`,
      `Interesse: ${interesse.length ? interesse.join(", ") : "ainda não sei"}`,
      `Quando quero começar: ${data}`,
    ];
    if (obs.trim()) linhas.push("", `Observação: ${obs.trim()}`);
    return linhas.join("\n");
  }, [nome, unidade, objetivo, experiencia, interesse, quando, obs]);

  const destino = unidade?.whatsapp ?? rede.whatsapp;

  return (
    <main>
      <Header />

      <section className="form-hero">
        <div className="shell">
          <Link className="u-back" href="/">
            <ArrowLeft /> Voltar
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 34 }}>
        <div className="shell form-wrap">
          <div className="form-side" data-reveal>
            <span className="tag">Aula experimental</span>
            <h1 style={{ marginTop: 18 }}>Venha treinar uma vez. Depois a gente conversa.</h1>
            <p>
              Você escolhe a unidade e conta o que procura. A mensagem chega pronta no WhatsApp de quem atende ali, e é
              essa mesma pessoa que vai te receber no dia.
            </p>

            <div className="form-dest">
              <span>Vai para</span>
              {unidade ? (
                <>
                  <b>Abitah {unidade.nome}</b>
                  <small>
                    {unidade.telefone ?? "WhatsApp da unidade"} · {unidade.bairro}, {unidade.cidade}
                  </small>
                </>
              ) : (
                <>
                  <b>Escolha uma unidade</b>
                  <small>Sem unidade escolhida, a mensagem vai para o contato geral da rede.</small>
                </>
              )}
            </div>
          </div>

          <form
            className="form-card"
            data-reveal
            onSubmit={(e) => {
              e.preventDefault();
              window.open(waLink(destino, mensagem), "_blank", "noopener,noreferrer");
            }}
          >
            <div className="form-grid">
              <label className="field f-wide">
                <span>Seu nome</span>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como podemos te chamar?"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="field f-wide">
                <span>Unidade</span>
                <select value={slug} onChange={(e) => setSlug(e.target.value)} required>
                  <option value="">Escolha a mais perto de você</option>
                  {unidades.map((u) => (
                    <option key={u.slug} value={u.slug}>
                      {u.nome} · {u.cidade}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Seu objetivo</span>
                <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)}>
                  {objetivos.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Você treina hoje?</span>
                <select value={experiencia} onChange={(e) => setExperiencia(e.target.value)}>
                  {experiencias.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>

              <div className="field f-wide">
                <span>
                  Interesse <i>· pode marcar mais de um</i>
                </span>
                <div className="chips">
                  {modalidades.map((m) => (
                    <button
                      key={m.nome}
                      type="button"
                      className={interesse.includes(m.nome) ? "chip is-on" : "chip"}
                      onClick={() => alterna(m.nome)}
                      aria-pressed={interesse.includes(m.nome)}
                    >
                      {m.nome}
                    </button>
                  ))}
                </div>
              </div>

              <label className="field f-wide">
                <span>
                  Quando quer começar <i>· opcional</i>
                </span>
                <input type="date" value={quando} onChange={(e) => setQuando(e.target.value)} />
              </label>

              <label className="field f-wide">
                <span>
                  Algo que a gente deva saber <i>· opcional</i>
                </span>
                <textarea
                  rows={2}
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  placeholder="Lesão, horário que funciona para você, alguma dúvida…"
                />
              </label>

              <button className="btn btn--brand f-wide" type="submit">
                Enviar para {unidade ? unidade.nome : "a Abitah"} <WhatsApp />
              </button>
              <p className="form-note f-wide">
                Enviar não confirma a aula. A mensagem abre no WhatsApp já preenchida, e a unidade responde com os
                horários em que tem vaga.
              </p>
            </div>
          </form>
        </div>
      </section>

      <section className="u-others section">
        <div className="shell">
          <div className="head" data-reveal>
            <div>
              <span className="tag">Onde treinar</span>
              <h2>As oito unidades.</h2>
            </div>
            <p>Se preferir falar direto, cada uma tem página e WhatsApp próprios.</p>
          </div>
          <div className="u-others-grid" data-reveal>
            {unidades.map((u) => (
              <Link className="u-other" href={`/unidades/${u.slug}`} key={u.slug}>
                <b>{u.nome}</b>
                <small>{u.cidade}</small>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: 28 }}>
            <Link className="link-line" href="/#unidades">
              Ver no mapa <ArrowRight />
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
