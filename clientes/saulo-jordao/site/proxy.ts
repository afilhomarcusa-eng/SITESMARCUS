import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { conferir, negar } from "@/lib/porta";

/**
 * A senha da gerência, conferida na borda, antes de a página existir.
 *
 * Cobre a tela em /admin e também as rotas que gravam no banco. As duas coisas
 * precisam da mesma porta: proteger só a tela deixaria a rota de gravação
 * aberta para quem soubesse o endereço, e aí o cadeado seria enfeite.
 *
 * O que isto protege: o acesso à gerência e a escrita no estoque. O que ele não
 * protege: a leitura do estoque, que é pública de propósito, porque é o próprio
 * site.
 */
export function proxy(request: NextRequest) {
  const veredito = conferir(request.headers.get("authorization"));
  if (veredito !== "ok") return negar(veredito);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/gerencia/:path*"],
};
