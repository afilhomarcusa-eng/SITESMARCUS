import Link from "next/link";
import { lerEstoque } from "@/lib/banco";

export const revalidate = 300;

export default async function NaoAchou() {
  const carros = await lerEstoque();
  return (
    <main id="conteudo" className="topo-pagina" style={{ minHeight: "58vh" }}>
      <p className="fino">Endereço que não existe</p>
      <h1>Esta página não está aqui.</h1>
      <p>
        Pode ser um carro que já foi vendido. O estoque de hoje tem{" "}
        {carros.length} carros.
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
