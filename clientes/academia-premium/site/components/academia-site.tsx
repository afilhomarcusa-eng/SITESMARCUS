"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const WHATSAPP_NUMBER = "5579991466000";
const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
const whatsappHref = buildWhatsAppUrl(
  "Olá! Vim pelo site da Connection e gostaria de saber mais.",
);

const weeklyClasses = {
  Segunda: [["06:00", "Mat Pilates"], ["07:00", "Mat Pilates"], ["08:00", "Yoga"], ["12:30", "Mobilidade"], ["17:00", "Fit Dance"], ["18:00", "Axé"], ["19:00", "Mat Pilates"]],
  Terça: [["07:00", "Bike"], ["07:30", "Muay Thai"], ["08:30", "Mobilidade"], ["12:30", "Bike"], ["17:00", "Jump"], ["18:00", "Yoga"], ["19:00", "Fit Dance"]],
  Quarta: [["06:00", "Mat Pilates"], ["07:00", "Mat Pilates"], ["08:00", "Yoga"], ["17:00", "Fit Dance"], ["18:00", "Pump"], ["19:00", "Axé"]],
  Quinta: [["07:00", "Bike"], ["07:30", "Muay Thai"], ["08:30", "Mobilidade"], ["12:30", "Bike"], ["17:00", "Jump"], ["18:00", "Yoga"], ["19:00", "Fit Dance"]],
  Sexta: [["06:00", "Mat Pilates"], ["08:20", "Fit Dance"], ["12:30", "Mobilidade"], ["17:00", "Fit Dance"], ["18:00", "Pump"]],
  Sábado: [["08:00", "Academia aberta até 14h"]],
} as const;

const structureSlides = [
  { src: "/images/connection-real-musculacao.jpeg", alt: "Área real de musculação da academia Connection", label: "Musculação", note: "Equipamentos distribuídos em uma área ampla e organizada." },
  { src: "/images/connection-real-cardio.jpeg", alt: "Área de cardio da academia Connection com esteiras", label: "Cardio", note: "Esteiras e aparelhos para aquecimento e condicionamento." },
  { src: "/images/connection-real-ambiente.jpeg", alt: "Ambiente interno da academia Connection", label: "Ambiente", note: "Iluminação, circulação e espaços pensados para o treino." },
] as const;

function ArrowIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>; }
function Brand({ footer = false }: { footer?: boolean }) { return <a className={`brand ${footer ? "brand-footer" : ""}`} href="#inicio" aria-label="Connection, início"><Image src="/images/connection-logo-transparent.png" alt="Connection" fill sizes="160px" priority={!footer} /></a>; }
function CtaLink({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <a className={`cta ${className}`} href={whatsappHref} target="_blank" rel="noreferrer"><span>{children}</span><ArrowIcon /></a>; }
function Photo({ src, alt, className = "", priority = false }: { src: string; alt: string; className?: string; priority?: boolean }) { return <figure className={`photo ${className}`}><Image src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 60vw" priority={priority} /><span className="photo-line" aria-hidden="true" /></figure>; }

export function AcademiaSite() {
  const [activeDay, setActiveDay] = useState<keyof typeof weeklyClasses>("Segunda");
  const [selectedClass, setSelectedClass] = useState("");
  const [activeStructure, setActiveStructure] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const selectedClassLabel = selectedClass.split("-").join(" | ");
  const selectedClassHref = buildWhatsAppUrl(
    selectedClass
      ? `Olá! Vim pelo site da Connection e gostaria de confirmar esta aula experimental:\n\n*${selectedClassLabel}*\n\nEsse horário está disponível?`
      : "Olá! Vim pelo site da Connection e gostaria de escolher uma aula experimental.",
  );
  const changeStructure = (direction: number) => {
    setActiveStructure(current => (current + direction + structureSlides.length) % structureSlides.length);
  };
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
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return <main>
    <header className="site-header"><Brand /><nav aria-label="Navegação principal"><a href="#estrutura">Estrutura</a><a href="#metodo">Método</a><a href="#horarios">Horários</a><a href="#contato">Contato</a></nav><a className="header-cta" href={whatsappHref}>Quero conhecer</a></header>
    <section className="hero" id="inicio">
      <div className="hero-copy reveal"><p className="eyebrow"><span /> Academia Connection</p><h1>Seu treino pede <em>conexão.</em></h1><p className="hero-text">Estrutura, método e acompanhamento próximo para você treinar bem. Um espaço onde constância não depende de improviso.</p><CtaLink>Agendar uma aula experimental</CtaLink></div>
      <div className="hero-media reveal delay-1"><Photo src="/images/connection-real-cardio.jpeg" alt="Área de cardio da academia Connection com esteiras e iluminação azul" priority /></div>
    </section>
    <div className="movement-strip" aria-hidden="true"><div><span>Musculação</span><i /><span>Bike</span><i /><span>Pilates</span><i /><span>Muay Thai</span><i /><span>Yoga</span><i /><span>Fit Dance</span><i /><span>Musculação</span><i /><span>Bike</span><i /><span>Pilates</span><i /><span>Muay Thai</span><i /><span>Yoga</span><i /><span>Fit Dance</span><i /></div></div>
    <section className="structure" id="estrutura">
      <div className="structure-layout" data-reveal>
        <div className="structure-copy"><p className="eyebrow"><span /> Conheça o espaço</p><h2>Estrutura<br /><em>de verdade.</em></h2><p>Do aquecimento à última série, você encontra espaço, organização e equipamentos para diferentes níveis de treino.</p><div className="gallery-count" aria-live="polite"><strong>0{activeStructure + 1}</strong><span>/ 0{structureSlides.length}</span></div></div>
        <div className="structure-gallery" onTouchStart={event => { touchStartX.current = event.touches[0].clientX; }} onTouchEnd={event => { if (touchStartX.current === null) return; const distance = event.changedTouches[0].clientX - touchStartX.current; if (Math.abs(distance) > 45) changeStructure(distance < 0 ? 1 : -1); touchStartX.current = null; }}>
          <div className="gallery-frame"><Image key={`back-${structureSlides[activeStructure].src}`} className="gallery-back" src={structureSlides[activeStructure].src} alt="" fill sizes="(max-width: 800px) 100vw, 65vw" aria-hidden="true" /><Image key={structureSlides[activeStructure].src} className="gallery-main" src={structureSlides[activeStructure].src} alt={structureSlides[activeStructure].alt} fill sizes="(max-width: 800px) 100vw, 65vw" /><span className="photo-line" aria-hidden="true" /></div>
          <div className="gallery-meta"><div><strong>{structureSlides[activeStructure].label}</strong><p>{structureSlides[activeStructure].note}</p></div><div className="gallery-controls"><button type="button" onClick={() => changeStructure(-1)} aria-label="Foto anterior">←</button><button type="button" onClick={() => changeStructure(1)} aria-label="Próxima foto">→</button></div></div>
          <div className="gallery-dots" aria-label="Selecionar foto">{structureSlides.map((slide, index) => <button key={slide.src} type="button" className={activeStructure === index ? "is-active" : ""} onClick={() => setActiveStructure(index)} aria-label={`Ver foto de ${slide.label}`} aria-current={activeStructure === index ? "true" : undefined} />)}</div>
        </div>
      </div>
    </section>
    <section className="method" id="metodo"><div className="method-intro" data-reveal><p className="eyebrow eyebrow-light"><span /> O método</p><h2>Você não precisa adivinhar o próximo passo.</h2><p>Uma boa estrutura importa. Saber o que fazer dentro dela importa mais.</p></div><ol className="steps" data-reveal><li><span>01</span><div><h3>Entender</h3><p>Seu momento, sua rotina e o que você quer alcançar.</p></div></li><li><span>02</span><div><h3>Planejar</h3><p>Um treino coerente com o seu nível, sem fórmula genérica.</p></div></li><li><span>03</span><div><h3>Acompanhar</h3><p>Ajustes e orientação para você continuar avançando.</p></div></li></ol></section>
    <section className="experience"><Photo src="/images/connection-acompanhamento.png" alt="Professor orientando aluno durante exercício com halter" className="experience-media" /><div className="experience-copy" data-reveal><p className="eyebrow"><span /> A experiência</p><h2>Treino sério.<br /><em>Equipe perto.</em></h2><p>Você chega, encontra o que precisa e consegue se concentrar. O cuidado aparece na organização, no atendimento e no acompanhamento.</p><a href="#contato" className="text-link">Conhecer de perto <ArrowIcon /></a></div></section>
    <section className="schedule" id="horarios">
      <div className="schedule-copy" data-reveal><p className="eyebrow eyebrow-light"><span /> Encontre seu horário</p><h2>Escolha uma aula.<br /><em>Depois, só vem.</em></h2><p>Selecione o dia e encontre a aula que cabe na sua rotina. Aos sábados, a academia funciona das 08h às 14h.</p></div>
      <div className="class-board" data-reveal>
        <div className="day-tabs" role="tablist" aria-label="Dias da semana">{(Object.keys(weeklyClasses) as Array<keyof typeof weeklyClasses>).map(day => <button key={day} role="tab" aria-selected={activeDay === day} onClick={() => { setActiveDay(day); setSelectedClass(""); }}>{day.slice(0, 3)}</button>)}</div>
        <div className="board-top"><span>{activeDay}</span><small>{activeDay === "Sábado" ? "08h às 14h" : `${weeklyClasses[activeDay].length} aulas`}</small></div>
        <div className="class-list">{weeklyClasses[activeDay].map(([time, activity]) => { const id = `${activeDay}-${time}-${activity}`; return <button key={id} className={selectedClass === id ? "is-picked" : ""} onClick={() => setSelectedClass(selectedClass === id ? "" : id)}><time>{time}</time><span>{activity}</span><b>{selectedClass === id ? "✓" : "Escolher"}</b></button>; })}</div>
        <div className="board-action"><span>{selectedClass ? "Horário selecionado" : "Escolha uma aula para começar"}</span><a className="cta" href={selectedClassHref} target="_blank" rel="noreferrer"><span>{selectedClass ? "Confirmar esta aula" : "Falar com a equipe"}</span><ArrowIcon /></a></div>
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
