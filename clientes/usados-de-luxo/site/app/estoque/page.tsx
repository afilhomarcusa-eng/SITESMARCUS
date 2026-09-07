import type { Metadata } from "next";
import Navegacao from "@/components/navegacao";
import Movimento from "@/components/movimento";
import Catalogo from "@/components/catalogo";
import SecaoFinal from "@/components/secao-final";
import { CARROS_INICIAIS } from "@/lib/carros";
import { brl } from "@/lib/fmt";

const precos = CARROS_INICIAIS.map((c) => c.preco);

export const metadata: Metadata = {
  title: `Estoque, ${CARROS_INICIAIS.length} carros à venda`,
  description: `Seminovos premium de ${brl(Math.min(...precos))} a ${brl(Math.max(...precos))}, em Goiânia, com entrega para todo o Brasil. Filtre por marca, câmbio, combustível e preço.`,
  alternates: { canonical: "/estoque" },
  openGraph: {
    title: `${CARROS_INICIAIS.length} carros à venda na Usados de Luxo`,
    description: `De ${brl(Math.min(...precos))} a ${brl(Math.max(...precos))}, com entrega para todo o Brasil.`,
  },
};

/**
 * A vitrine.
 *
 * O conteúdo sai renderizado no servidor com o estoque inteiro, para o Google
 * ver os 12 carros com preço. Os filtros são do cliente e não escondem nada do
 * robô, porque a lista completa está no HTML antes de qualquer clique.
 */
export default function PaginaEstoque() {
  const lista = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Estoque da Usados de Luxo",
    numberOfItems: CARROS_INICIAIS.length,
    itemListElement: CARROS_INICIAIS.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://usadosdeluxo.com.br/estoque/${c.slug}`,
      name: `${c.marca} ${c.modelo} ${c.versao} ${c.ano}`,
    })),
  };

  return (
    <>
      <Movimento />
      <Navegacao />
      <main id="conteudo" className="pt-28 md:pt-32">
        <Catalogo inicial={CARROS_INICIAIS} />
        <SecaoFinal total={CARROS_INICIAIS.length} />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lista) }}
      />
    </>
  );
}
