"use client";
import { useState } from "react";
import { club, locations, signup } from "@/lib/content";
import { Arrow } from "./icons";

// O clube não tem servidor, e inventar um "enviado com sucesso" que não envia
// nada seria pior do que não ter formulário. Então o formulário monta a mensagem
// e abre a conversa no WhatsApp do clube com tudo já escrito: a pessoa lê o que
// está mandando antes de mandar, e a equipe recebe as respostas organizadas.
const campo = (rotulo: string, valor: string) => (valor ? rotulo + ": " + valor : "");

export function SignupForm() {
  const [enviando, setEnviando] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const texto = (name: string) => String(data.get(name) ?? "").trim();
    const linhas = [
      campo("Nome", texto("nome")),
      campo("WhatsApp", texto("telefone")),
      campo("Como estou hoje", texto("nivel")),
      campo("O que eu quero", texto("objetivo")),
      campo("Onde fica melhor", texto("local")),
      campo("Melhor horário", texto("periodo")),
      campo("Recado", texto("recado")),
    ].filter(Boolean);
    const mensagem = "Olá! Vim pelo site da Thadeu Melo Team e quero começar a treinar.\n\n*CADASTRO*\n\n"
      + linhas.join("\n") + "\n\nPodemos combinar o primeiro treino?";
    setEnviando(true);
    window.open(club.whatsapp.split("?")[0] + "?text=" + encodeURIComponent(mensagem), "_blank", "noopener,noreferrer");
    setTimeout(() => setEnviando(false), 1200);
  }

  return <form className="signup-form" onSubmit={onSubmit}>
    <div className="field-row">
      <label className="field">
        <span>Seu nome</span>
        <input name="nome" type="text" required autoComplete="name" placeholder="Como a equipe te chama" />
      </label>
      <label className="field">
        <span>Seu WhatsApp</span>
        <input name="telefone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="(79) 9 9999-9999" />
      </label>
    </div>

    <fieldset className="field-group">
      <legend>Como está sua corrida hoje</legend>
      <div className="chips">{signup.levels.map((item, index) =>
        <label key={item} className="chip"><input type="radio" name="nivel" value={item} defaultChecked={index === 0} /><span>{item}</span></label>
      )}</div>
    </fieldset>

    <fieldset className="field-group">
      <legend>O que você quer agora</legend>
      <div className="chips">{signup.goals.map((item, index) =>
        <label key={item} className="chip"><input type="radio" name="objetivo" value={item} defaultChecked={index === 0} /><span>{item}</span></label>
      )}</div>
    </fieldset>

    <fieldset className="field-group">
      <legend>Onde fica melhor treinar</legend>
      <div className="chips">{[...locations.map(item => item.name), "Tanto faz, me indique"].map((item, index) =>
        <label key={item} className="chip"><input type="radio" name="local" value={item} defaultChecked={index === 0} /><span>{item}</span></label>
      )}</div>
    </fieldset>

    <fieldset className="field-group">
      <legend>Melhor horário para você</legend>
      <div className="chips">{signup.periods.map((item, index) =>
        <label key={item} className="chip"><input type="radio" name="periodo" value={item} defaultChecked={index === 0} /><span>{item}</span></label>
      )}</div>
    </fieldset>

    <label className="field">
      <span>Quer contar mais alguma coisa? <i>opcional</i></span>
      <textarea name="recado" rows={3} placeholder="Lesão recente, quantos dias você tem na semana, uma prova que você quer correr." />
    </label>

    <div className="form-foot">
      <p>O cadastro abre a conversa no WhatsApp do clube com as suas respostas já escritas. Você lê antes de enviar.</p>
      <button type="submit" className="button button-yellow" disabled={enviando}>
        {enviando ? "Abrindo o WhatsApp" : "Enviar no WhatsApp"}<Arrow diagonal />
      </button>
    </div>
  </form>;
}
