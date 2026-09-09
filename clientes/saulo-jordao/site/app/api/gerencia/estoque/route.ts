import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { gravarEstoque, lerEstoqueFresco } from "@/lib/banco";
import { ESTOQUE_SEMENTE } from "@/lib/estoque";
import { conferir, negar } from "@/lib/porta";
import type { Carro } from "@/lib/tipos";
import { validarCarros } from "@/lib/validacao";

export const runtime = "nodejs";

/**
 * Grava o estoque inteiro.
 *
 * A gerência manda a lista completa, não um carro por vez. É um usuário só
 * mexendo, e mandar a lista inteira elimina a classe de erro em que metade da
 * mudança sobe e a outra metade fica para trás.
 *
 * A senha é conferida aqui também, e não só no proxy. Duas fechaduras na mesma
 * porta custam nada e evitam que uma mudança de rota deixe a rota de escrita
 * aberta sem ninguém perceber.
 */
export async function POST(request: Request) {
  const veredito = conferir(request.headers.get("authorization"));
  if (veredito !== "ok") return negar(veredito);

  let carros: Carro[];
  try {
    const corpo = await request.json();

    /* Restaurar a lista original. Existe porque erro de gerência acontece, e
       porque sem isto a única saída seria mexer no código. A semente é o
       estoque do dia em que o site nasceu, e está no repositório. */
    if (corpo?.semear === true) {
      await gravarEstoque(ESTOQUE_SEMENTE);
      revalidatePath("/", "layout");
      return NextResponse.json({ ok: true, carros: ESTOQUE_SEMENTE.length, semeado: true, lista: ESTOQUE_SEMENTE });
    }

    carros = corpo?.carros;
    if (!Array.isArray(carros)) throw new Error("lista ausente");
  } catch {
    return NextResponse.json({ erro: "Corpo inválido." }, { status: 400 });
  }

  const erro = validarCarros(carros);
  if (erro) return NextResponse.json({ erro }, { status: 400 });

  try { await gravarEstoque(carros); } catch { return NextResponse.json({ erro: "Não consegui salvar. Tente novamente." }, { status: 503 }); }

  // Derruba o cache das páginas na hora: quem acabou de cadastrar precisa ver
  // o carro no site, não daqui a cinco minutos.
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, carros: carros.length });
}

export async function GET(request: Request) {
 const veredito = conferir(request.headers.get("authorization"));
 if (veredito !== "ok") return negar(veredito);
 try { return NextResponse.json({carros:await lerEstoqueFresco()}, {headers:{"Cache-Control":"no-store"}}); }
 catch { return NextResponse.json({erro:"Estoque indisponível. Tente novamente."},{status:503}); }
}
