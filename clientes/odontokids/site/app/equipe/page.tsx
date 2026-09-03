import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = { title: "Equipe | OdontoKids", description: "Conheça a equipe que cuida dos sorrisos na OdontoKids." };

const team = [
  { name: "Dr. Joaldo", role: "Odontopediatra", image: "/dr-joaldo.jpeg", registration: "CRO-SE 2661", description: "Une excelência técnica e cuidado humanizado. Especialista em Implantes e Harmonização Facial, trabalha para transformar a visita ao consultório em uma experiência de confiança." },
  { name: "Dra. Maíra Paixão", role: "Odontopediatra", image: "/equipe-2.jpeg", registration: "CRO-SE 4311", description: "Atuação em odontopediatria, sedação consciente e avaliação dos freios orais, unindo conhecimento técnico e uma linguagem que aproxima a criança." },
  { name: "Dra. Edineuza Dantas", role: "Ortodontia e Ortopedia", image: "/equipe-3.jpeg", registration: "CRO-SE 4520", description: "Acompanha crianças e adolescentes no desenvolvimento da mordida, com atenção à fase de crescimento e à experiência de cada paciente." },
  { name: "Dra. Renata", role: "Endodontia", image: "/equipe-1.jpeg", registration: "Especialista em Endodontia", description: "Realiza tratamentos para preservar dentes e devolver conforto, com uma abordagem acolhedora para crianças e famílias." },
];

export default function TeamPage() {
  return (
    <main className="team-page">
      <SiteHeader />
      <section className="team-hero"><div className="shell team-hero-inner"><p className="eyebrow">Equipe OdontoKids</p><h1>Especialistas que sabem cuidar e sabem brincar.</h1><p>Formação, experiência e um olhar atento para o que faz cada criança se sentir segura.</p></div><div className="service-wave" /></section>
      <section className="team-page-list"><div className="shell">
        {team.map((person, index) => <article className="team-profile" key={person.name}><div className="team-profile-photo"><img src={person.image} alt={person.name} /><span>0{index + 1}</span></div><div className="team-profile-copy"><p className="eyebrow">{person.role}</p><h2>{person.name}</h2><p>{person.description}</p><strong>{person.registration}</strong><a href="https://wa.me/5579991471849" target="_blank" rel="noreferrer">Agendar com a equipe <span className="ico-slot"><ArrowUpRight /></span></a></div></article>)}
      </div></section>
      <section className="team-values"><div className="shell"><div className="section-heading"><div><p className="eyebrow">Nosso jeito</p><h2>Competência que a família percebe.</h2></div><p>O cuidado combina escuta, explicações honestas e técnicas adaptadas à infância.</p></div><div className="benefit-grid"><article><span>01</span><h3>Escuta ativa</h3><p>Entendemos a história da criança antes de definir qualquer caminho.</p></article><article><span>02</span><h3>Linguagem leve</h3><p>Explicamos cada etapa para crianças e responsáveis com clareza.</p></article><article><span>03</span><h3>Cuidado integrado</h3><p>Especialidades que conversam para acompanhar o sorriso por inteiro.</p></article></div></div></section>
      <SiteFooter />
    </main>
  );
}
