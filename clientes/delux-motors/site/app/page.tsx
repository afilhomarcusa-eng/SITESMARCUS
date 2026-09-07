import Movimento from "@/components/movimento";
import Navegacao from "@/components/navegacao";
import Heroi from "@/components/heroi";
import SecaoServicos from "@/components/secao-servicos";
import SecaoEstoqueChamada from "@/components/secao-estoque-chamada";
import SecaoLoja from "@/components/secao-loja";
import SecaoLocal from "@/components/secao-local";
import SecaoDuvidas, { DUVIDAS } from "@/components/secao-duvidas";
import SecaoFinal from "@/components/secao-final";
import { CARROS_INICIAIS } from "@/lib/carros";

/**
 * A página de venda.
 *
 * A ordem responde à cabeça de quem chega: quem é, o que resolve por mim,
 * o que tem para ver, quem são vocês, onde ficam, e as dúvidas que sobram.
 *
 * Os três serviços vêm logo depois do herói de propósito. Numa loja que
 * compra, vende e consigna, a maior parte de quem entra no site não está
 * procurando um carro específico: está decidindo qual das três portas é a
 * dela. O catálogo tem página própria, em /estoque.
 */

const perguntasEstruturadas = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DUVIDAS.map((d) => ({
    "@type": "Question",
    name: d.p,
    acceptedAnswer: { "@type": "Answer", text: d.r },
  })),
};

export default function Home() {
  return (
    <>
      <Movimento />
      <Navegacao />
      <main>
        <Heroi />
        <SecaoServicos />
        <SecaoEstoqueChamada total={CARROS_INICIAIS.length} />
        <SecaoLoja />
        <SecaoLocal />
        <SecaoDuvidas />
        <SecaoFinal />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(perguntasEstruturadas) }}
      />
    </>
  );
}
