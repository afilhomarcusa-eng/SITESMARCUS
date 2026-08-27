import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Voltar ao site</Link>
      <article>
        <span className="eyebrow">Privacidade</span>
        <h1>Política de Privacidade</h1>
        <p>Esta página explica como os dados enviados voluntariamente nos canais de atendimento da Pousada Nossa Senhora Aparecida podem ser utilizados.</p>
        <section><h2>Dados de contato</h2><p>Informações enviadas pelo WhatsApp são utilizadas exclusivamente para responder dúvidas, verificar disponibilidade e organizar reservas.</p></section>
        <section><h2>Compartilhamento</h2><p>A pousada não comercializa dados pessoais. Informações podem ser tratadas por serviços essenciais ao atendimento, sempre dentro de suas respectivas políticas.</p></section>
        <section><h2>Seus direitos</h2><p>Você pode solicitar esclarecimentos, atualização ou exclusão de informações diretamente pelos canais de contato divulgados neste site.</p></section>
      </article>
    </main>
  );
}
