import type { Metadata } from "next";
import Catalogo from "@/components/catalogo";
import { CARROS, NUMEROS } from "@/lib/estoque";
import { reais } from "@/lib/fmt";

export const metadata: Metadata = {
  title: "Estoque",
  description: `${CARROS.length} carros premium em Aracaju, com ficha, quilometragem e preço na tela. De ${reais(NUMEROS.menorPreco)} a ${reais(NUMEROS.maiorPreco)}.`,
  alternates: { canonical: "/estoque" },
};

/**
 * O estoque.
 *
 * A página é servidor, o filtro é cliente, e a lista sai pronta do HTML: quem
 * abre um link filtrado vê a lista filtrada no primeiro quadro, e o robô de
 * busca vê os treze carros com preço.
 */
export default async function Estoque({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const consulta = new URLSearchParams();
  for (const [chave, valor] of Object.entries(sp)) {
    if (typeof valor === "string") consulta.set(chave, valor);
  }

  return (
    <main id="conteudo">
      <div className="topo-pagina">
        <p className="fino">Estoque de hoje</p>
        <h1>
          {CARROS.length} carros, cada um com a ficha inteira na tela.
        </h1>
        <p>
          De {reais(NUMEROS.menorPreco)} a {reais(NUMEROS.maiorPreco)}. Quilometragem,
          garantia, IPVA e o que já está pago aparecem na página de cada carro.
        </p>
      </div>

      <Catalogo consultaInicial={consulta.toString()} />
    </main>
  );
}
