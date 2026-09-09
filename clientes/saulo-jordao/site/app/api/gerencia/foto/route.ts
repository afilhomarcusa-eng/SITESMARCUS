import { NextResponse } from "next/server";
import { salvarFoto } from "@/lib/banco";
import { conferir, negar } from "@/lib/porta";

export const runtime = "nodejs";
/** Foto de celular chega grande. O padrão de 4 MB não cobre. */
export const maxDuration = 30;

/**
 * Recebe uma foto, recorta para a moldura do site, gera as larguras e guarda.
 *
 * O recorte acontece aqui, no servidor, e a dimensão da origem volta junto com
 * a foto para ser gravada no carro. É o que mantém a lei da resolução valendo
 * também para foto que o Saulo sobe do celular: se a origem for pequena, a
 * saída sai pequena, em vez de sair ampliada e borrada.
 */
export async function POST(request: Request) {
  const veredito = conferir(request.headers.get("authorization"));
  if (veredito !== "ok") return negar(veredito);

  const dados = await request.formData();
  const arquivo = dados.get("foto");
  const slug = String(dados.get("slug") ?? "");
  const indice = Number(dados.get("indice") ?? 0);

  if (!(arquivo instanceof File)) {
    return NextResponse.json({ erro: "Nenhuma foto veio no envio." }, { status: 400 });
  }
  if (!/^[a-z0-9-]{2,60}$/.test(slug)) {
    return NextResponse.json({ erro: "Endereço do carro inválido." }, { status: 400 });
  }
  if (!Number.isInteger(indice) || indice < 0 || indice > 5) {
    return NextResponse.json({ erro: "Posição de foto inválida." }, { status: 400 });
  }
  if (arquivo.size > 25 * 1024 * 1024) {
    return NextResponse.json({ erro: "Essa foto passa de 25 MB." }, { status: 413 });
  }

  try {
    const foto = await salvarFoto(slug, indice, await arquivo.arrayBuffer());
    return NextResponse.json({ ok: true, foto });
  } catch (e) {
    return NextResponse.json(
      { erro: e instanceof Error ? e.message : "Não consegui processar essa imagem." },
      { status: 400 },
    );
  }
}
