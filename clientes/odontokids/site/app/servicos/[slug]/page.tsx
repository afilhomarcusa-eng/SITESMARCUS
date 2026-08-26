import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getService, services } from "@/lib/services";

const whatsapp = "https://wa.me/5579991471849?text=Olá!%20Gostaria%20de%20agendar%20uma%20avaliação%20na%20OdontoKids.";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = getService((await params).slug);
  return service ? { title: `${service.title} | OdontoKids`, description: service.summary } : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const service = getService((await params).slug);
  if (!service) notFound();

  return (
    <main className={`service-page service-${service.color}`}>
      <SiteHeader />
      <section className="service-hero">
        <div className="shell service-hero-grid">
          <div className="service-hero-copy">
            <Link className="back-link" href="/#servicos">← Voltar ao mapa</Link>
            <p className="eyebrow">Missão {service.number} · {service.kicker}</p>
            <h1>{service.title}</h1>
            <p>{service.summary}</p>
            <div className="service-hero-actions"><a className="primary-btn" href={whatsapp} target="_blank" rel="noreferrer">Agendar avaliação <span>↗</span></a><span className="service-tag">{service.tag}</span></div>
          </div>
          <div className="service-hero-visual"><div className="service-photo"><img src={service.image} alt={service.imageAlt} /></div><div className="service-orbit">{service.number}</div><div className="service-spark">✦</div></div>
        </div>
        <div className="service-wave" />
      </section>

      <section className="service-intro">
        <div className="shell service-intro-grid">
          <p className="eyebrow">Entenda o cuidado</p>
          <div><h2>{service.introTitle}</h2><p>{service.intro}</p></div>
        </div>
      </section>

      <section className="service-benefits">
        <div className="shell">
          <div className="section-heading"><div><p className="eyebrow">Por que essa missão importa</p><h2>Cuidado claro para toda a família.</h2></div><p>Cada indicação começa com avaliação profissional e um plano construído para a realidade da criança.</p></div>
          <div className="benefit-grid">{service.benefits.map((benefit, index) => <article key={benefit.title}><span>0{index + 1}</span><h3>{benefit.title}</h3><p>{benefit.text}</p></article>)}</div>
        </div>
      </section>

      <section className="service-journey">
        <div className="shell journey-grid">
          <div><p className="eyebrow">Caminho da missão</p><h2>O que acontece em cada etapa.</h2><p className="journey-note">A sequência pode mudar conforme a avaliação. A equipe explica cada decisão aos responsáveis.</p></div>
          <div className="journey-list">{service.steps.map((step) => <article key={step.label}><b>{step.label}</b><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="service-switcher">
        <div className="shell"><p className="eyebrow">Explore outras missões</p><div className="service-tabs">{services.map((item) => <a className={item.slug === service.slug ? "is-current" : ""} href={`/servicos/${item.slug}`} key={item.slug}><span>{item.number}</span>{item.title}</a>)}</div></div>
      </section>

      <section className="service-final"><div className="shell service-final-inner"><div><p className="eyebrow">Prontos para começar?</p><h2>Uma consulta pode mudar a relação da criança com o cuidado.</h2></div><a href={whatsapp} target="_blank" rel="noreferrer">Agendar<br />avaliação <span>↗</span></a></div></section>
      <SiteFooter />
    </main>
  );
}
