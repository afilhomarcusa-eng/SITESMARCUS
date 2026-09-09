/**
 * A porta da gerência.
 *
 * A senha é conferida no servidor, e só no servidor. Senha conferida em
 * JavaScript de cliente é decoração: ela viaja dentro do pacote e qualquer
 * visitante lê em dois cliques.
 *
 * Este arquivo não importa nada pesado de propósito. Ele roda tanto na borda,
 * dentro do proxy, quanto nas rotas que gravam no banco, e a borda não carrega
 * sharp nem o cliente do Blob.
 *
 * Falha fechado: sem a variável ADMIN_SENHA configurada, ninguém entra. Abrir
 * quando falta configuração é um cadeado que destranca sozinho.
 */

export const REINO = 'Basic realm="Gerencia de Saulo Jordao", charset="UTF-8"';

/** Comparação de tempo constante, para o erro não vazar o tamanho do acerto. */
function iguais(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) {
    diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diferenca === 0;
}

export type Veredito = "ok" | "sem-configuracao" | "sem-credencial" | "senha-errada";

export function conferir(cabecalho: string | null): Veredito {
  const esperada = process.env.ADMIN_SENHA;
  if (!esperada) return "sem-configuracao";

  const [tipo, credencial] = (cabecalho ?? "").split(" ");
  if (tipo !== "Basic" || !credencial) return "sem-credencial";

  let recebida = "";
  try {
    // O usuário não é conferido: a gerência tem uma senha só, e pedir dois
    // campos sem ter dois campos de verdade é teatro.
    recebida = atob(credencial).split(":").slice(1).join(":");
  } catch {
    return "sem-credencial";
  }

  return iguais(recebida, esperada) ? "ok" : "senha-errada";
}

export const MOTIVOS: Record<Exclude<Veredito, "ok">, string> = {
  "sem-configuracao":
    "A gerência está fechada: falta configurar a variável ADMIN_SENHA no servidor.",
  "sem-credencial": "Gerência do estoque de Saulo Jordão. Informe a senha.",
  "senha-errada": "Senha incorreta.",
};

export function negar(veredito: Exclude<Veredito, "ok">): Response {
  return new Response(MOTIVOS[veredito], {
    status: 401,
    headers: {
      "WWW-Authenticate": REINO,
      "Content-Type": "text/plain; charset=utf-8",
      // Página protegida não fica em cache de proxy nenhum.
      "Cache-Control": "no-store",
    },
  });
}
