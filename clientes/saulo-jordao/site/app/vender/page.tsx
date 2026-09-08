import type { Metadata } from "next";
import FormularioContato from "@/components/formulario";
import { VENDER } from "@/lib/formularios";
import { EMPRESA } from "@/lib/contato";

export const metadata: Metadata = {
  title: "Quero vender o meu",
  description:
    "Mande a ficha do seu carro premium. Saulo Jordão avalia e conduz a venda, com atendimento em todo o Brasil.",
  alternates: { canonical: "/vender" },
};

export default function Vender() {
  return (
    <main id="conteudo">
      <div className="topo-pagina">
        <p className="fino">Um formulário por serviço</p>
        <h1>{VENDER.titulo}</h1>
        <p>
          {VENDER.linhaFina} Corretor de veículos premium em {EMPRESA.cidade} desde{" "}
          {EMPRESA.desde}.
        </p>
      </div>
      <FormularioContato formulario={VENDER} />
    </main>
  );
}
