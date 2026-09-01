"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { FormEvent, useState } from "react";

const phone="5579988043479";
const exames=[
  {title:"Audiometria",tag:"Percepção dos sons",body:"Ajuda a identificar como cada ouvido responde às frequências da fala e do ambiente."},
  {title:"Impedanciometria",tag:"Orelha média",body:"Avaliação objetiva e rápida que observa mobilidade e pressão no sistema auditivo."},
  {title:"Processamento Auditivo Central",tag:"Escutar e compreender",body:"Para situações em que o som chega, mas acompanhar conversas ainda é difícil."},
  {title:"Consulta fonoaudiológica",tag:"Primeira orientação",body:"Uma conversa para compreender a queixa e escolher o próximo cuidado com segurança."}
];
function Arrow(){return <svg aria-hidden viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>}
function Mark(){return <span className="mark small" aria-hidden>{[1,2,3,4,5].map(n=><i key={n}/>)}</span>}
function Logo(){return <a className="logo" href="#inicio" aria-label="Clínica CAE"><Mark/><span><strong>CAE</strong><small>Clínica de Audição<br/>e Equilíbrio</small></span></a>}

export function CaeSiteV2(){
  const [exame,setExame]=useState(0);const [nome,setNome]=useState("");const [queixa,setQueixa]=useState("");const reduce=useReducedMotion();
  function enviar(e:FormEvent){e.preventDefault();const partes=["Olá, vim pelo site da Clínica CAE.",nome&&`Meu nome é ${nome}.`,queixa&&`Gostaria de conversar sobre: ${queixa}`].filter(Boolean);window.open(`https://wa.me/${phone}?text=${encodeURIComponent(partes.join("\n"))}`,"_blank","noopener,noreferrer")}
  return <main className="v2">
    <header className="header shell"><Logo/><nav><a href="#exames">Exames</a><a href="#atendimento">Atendimento</a><a href="#duvidas">Dúvidas</a></nav><a className="header-link" href="#contato">Agendar <Arrow/></a></header>

    <section className="hero hero-v2 shell" id="inicio">
      <div className="hero-copy"><motion.p className="kicker" initial={reduce?false:{opacity:0,y:12}} animate={{opacity:1,y:0}}>Audição e equilíbrio · Aracaju</motion.p><motion.h1 initial={reduce?false:{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.65}}>Escutar com clareza.<br/><em>Viver com presença.</em></motion.h1><p className="hero-lead">Exames auditivos e orientação fonoaudiológica para entender o que você sente, sem pressa e sem complicar.</p><div className="hero-actions"><a className="button" href="#contato">Quero uma orientação <Arrow/></a><span>Adultos e crianças</span></div></div>
      <motion.div className="photo-stage" initial={reduce?false:{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.75}}>
        <Image src="/images/audiometria-editorial-v2.png" alt="Fonoaudióloga realizando avaliação auditiva em uma paciente" fill priority sizes="(max-width: 850px) 100vw, 44vw"/>
        <motion.button className="sound-pulse" aria-label="Ativar animação de onda sonora" whileHover={{scale:1.08}} whileTap={{scale:.96}}><Mark/><i/><i/><i/></motion.button>
        <span className="photo-caption">Avaliação com orientação em cada etapa</span>
      </motion.div>
    </section>

    <section className="proof"><div className="shell proof-inner"><p><strong>4,8 no Google</strong><span>Mais de 192 avaliações públicas</span></p><p>Um atendimento lembrado pelo cuidado, pela atenção das profissionais e pela tranquilidade durante os exames.</p></div></section>

    <section className="services services-v3" id="exames"><div className="shell"><div className="service-top"><p className="kicker">Por onde investigar</p><h2>Cada queixa pede um olhar diferente.</h2><p>Conte o que você percebe. A equipe ajuda a identificar qual avaliação pode responder melhor.</p></div><div className="service-desk"><div className="service-index" role="tablist">{exames.map((x,i)=><button key={x.title} role="tab" aria-selected={exame===i} onClick={()=>setExame(i)}><span>{x.tag}</span><strong>{x.title}</strong><i>{exame===i?"aberto":"ver"}</i></button>)}</div><motion.div className="service-sheet" key={exame} initial={reduce?false:{opacity:0,rotate:-1,y:10}} animate={{opacity:1,rotate:0,y:0}}><span className="sheet-label">Na prática</span><h3>{exames[exame].title}</h3><p>{exames[exame].body}</p><div className="sheet-wave" aria-hidden><i/><i/><i/><i/><i/><i/><i/></div><a href="#contato">Quero perguntar sobre isso <Arrow/></a></motion.div></div></div></section>

    <section className="appointment" id="atendimento"><div className="shell appointment-head"><p className="kicker">Seu atendimento, sem mistério</p><h2>Da primeira mensagem até a orientação final.</h2></div><div className="shell appointment-layout"><div className="appointment-image"><Image src="/images/atendimento-familia-v3.png" alt="Fonoaudióloga explicando o exame auditivo a uma mãe e uma criança" fill sizes="(max-width: 850px) 100vw, 48vw"/><span>A conversa vem antes do equipamento.</span></div><ol className="roadmap"><li><span>Antes</span><div><h3>Conte a queixa</h3><p>Pelo WhatsApp, diga o que tem percebido e para quem é o atendimento. Não precisa saber o nome do exame.</p></div></li><li><span>Chegada</span><div><h3>Leve pedidos e exames anteriores</h3><p>Se você tiver. A equipe confere o material e explica como será a avaliação.</p></div></li><li><span>Durante</span><div><h3>Faça no seu ritmo</h3><p>As instruções são repetidas quando necessário. Crianças recebem uma condução adequada à idade.</p></div></li><li><span>Depois</span><div><h3>Saia sabendo o próximo passo</h3><p>Você recebe orientação sobre o resultado e sobre o acompanhamento indicado para o seu caso.</p></div></li></ol></div></section>

    <section className="faq shell" id="duvidas"><div className="faq-title"><p className="kicker">Dúvidas que chegam na recepção</p><h2>Antes de vir, muita gente pergunta isso.</h2><p>Sem respostas ensaiadas. Só o que ajuda a chegar mais tranquilo.</p></div><div className="faq-list"><details><summary>Preciso de pedido médico para fazer o exame?<span>+</span></summary><p>Depende do exame e do convênio. Envie uma foto do pedido pelo WhatsApp, se tiver, e a equipe confere antes de marcar.</p></details><details><summary>Meu filho consegue fazer a avaliação?<span>+</span></summary><p>A equipe orienta o exame adequado à idade e explica como preparar a criança. Avise a idade e o que motivou a investigação ao entrar em contato.</p></details><details><summary>Posso ir acompanhado?<span>+</span></summary><p>Sim. Um acompanhante pode ajudar, especialmente quando há tontura, dificuldade de locomoção ou quando o atendimento é infantil.</p></details><details><summary>O exame dói?<span>+</span></summary><p>Os exames auditivos apresentados no site não envolvem cortes. Você recebe todas as instruções antes de começar e pode avisar se sentir qualquer desconforto.</p></details><details><summary>Quanto tempo preciso reservar?<span>+</span></summary><p>O tempo muda conforme o exame. Ao confirmar o agendamento, a recepção informa a duração prevista e se existe algum preparo.</p></details><details><summary>Atende por convênio?<span>+</span></summary><p>A disponibilidade pode mudar conforme o exame e o plano. Mande o nome do convênio e do procedimento para a equipe verificar.</p></details></div></section>

    <section className="contact contact-v2 shell" id="contato"><div className="contact-copy"><p className="kicker">Fale com a CAE</p><h2>Conte o que está acontecendo.</h2><p>Preencher é opcional. Se preferir, clique direto no botão e comece a conversa no WhatsApp.</p><address>Av. Gonçalo Prado Rolemberg, 211<br/>Centro Médico José Augusto Barreto, sala 809<br/>São José · Aracaju, SE</address></div><form className="whatsapp-form" onSubmit={enviar}><div className="form-top"><span>Mensagem para a equipe</span><small>Campos opcionais</small></div><label>Como podemos chamar você?<input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome"/></label><label>O que você tem percebido?<textarea value={queixa} onChange={e=>setQueixa(e.target.value)} placeholder="Ex.: tenho dificuldade para acompanhar conversas em lugares com barulho" rows={4}/></label><button className="button coral" type="submit">Enviar pelo WhatsApp <Arrow/></button><small>Você será direcionado ao WhatsApp para revisar e enviar a mensagem.</small></form></section>

    <footer><div className="shell footer-inner"><Logo/><p>© {new Date().getFullYear()} Clínica CAE</p><a href="https://www.instagram.com/clinicacae/" target="_blank" rel="noreferrer">Instagram ↗</a></div></footer>
  </main>
}
