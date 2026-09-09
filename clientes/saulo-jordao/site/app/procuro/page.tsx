import type { Metadata } from "next";
import FormularioContato from "@/components/formulario";
import { PROCURO, comEstoque } from "@/lib/formularios";
import { lerEstoque } from "@/lib/banco";
import { marcasDe, numeros } from "@/lib/estoque";

export const metadata: Metadata = {
  title: "Procuro um carro",
  description:
    "Diga qual carro premium você procura. Saulo Jordão procura e avalia em todo o Brasil, e responde no WhatsApp.",
  alternates: { canonical: "/procuro" },
};

export const revalidate = 300;

export default async function Procuro() {
  const carros = await lerEstoque();
  const n = numeros(carros);
  const formulario = comEstoque(PROCURO, marcasDe(carros));
  return (
    <main id="conteudo">
      <div className="topo-pagina">
        <p className="fino">Um formulário por serviço</p>
        <h1>{PROCURO.titulo}</h1>
        <p>
          {PROCURO.linhaFina} Os {n.carros} carros que já estão no estoque
          ficam na página de estoque.
        </p>
      </div>
      <FormularioContato formulario={formulario} />
    </main>
  );
}
