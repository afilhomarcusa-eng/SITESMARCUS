import type { Metadata } from "next";
import Movimento from "@/components/movimento";
import Navegacao from "@/components/navegacao";
import FormularioServico from "@/components/formulario";
import SecaoFinal from "@/components/secao-final";
import { acharFormulario } from "@/lib/formularios";
import { CARROS_INICIAIS } from "@/lib/carros";

const FORM = acharFormulario("comprar");

export const metadata: Metadata = {
  title: FORM.titulo,
  description: FORM.descricao,
  alternates: { canonical: FORM.rota },
  openGraph: { title: `${FORM.titulo}, na Delux Motors`, description: FORM.descricao },
};

/**
 * Quem chega da ficha de um carro traz o carro no endereco, e ele ja aparece
 * escrito no campo do que a pessoa procura.
 *
 * Quem le o parametro e o servidor, nao o navegador. Ler a barra de endereco no
 * cliente daria um piscar, com o campo vazio no primeiro quadro e preenchido no
 * seguinte, e obrigaria a pagina inteira a esperar hidratacao para ficar certa.
 * O preco e a pagina deixar de ser estatica, e para um formulario isso nao
 * custa nada.
 *
 * O valor vem de fora, entao nada dele e usado como marcacao: ele so preenche
 * um campo de texto, e o React escapa o conteudo. Vira o slug do carro de
 * verdade quando bate com um do estoque, e e ignorado quando nao bate.
 */
function carroDoEndereco(slug: string | undefined) {
  if (!slug) return undefined;
  const c = CARROS_INICIAIS.find((x) => x.slug === slug);
  return c ? `${c.marca} ${c.modelo} ${c.versao} ${c.ano}` : undefined;
}

export default async function PaginaComprar({
  searchParams,
}: {
  searchParams: Promise<{ carro?: string }>;
}) {
  const { carro } = await searchParams;
  const inicial = carroDoEndereco(typeof carro === "string" ? carro : undefined);

  return (
    <>
      <Movimento />
      <Navegacao />
      <main id="conteudo" className="pt-28 md:pt-32">
        <FormularioServico form={FORM} carroInicial={inicial} />
        <SecaoFinal />
      </main>
    </>
  );
}
