import "server-only";
import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { put, del, list } from "@vercel/blob";
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ESTOQUE_SEMENTE } from "./estoque";
import {
  FOTOS_POR_CARRO,
  LARGURA_GRANDE,
  LARGURAS_FOTO,
  PROPORCAO_FOTO,
  type Carro,
  type Foto,
} from "./tipos";

/**
 * O banco do estoque.
 *
 * O estoque mora num arquivo JSON no Blob da Vercel, e as fotos enviadas em
 * /admin moram ao lado dele. Isto não é banco de brinquedo no navegador: o que
 * o Saulo salva na gerência é o que todo visitante vê, de qualquer aparelho.
 *
 * Três regras que valem a pena dizer em voz alta:
 *
 * 1. Falha aberta, mas nunca vazia. Se o Blob estiver fora do ar ou o arquivo
 *    ainda não existir, o site mostra a semente, que é o estoque do dia em que
 *    ele nasceu. Uma loja com treze carros antigos é melhor que uma loja vazia,
 *    e muito melhor que uma tela de erro.
 *
 * 2. Nada disto roda no navegador. `server-only` no topo garante isso na
 *    marra: se algum componente de cliente importar este arquivo por engano, o
 *    build quebra, em vez de o token do Blob viajar no pacote.
 *
 * 3. A foto é redimensionada aqui, no servidor, antes de ser guardada, e a
 *    dimensão da origem é gravada junto. É o que mantém a lei da resolução
 *    valendo para foto que o Saulo sobe do celular dele, e não só para as que
 *    passaram pelo pipeline da minha máquina.
 */

/**
 * Cada gravação cria um arquivo novo, com o instante no nome.
 *
 * Poderia ser um arquivo só, sempre no mesmo endereço, e foi assim na primeira
 * versão. Não funciona: o endereço público do Blob é servido por CDN com cache
 * mínimo de um minuto, e nem carimbo na consulta resolve. O Saulo salvava,
 * abria o site e continuava vendo o estoque velho.
 *
 * Com um nome novo a cada gravação, o conteúdo de cada endereço nunca muda, e o
 * cache do CDN deixa de ser problema e vira vantagem. Quem sabe qual é o mais
 * recente é a API de listagem, que é autenticada e responde sempre fresca.
 */
const PASTA = "estoque/";
/** Testes locais nunca usam o Blob do cliente. */
const LOCAL = !process.env.VERCEL && process.env.ESTOQUE_TESTE_DIR ? path.resolve(process.env.ESTOQUE_TESTE_DIR) : null;

/** Quantas versões ficam guardadas. As mais velhas são apagadas na gravação. */
const VERSOES_GUARDADAS = 5;

/** A etiqueta do cache. A gerência derruba ela na hora em que salva. */
export const ETIQUETA = "estoque";

type Guardado = { atualizadoEm: string; carros: Carro[] };

/** As versões, da mais nova para a mais velha. */
async function versoes() {
  const { blobs } = await list({ prefix: PASTA });
  return blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
}

/**
 * A leitura de verdade.
 *
 * Duas chamadas: a listagem, que é autenticada e nunca vem de cache, e o
 * arquivo, cujo conteúdo é imutável. É caro para rodar a cada visita, e é por
 * isso que quem chama é o cache abaixo, e não a página.
 */
async function buscar(): Promise<Carro[]> {
  if (LOCAL) {
    try {
      const dados = JSON.parse(await readFile(path.join(LOCAL, "estoque.json"), "utf8")) as Guardado;
      if (!Array.isArray(dados.carros)) throw new Error("Estoque inválido.");
      return dados.carros;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return ESTOQUE_SEMENTE;
      throw e;
    }
  }
  const lista = await versoes();
  if (!lista.length) return ESTOQUE_SEMENTE;

  const resposta = await fetch(lista[0].url, { cache: "no-store" });
  if (!resposta.ok) throw new Error("Estoque indisponível.");

  const dados = (await resposta.json()) as Guardado;
  if (!Array.isArray(dados.carros)) throw new Error("Estoque inválido.");
  return dados.carros;
}

/**
 * O estoque, cacheado.
 *
 * `unstable_cache` guarda o resultado inteiro sob a etiqueta, e é o que permite
 * a página continuar estática mesmo lendo de fora: sem ele, a busca sem cache
 * transformaria a home em dinâmica no meio do voo, e a página passaria a
 * devolver erro 500 em toda visita. Isso aconteceu aqui, e só aparecia depois
 * do primeiro salvamento, porque no build o banco ainda não existia.
 *
 * O `cache` do React por cima junta as chamadas de um mesmo pedido: a home
 * pergunta o estoque três vezes e o Blob responde uma.
 */
const lerCacheado = unstable_cache(buscar, ["estoque", LOCAL ?? "blob"], {
  tags: [ETIQUETA],
  revalidate: 300,
});

export const lerEstoque = cache(async (): Promise<Carro[]> => {
  try {
    return await lerCacheado();
  } catch {
    // Blob fora do ar, rede caída, JSON quebrado: o site continua de pé.
    return ESTOQUE_SEMENTE;
  }
});

