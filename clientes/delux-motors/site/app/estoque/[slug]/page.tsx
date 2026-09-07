import Movimento from "@/components/movimento";
import Navegacao from "@/components/navegacao";
import FichaCarro from "@/components/ficha-carro";
import SecaoFinal from "@/components/secao-final";
import { CARROS_INICIAIS } from "@/lib/carros";

/**
 * Enquanto lib/carros.ts estiver vazio, nenhuma rota é gerada no build e a
 * ficha é montada no cliente a partir do que a gerência gravou. Quando o
 * estoque real entrar no arquivo, estas páginas passam a sair prontas do
 * servidor, com preço no HTML, sem mexer no layout.
 */
export function generateStaticParams() {
  return CARROS_INICIAIS.map((c) => ({ slug: c.slug }));
}

export default async function PaginaCarro({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <Movimento />
      <Navegacao />
      <main id="conteudo" className="pt-28 md:pt-32">
        <FichaCarro slug={slug} />
        <SecaoFinal />
      </main>
    </>
  );
}
