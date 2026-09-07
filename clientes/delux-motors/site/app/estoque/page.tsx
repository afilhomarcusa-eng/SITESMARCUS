import type { Metadata } from "next";
import Movimento from "@/components/movimento";
import Navegacao from "@/components/navegacao";
import Catalogo from "@/components/catalogo";
import SecaoFinal from "@/components/secao-final";
import { CARROS_INICIAIS } from "@/lib/carros";
import { EMPRESA } from "@/lib/contato";

export const metadata: Metadata = {
  title: "Estoque",
  description: `Carros à venda na Delux Motors, na Boca do Rio, em ${EMPRESA.cidade}. Também compramos o seu e recebemos em consignação.`,
  alternates: { canonical: "/estoque" },
  openGraph: {
    title: "Estoque da Delux Motors",
    description: "Carros à venda na Boca do Rio, em Salvador.",
  },
};

/**
 * O catálogo sai renderizado no servidor com o estoque inteiro, para o Google
 * ver os carros e os preços. Os filtros são do cliente e não escondem nada do
 * robô, porque a lista completa está no HTML antes de qualquer clique.
 */
export default function PaginaEstoque() {
  const lista = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Estoque da Delux Motors",
    numberOfItems: CARROS_INICIAIS.length,
    itemListElement: CARROS_INICIAIS.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://deluxmotors.com.br/estoque/${c.slug}`,
      name: `${c.marca} ${c.modelo} ${c.versao} ${c.ano}`,
    })),
  };

  return (
    <>
      <Movimento />
      <Navegacao />
      <main id="conteudo" className="pt-28 md:pt-32">
        <Catalogo inicial={CARROS_INICIAIS} />
        <SecaoFinal />
      </main>
      {CARROS_INICIAIS.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(lista) }}
        />
      ) : null}
    </>
  );
}