/**
 * A leitura da gerência, sem cache nenhum.
 *
 * A tela de edição não pode trabalhar em cima de uma cópia velha: quem salva
 * manda a lista inteira, e uma lista velha apagaria por cima o que foi mudado
 * no meio tempo. A gerência é sempre dinâmica, então esta leitura direta não
 * contamina página nenhuma do site.
 */
export async function lerEstoqueFresco(): Promise<Carro[]> {
  // Não editar uma semente desatualizada sobre um banco indisponível.
  return buscar();
}

export async function gravarEstoque(carros: Carro[]): Promise<void> {
  const dados: Guardado = { atualizadoEm: new Date().toISOString(), carros };
  if (LOCAL) {
    await mkdir(LOCAL, { recursive: true });
    await writeFile(path.join(LOCAL, "estoque.json"), JSON.stringify(dados));
    revalidateTag(ETIQUETA, { expire: 0 });
    return;
  }
  const nome = `${PASTA}${new Date().toISOString().replace(/[:.]/g, "-")}.json`;

  await put(nome, JSON.stringify(dados, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });

  /* Derruba a leitura cacheada. Sem isto o site continuaria mostrando o estoque
     de cinco minutos atrás para quem acabou de cadastrar um carro.

     `expire: 0` porque aqui a pessoa precisa ver o que ela mesma acabou de
     salvar: com qualquer folga, o próximo pedido receberia a versão velha
     enquanto a nova é buscada, e ela ia achar que o salvamento não funcionou. */
  revalidateTag(ETIQUETA, { expire: 0 });

  // Guarda as últimas versões e apaga o resto. É histórico barato: se alguma
  // gravação sair errada, a anterior ainda está lá.
  try {
    const antigas = (await versoes()).slice(VERSOES_GUARDADAS);
    if (antigas.length) await del(antigas.map((b) => b.url));
  } catch {
    // Limpeza que falha não pode derrubar uma gravação que deu certo.
  }
}

/** Diz se o banco já existe, para a gerência saber se está vendo a semente. */
export async function bancoExiste(): Promise<boolean> {
  if (LOCAL) { try { await readFile(path.join(LOCAL, "estoque.json")); return true; } catch { return false; } }
  try {
    return (await versoes()).length > 0;
  } catch {
    return false;
  }
}

/**
 * Guarda uma foto enviada pela gerência.
 *
 * Recorta para a moldura 3:4 do site, gera as larguras que o site usa e nunca
 * passa da largura da origem: foto de celular pequena sai pequena, em vez de
 * sair ampliada e borrada. A dimensão da origem volta junto, gravada no carro.
 */
export async function salvarFoto(
  slug: string,
  indice: number,
  arquivo: ArrayBuffer,
): Promise<Foto> {
  const entrada = await sharp(Buffer.from(arquivo)).rotate().toBuffer();
  const meta = await sharp(entrada).metadata();
  const nativa = {
    w: Math.min(meta.width ?? 0, Math.floor((meta.height ?? 0) / PROPORCAO_FOTO)),
    h: Math.min(meta.height ?? 0, Math.floor((meta.width ?? 0) * PROPORCAO_FOTO)),
  };
  if (!nativa.w || !nativa.h) throw new Error("Não consegui ler as dimensões dessa imagem.");

  const pedidas = indice === 0 ? [...LARGURAS_FOTO, LARGURA_GRANDE] : [...LARGURAS_FOTO];

  /* As larguras de verdade, sem repetir. Quando a origem é menor que a largura
     pedida, a saída sai do tamanho da origem, e o nome do arquivo e o descritor
     do srcset passam a ser esse tamanho.

     Isso não é detalhe: um arquivo chamado 1440 com mil pixels dentro faz o
     navegador escolher ele para uma caixa de 1440 e ampliar. A foto fica
     borrada e nenhum teste que olhe só o nome percebe. */
  const larguras = [...new Set(pedidas.map((w) => Math.min(w, nativa.w)))].sort((a, b) => a - b);
  const fontes: { w: number; url: string }[] = [];
  const versaoFoto = randomUUID();

  for (const largura of larguras) {
    const saida = await sharp(entrada)
      .resize({
        width: largura,
        height: Math.round(largura * PROPORCAO_FOTO),
        fit: "cover",
        position: "centre",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();

    // Confere o que de fato saiu: pedir não é o mesmo que sair.
    const real = await sharp(saida).metadata();
    if ((real.width ?? 0) > nativa.w || (real.height ?? 0) > nativa.h) {
      throw new Error("O redimensionamento ampliou a foto. Não gravei.");
    }

    if (LOCAL) {
      fontes.push({ w: real.width ?? largura, url: "data:image/webp;base64," + saida.toString("base64") });
      continue;
    }
    const { url } = await put(`carros/${slug}/${versaoFoto}/${indice}-${real.width}.webp`, saida, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "image/webp",
    });
    fontes.push({ w: real.width ?? largura, url });
  }

  return { fontes, nativa };
}

/** Apaga as fotos que a gerência subiu para um carro. */
export async function apagarFotos(slug: string): Promise<void> {
  try {
    const { blobs } = await list({ prefix: `carros/${slug}/` });
    if (blobs.length) await del(blobs.map((b) => b.url));
  } catch {
    // Foto órfã no Blob não quebra o site. Apagar é limpeza, não requisito.
  }
}

export const LIMITE_FOTOS = FOTOS_POR_CARRO;
