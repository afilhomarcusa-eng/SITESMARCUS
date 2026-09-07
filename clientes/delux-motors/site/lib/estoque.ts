"use client";

import { useEffect, useState } from "react";
import { CARROS_INICIAIS, type Carro } from "./carros";

/**
 * Camada de dados do estoque.
 *
 * É AQUI que o banco entra depois. Hoje a gerência grava no IndexedDB do
 * próprio navegador, o que é honesto: funciona de verdade, persiste de verdade,
 * e não finge que mandou nada para servidor nenhum.
 *
 * Para plugar um banco, troque só as quatro funções abaixo (lerTudo, gravarTudo,
 * lerFoto, gravarFoto) por chamadas de API. Nenhum componente precisa mudar.
 */

const BANCO = "delux-motors";
const VERSAO = 1;
const LOJA_CARROS = "carros";
const LOJA_FOTOS = "fotos";

export type CarroSalvo = Carro & {
  /** Chave da foto enviada pela gerência. Quando existe, manda nela. */
  fotoEnviada?: string;
};

function abrir(): Promise<IDBDatabase> {
  return new Promise((ok, erro) => {
    const req = indexedDB.open(BANCO, VERSAO);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(LOJA_CARROS)) db.createObjectStore(LOJA_CARROS);
      if (!db.objectStoreNames.contains(LOJA_FOTOS)) db.createObjectStore(LOJA_FOTOS);
    };
    req.onsuccess = () => ok(req.result);
    req.onerror = () => erro(req.error);
  });
}

async function transacao<T>(
  loja: string,
  modo: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await abrir();
  return new Promise<T>((ok, erro) => {
    const req = fn(db.transaction(loja, modo).objectStore(loja));
    req.onsuccess = () => ok(req.result);
    req.onerror = () => erro(req.error);
  });
}

export async function lerTudo(): Promise<CarroSalvo[] | null> {
  try {
    const v = await transacao<CarroSalvo[]>(LOJA_CARROS, "readonly", (s) =>
      s.get("lista"),
    );
    return v ?? null;
  } catch {
    return null;
  }
}

export async function gravarTudo(lista: CarroSalvo[]) {
  await transacao(LOJA_CARROS, "readwrite", (s) => s.put(lista, "lista"));
  window.dispatchEvent(new CustomEvent("dlx:estoque"));
}

export async function lerFoto(chave: string): Promise<string | null> {
  try {
    const v = await transacao<string>(LOJA_FOTOS, "readonly", (s) => s.get(chave));
    return v ?? null;
  } catch {
    return null;
  }
}

export async function gravarFoto(chave: string, dataUrl: string) {
  await transacao(LOJA_FOTOS, "readwrite", (s) => s.put(dataUrl, chave));
}

export async function apagarFoto(chave: string) {
  await transacao(LOJA_FOTOS, "readwrite", (s) => s.delete(chave));
}

/**
 * Volta o estoque ao ponto de partida.
 *
 * Neste cliente o ponto de partida é vazio, porque a Delux Motors não publica
 * estoque em lugar nenhum e não havia ficha real para trazer. Ver lib/carros.ts.
 */
export async function restaurarInicial() {
  await gravarTudo(CARROS_INICIAIS as CarroSalvo[]);
}

/**
 * O site público é renderizado no servidor com o estoque inicial, para o
 * Google ver conteúdo de verdade. Depois de montar, se a gerência tiver
 * gravado algo neste navegador, a lista é trocada. A troca acontece só depois
 * da hidratação, então não existe divergência entre servidor e cliente.
 */
export function useEstoque(inicial: Carro[]) {
  const [lista, setLista] = useState<CarroSalvo[]>(inicial as CarroSalvo[]);

  useEffect(() => {
    let vivo = true;
    const carregar = () =>
      lerTudo().then((salvo) => {
        if (vivo && salvo && salvo.length) setLista(salvo);
      });
    carregar();
    window.addEventListener("dlx:estoque", carregar);
    return () => {
      vivo = false;
      window.removeEventListener("dlx:estoque", carregar);
    };
  }, []);

  return lista;
}

/**
 * Resolve o src de um carro: foto enviada pela gerência ou a do build.
 *
 * O caminho padrão é derivado direto das props, na renderização. O estado
 * guarda só o que precisa vir do IndexedDB, que é assíncrono. Guardar os dois
 * em estado obrigava a chamar setState dentro do efeito e disparava uma
 * cascata de renderizações a cada troca de props.
 */
export function useFoto(carro: CarroSalvo, tamanho: "1000" | "g-1440") {
  // Sem foto é sem foto. Devolver o arquivo de outro carro seria mostrar uma
  // lataria que não é a que está à venda.
  const padrao = carro.foto ? `/images/${carro.foto}-${tamanho}.webp` : "";
  const [enviada, setEnviada] = useState<string | null>(null);

  useEffect(() => {
    if (!carro.fotoEnviada) return;
    let vivo = true;
    lerFoto(carro.fotoEnviada).then((d) => {
      if (vivo) setEnviada(d);
    });
    return () => {
      vivo = false;
    };
  }, [carro.fotoEnviada]);

  return carro.fotoEnviada ? (enviada ?? "") : padrao;
}
