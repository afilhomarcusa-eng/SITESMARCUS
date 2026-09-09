import type { Metadata } from "next";
import Catalogo from "@/components/catalogo";
import { lerEstoque } from "@/lib/banco";
import { numeros } from "@/lib/estoque";
import { reais } from "@/lib/fmt";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const carros = await lerEstoque();
  const n = numeros(carros);
  return {
    title: "Estoque",
    description: n.carros === 0 ? "Saulo procura o carro que você quer. Conte o modelo e a faixa de preço." : `${n.carros} carros premium em Aracaju, com ficha, quilometragem e preço na tela. De ${reais(n.menorPreco)} a ${reais(n.maiorPreco)}.`,
    alternates: { canonical: "/estoque" },
  };
}

/**
 * O estoque.
 *
 * A página é servidor, o filtro é cliente, e a lista sai pronta do HTML: quem
 * abre um link filtrado vê a lista filtrada no primeiro quadro, e o robô de
 * busca vê todos os carros com preço.
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

  const carros = await lerEstoque();
  const n = numeros(carros);

  return (
    <main id="conteudo">
      <header className="page-hero">
        <p className="kicker">Seleção disponível · Aracaju, SE</p>
        <h1>{n.carros === 0 ? "O próximo pode ser o seu." : <>Carros que valem<br /><em>a atenção.</em></>}</h1>
        <div><p>Veículos selecionados, com ficha completa, quilometragem e preço.</p><span className="kicker">{n.carros} veículos disponíveis</span></div>
      </header>

      <Catalogo carros={carros} consultaInicial={consulta.toString()} />
    </main>
  );
}
