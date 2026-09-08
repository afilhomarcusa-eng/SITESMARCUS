import type { Metadata } from "next";
import FormularioContato from "@/components/formulario";
import { PROCURO } from "@/lib/formularios";
import { NUMEROS } from "@/lib/estoque";

export const metadata: Metadata = {
  title: "Procuro um carro",
  description:
    "Diga qual carro premium você procura. Saulo Jordão procura e avalia em todo o Brasil, e responde no WhatsApp.",
  alternates: { canonical: "/procuro" },
};

export default function Procuro() {
  return (
    <main id="conteudo">
      <div className="topo-pagina">
        <p className="fino">Um formulário por serviço</p>
        <h1>{PROCURO.titulo}</h1>
        <p>
          {PROCURO.linhaFina} Os {NUMEROS.carros} carros que já estão no estoque
          ficam na página de estoque.
        </p>
      </div>
      <FormularioContato formulario={PROCURO} />
    </main>
  );
}
