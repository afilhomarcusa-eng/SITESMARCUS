"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { services } from "@/lib/services";
import { ArrowUpRight, ChevronDown } from "@/components/icons";

const whatsapp = "https://wa.me/5579991471849?text=Olá!%20Gostaria%20de%20agendar%20uma%20consulta%20na%20OdontoKids.";

export default function SiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="shell nav-wrap">
        <Link className="brand" href="/" aria-label="OdontoKids, início"><img src="/logo-odontokids.png" alt="OdontoKids" /></Link>
        <nav aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/equipe">Equipe</Link>
          <div
            className="nav-services"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            onFocus={() => setServicesOpen(true)}
            onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false); }}
          >
            <button type="button" aria-expanded={servicesOpen}>Serviços <span className="ico-slot"><ChevronDown /></span></button>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div className="services-dropdown" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: .18 }}>
                  {services.map((service) => <Link href={`/servicos/${service.slug}`} key={service.slug}><span>{service.number}</span>{service.title}</Link>)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/#unidades">Unidades</Link>
        </nav>
        <a className="nav-cta" href={whatsapp} target="_blank" rel="noreferrer">Agendar <span className="ico-slot"><ArrowUpRight /></span></a>
      </div>
    </header>
  );
}
