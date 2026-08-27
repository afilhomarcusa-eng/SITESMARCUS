import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Política de Privacidade | Angioface" };

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link href="/" aria-label="Voltar para a página inicial"><Image src="/images/logo-angioface.png" alt="Angioface" width={120} height={102} /></Link>
        <Link href="/">← Voltar ao início</Link>
      </header>
      <article>
        <span className="eyebrow eyebrow--gold">Transparência e cuidado</span>
        <h1>Política de Privacidade</h1>
        <p className="legal-lead">A Angioface respeita a sua privacidade e protege os dados compartilhados durante o contato e o agendamento.</p>
        <section><h2>Dados coletados</h2><p>Podemos receber nome, telefone e informações fornecidas voluntariamente por você em nossos canais de atendimento.</p></section>
        <section><h2>Como utilizamos</h2><p>Os dados são utilizados exclusivamente para responder solicitações, organizar agendamentos e melhorar a experiência de atendimento.</p></section>
        <section><h2>Compartilhamento e segurança</h2><p>Não comercializamos dados pessoais. Adotamos medidas adequadas para proteger as informações sob nossa responsabilidade.</p></section>
        <section><h2>Seus direitos</h2><p>Você pode solicitar confirmação, correção ou exclusão de seus dados entrando em contato com a clínica pelo telefone (79) 99157-0017.</p></section>
      </article>
      <footer className="legal-footer">Copyright © 2026 — Angioface - Clínica Médica e Odontológica.</footer>
    </main>
  );
}
