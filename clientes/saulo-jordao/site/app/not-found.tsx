import Link from "next/link";
import { CARROS } from "@/lib/estoque";

export default function NaoAchou() {
  return (
    <main id="conteudo" className="topo-pagina" style={{ minHeight: "58vh" }}>
      <p className="fino">Endereço que não existe</p>
      <h1>Esta página não está aqui.</h1>
      <p>
        Pode ser um carro que já foi vendido. O estoque de hoje tem{" "}
        {CARROS.length} carros.
      </p>
      <div className="heroi-acoes">
        <Link className="acao" href="/estoque">
          Ver o estoque
        </Link>
        <Link className="acao acao-vazada" href="/">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
