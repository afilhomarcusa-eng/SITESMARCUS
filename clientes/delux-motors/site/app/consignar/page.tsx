import type { Metadata } from "next";
import Movimento from "@/components/movimento";
import Navegacao from "@/components/navegacao";
import FormularioServico from "@/components/formulario";
import SecaoFinal from "@/components/secao-final";
import { acharFormulario } from "@/lib/formularios";

const FORM = acharFormulario("consignar");

export const metadata: Metadata = {
  title: FORM.titulo,
  description: FORM.descricao,
  alternates: { canonical: FORM.rota },
  openGraph: { title: `${FORM.titulo}, na Delux Motors`, description: FORM.descricao },
};

export default function PaginaConsignar() {
  return (
    <>
      <Movimento />
      <Navegacao />
      <main id="conteudo" className="pt-28 md:pt-32">
        <FormularioServico form={FORM} />
        <SecaoFinal />
      </main>
    </>
  );
}
