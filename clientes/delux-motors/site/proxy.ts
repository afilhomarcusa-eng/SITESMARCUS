import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Senha da gerência.
 *
 * Roda no servidor, na borda, antes da página existir. Isso importa: senha
 * conferida em JavaScript de cliente é decoração, porque a senha viaja dentro
 * do pacote e qualquer visitante lê ela em dois cliques. Aqui a senha só existe
 * como variável de ambiente no servidor e nunca chega ao navegador.
 *
 * O que isto protege, e o que não protege:
 *
 *   Protege  o acesso à tela de gerência. Estranho que abra /admin sem a senha
 *            recebe 401 e não vê nada.
 *
 *   Não protege  os dados, porque ainda não existem dados no servidor. O
 *            estoque cadastrado em /admin mora no IndexedDB do navegador de
 *            quem cadastrou. Quando o banco entrar, a autenticação de verdade
 *            entra com ele, e esta porta vira a primeira camada, não a única.
 *
 * Falha fechado: sem a variável ADMIN_SENHA configurada, ninguém entra. O
 * contrário, abrir quando a configuração falta, é como um cadeado que destranca
 * sozinho quando alguém esquece de girar a chave.
 */

const REINO = 'Basic realm="Delux Motors, gerencia", charset="UTF-8"';

/** Comparação de tempo constante, para o erro não vazar o tamanho do acerto. */
function iguais(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) {
    diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diferenca === 0;
}

function negar(motivo: string) {
  return new NextResponse(motivo, {
    status: 401,
    headers: {
      "WWW-Authenticate": REINO,
      "Content-Type": "text/plain; charset=utf-8",
      // Página protegida não fica em cache de proxy nenhum.
      "Cache-Control": "no-store",
    },
  });
}

export function proxy(request: NextRequest) {
  const esperada = process.env.ADMIN_SENHA;

  if (!esperada) {
    return negar(
      "A gerência está fechada: falta configurar a variável ADMIN_SENHA no servidor.",
    );
  }

  const cabecalho = request.headers.get("authorization") ?? "";
  const [tipo, credencial] = cabecalho.split(" ");

  if (tipo !== "Basic" || !credencial) {
    return negar("Gerência da Delux Motors. Informe a senha.");
  }

  let recebida = "";
  try {
    // O usuário não é conferido: a loja tem uma senha só, e pedir dois campos
    // sem ter dois campos de verdade é teatro.
    recebida = atob(credencial).split(":").slice(1).join(":");
  } catch {
    return negar("Credencial inválida.");
  }

  if (!iguais(recebida, esperada)) {
    return negar("Senha incorreta.");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
