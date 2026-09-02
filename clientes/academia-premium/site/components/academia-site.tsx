"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const whatsappHref = "https://api.whatsapp.com/message/5VHBVK3FY3MBG1?autoload=1&app_absent=0&utm_source=site";

const weeklyClasses = {
  Segunda: [["06:00", "Mat Pilates"], ["07:00", "Mat Pilates"], ["08:00", "Yoga"], ["12:30", "Mobilidade"], ["17:00", "Fit Dance"], ["18:00", "Axé"], ["19:00", "Mat Pilates"]],
  Terça: [["07:00", "Bike"], ["07:30", "Muay Thai"], ["08:30", "Mobilidade"], ["12:30", "Bike"], ["17:00", "Jump"], ["18:00", "Yoga"], ["19:00", "Fit Dance"]],
  Quarta: [["06:00", "Mat Pilates"], ["07:00", "Mat Pilates"], ["08:00", "Yoga"], ["17:00", "Fit Dance"], ["18:00", "Pump"], ["19:00", "Axé"]],
  Quinta: [["07:00", "Bike"], ["07:30", "Muay Thai"], ["08:30", "Mobilidade"], ["12:30", "Bike"], ["17:00", "Jump"], ["18:00", "Yoga"], ["19:00", "Fit Dance"]],
  Sexta: [["06:00", "Mat Pilates"], ["08:20", "Fit Dance"], ["12:30", "Mobilidade"], ["17:00", "Fit Dance"], ["18:00", "Pump"]],
  Sábado: [["08:00", "Academia aberta até 14h"]],
} as const;

function ArrowIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>; }
function Brand({ footer = false }: { footer?: boolean }) { return <a className={`brand ${footer ? "brand-footer" : ""}`} href="#inicio" aria-label="Connection, início"><Image src="/images/connection-logo-transparent.png" alt="Connection" fill sizes="160px" priority={!footer} /></a>; }
function CtaLink({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <a className={`cta ${className}`} href={whatsappHref} target="_blank" rel="noreferrer"><span>{children}</span><ArrowIcon /></a>; }
function Photo({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) { return <figure className={`photo ${className}`}><Image src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 60vw" priority={priority} /><span className="photo-line" aria-hidden="true" /></figure>; }

export function AcademiaSite() {
  const [activeDay, setActiveDay] = useState<keyof typeof weeklyClasses>("Segunda");
  const [selectedClass, setSelectedClass] = useState("");
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.2 });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function sendRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const labels: Record<string, string> = {
      name: "Nome",
      age: "Idade",
      sex: "Sexo",
      experience: "Tempo de treino",
      goal: "Objetivo",
      notes: "Observações",
    };
    const details = Object.entries(labels).flatMap(([key, label]) => {
      const value = String(data.get(key) ?? "").trim();
      return value ? [`*${label}:* ${value}`] : [];
    });
    if (selectedClass) details.push(`*Aula escolhida:* ${selectedClass.split("-").join(" | ")}`);
    const message = details.length
      ? `Olá! Vim pelo site da Connection.\n\n*CADASTRO PARA AULA EXPERIMENTAL*\n\n${details.join("\n")}\n\nPodemos combinar o melhor horário?`
      : "Olá! Vim pelo site da Connection e gostaria de agendar uma aula experimental. Podemos combinar o melhor horário?";
    window.open(`${whatsappHref}&text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return <main>
    <header className="site-header"><Brand /><nav aria-label="Navegação principal"><a href="#estrutura">Estrutura</a><a href="#metodo">Método</a><a href="#horarios">Horários</a><a href="#contato">Contato</a></nav><a className="header-cta" href={whatsappHref}>Quero conhecer</a></header>
    <section className="hero" id="inicio">
      <div className="hero-copy reveal"><p className="eyebrow"><span /> Academia Connection</p><h1>Seu treino pede <em>conexão.</em></h1><p className="hero-text">Estrutura, método e acompanhamento próximo para você treinar bem. Um espaço onde constância não depende de improviso.</p><CtaLink>Agendar uma aula experimental</CtaLink></div>
      <div className="hero-media reveal delay-1"><Photo src="/images/connection-hero.png" alt="Atleta preparando equipamento de musculação em academia moderna" priority /></div>
    </section>
    <div className="movement-strip" aria-hidden="true"><div><span>Musculação</span><i /><span>Bike</span><i /><span>Pilates</span><i /><span>Muay Thai</span><i /><span>Yoga</span><i /><span>Fit Dance</span><i /><span>Musculação</span><i /><span>Bike</span><i /><span>Pilates</span><i /><span>Muay Thai</span><i /><span>Yoga</span><i /><span>Fit Dance</span><i /></div></div>
    <section className="structure" id="estrutura">
      <div className="section-heading" data-reveal><p className="eyebrow"><span /> A estrutura</p><h2>Espaço para treinar.<br /><em>Tempo para você.</em></h2></div>
      <div className="structure-grid" data-reveal><Photo src="/images/connection-estrutura.png" alt="Área ampla de musculação com equipamentos modernos" className="media-large" /><div className="feature-copy"><span className="feature-number">01</span><h3>Estrutura de verdade</h3><p>Do aquecimento à última série, a academia acompanha diferentes níveis e objetivos com espaço, organização e equipamento.</p></div><Photo src="/images/connection-hero.png" alt="Detalhe de treino de força" className="media-small crop-detail" /></div>
    </section>
    <section className="method" id="metodo"><div className="method-intro" data-reveal><p className="eyebrow eyebrow-light"><span /> O método</p><h2>Você não precisa adivinhar o próximo passo.</h2><p>Uma boa estrutura importa. Saber o que fazer dentro dela importa mais.</p></div><ol className="steps" data-reveal><li><span>01</span><div><h3>Entender</h3><p>Seu momento, sua rotina e o que você quer alcançar.</p></div></li><li><span>02</span><div><h3>Planejar</h3><p>Um treino coerente com o seu nível, sem fórmula genérica.</p></div></li><li><span>03</span><div><h3>Acompanhar</h3><p>Ajustes e orientação para você continuar avançando.</p></div></li></ol></section>
    <section className="experience"><Photo src="/images/connection-acompanhamento.png" alt="Professor orientando aluno durante exercício com halter" className="experience-media" /><div className="experience-copy" data-reveal><p className="eyebrow"><span /> A experiência</p><h2>Treino sério.<br /><em>Equipe perto.</em></h2><p>Você chega, encontra o que precisa e consegue se concentrar. O cuidado aparece na organização, no atendimento e no acompanhamento.</p><a href="#contato" className="text-link">Conhecer de perto <ArrowIcon /></a></div></section>
    <section className="schedule" id="horarios">
      <div className="schedule-copy" data-reveal><p className="eyebrow eyebrow-light"><span /> Encontre seu horário</p><h2>Escolha uma aula.<br /><em>Depois, só vem.</em></h2><p>Selecione o dia e encontre a aula que cabe na sua rotina. Aos sábados, a academia funciona das 08h às 14h.</p></div>
      <div className="class-board" data-reveal>
        <div className="day-tabs" role="tablist" aria-label="Dias da semana">{(Object.keys(weeklyClasses) as Array<keyof typeof weeklyClasses>).map(day => <button key={day} role="tab" aria-selected={activeDay === day} onClick={() => { setActiveDay(day); setSelectedClass(""); }}>{day.slice(0, 3)}</button>)}</div>
        <div className="board-top"><span>{activeDay}</span><small>{activeDay === "Sábado" ? "08h às 14h" : `${weeklyClasses[activeDay].length} aulas`}</small></div>
        <div className="class-list">{weeklyClasses[activeDay].map(([time, activity]) => { const id = `${activeDay}-${time}-${activity}`; return <button key={id} className={selectedClass === id ? "is-picked" : ""} onClick={() => setSelectedClass(selectedClass === id ? "" : id)}><time>{time}</time><span>{activity}</span><b>{selectedClass === id ? "✓" : "Escolher"}</b></button>; })}</div>
        <div className="board-action"><span>{selectedClass ? "Horário selecionado" : "Escolha uma aula para começar"}</span><CtaLink>Confirmar no WhatsApp</CtaLink></div>
      </div>
    </section>
    <section className="closing" id="contato">
      <div className="closing-intro"><p className="eyebrow eyebrow-light"><span /> Próximo passo</p><h2>Sua primeira aula começa aqui.</h2><p>Preencha o que quiser. A equipe recebe tudo organizado no WhatsApp e continua o atendimento por lá.</p><small>Cadastro opcional</small></div>
      <form className="lead-form" onSubmit={sendRegistration}>
        <div className="form-heading"><span>Dados para a equipe</span><small>Todos os campos são opcionais</small></div>
        <label className="field field-wide"><span>Nome</span><input name="name" type="text" autoComplete="name" placeholder="Como podemos chamar você?" /></label>
        <label className="field"><span>Idade</span><input name="age" type="number" min="12" max="100" inputMode="numeric" placeholder="Ex.: 28" /></label>
        <label className="field"><span>Sexo</span><select name="sex" defaultValue=""><option value="">Prefiro não informar</option><option>Feminino</option><option>Masculino</option><option>Outro</option></select></label>
        <label className="field"><span>Tempo de treino</span><select name="experience" defaultValue=""><option value="">Selecione</option><option>Nunca treinei</option><option>Menos de 6 meses</option><option>De 6 meses a 2 anos</option><option>Mais de 2 anos</option></select></label>
        <label className="field"><span>Objetivo</span><select name="goal" defaultValue=""><option value="">Selecione</option><option>Ganhar força</option><option>Ganhar massa muscular</option><option>Emagrecer</option><option>Condicionamento e saúde</option><option>Mobilidade</option><option>Outro</option></select></label>
        <label className="field field-wide"><span>Algo que a equipe precisa saber?</span><textarea name="notes" rows={3} placeholder="Lesão, limitação, preferência de horário ou outro detalhe" /></label>
        {selectedClass && <div className="selected-workout"><span>Aula escolhida</span><strong>{selectedClass.split("-").join(" • ")}</strong><button type="button" onClick={() => setSelectedClass("")}>Remover</button></div>}
        <button className="form-submit" type="submit"><span>Enviar e abrir WhatsApp</span><ArrowIcon /></button>
        <a className="skip-form" href={whatsappHref} target="_blank" rel="noreferrer">Prefiro falar direto, sem cadastro</a>
      </form>
    </section>
    <footer><Brand footer /><p>Energia. Foco. Disciplina. Resultados.</p><a href="#inicio">Voltar ao topo ↑</a></footer>
  </main>;
}
