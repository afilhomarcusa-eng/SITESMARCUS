import type { Metadata } from "next";
import Movimento from "@/components/movimento";
import Navegacao from "@/components/navegacao";
import Procuro from "@/components/procuro";
import SecaoFinal from "@/components/secao-final";

export const metadata: Metadata = {
  title: "Diga o que você procura",
  description:
    "Não achou no estoque? Diga o que você procura e a equipe da Delux Motors avisa quando entrar. Nada obrigatório, e a mensagem vai direto para o WhatsApp.",
  alternates: { canonical: "/procuro" },
  openGraph: {
    title: "Diga o que você procura, na Delux Motors",
    description: "A gente procura o carro por você. A conversa começa no WhatsApp.",
  },
};

export default function PaginaProcuro() {
  return (
    <>
      <Movimento />
      <Navegacao />
      <main id="conteudo" className="pt-28 md:pt-32">
        <Procuro />
        <SecaoFinal />
      </main>
    </>
  );
}
