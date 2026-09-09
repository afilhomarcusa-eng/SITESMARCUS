/**
 * Os filtros do estoque.
 *
 * O estado inteiro mora na barra de endereço. Não existe cópia dele em estado
 * local: quem lê a URL é o componente, direto, com useSyncExternalStore. Isso
 * apaga os dois efeitos de sincronização, resolve a hidratação sem divergência,
 * e faz de qualquer seleção um link que pode ser mandado por mensagem.
 *
 * O servidor manda a lista inteira no HTML. O filtro do cliente só estreita o
 * que já está lá, então nada do estoque fica escondido do robô de busca.
 */

import type { Carro } from "./tipos";

export type Ordem = "catalogo" | "menor-preco" | "maior-preco" | "menor-km";

export const ORDENS: { valor: Ordem; rotulo: string }[] = [
  { valor: "catalogo", rotulo: "Ordem do catálogo" },
  { valor: "menor-preco", rotulo: "Menor preço" },
  { valor: "maior-preco", rotulo: "Maior preço" },
  { valor: "menor-km", rotulo: "Menor quilometragem" },
];

export type Selecao = {
  busca: string;
  marca: string;
  ate: number | null;
  ordem: Ordem;
};

export const VAZIA: Selecao = { busca: "", marca: "", ate: null, ordem: "catalogo" };

/**
 * Os tetos de preço.
 *
 * Saem da própria lista, não de números redondos escolhidos a dedo: um teto que
 * não separa nada é uma promessa que a grade não cumpre.
 */
export function tetosDePreco(carros: Carro[]): number[] {
  const candidatos = [300_000, 500_000, 700_000, 1_000_000];
  return candidatos.filter((teto) => {
    const dentro = carros.filter((c) => c.preco <= teto).length;
    return dentro > 0 && dentro < carros.length;
  });
}

export function lerSelecao(params: URLSearchParams): Selecao {
  const ordem = params.get("ordem") as Ordem | null;
  const ate = Number(params.get("ate"));
  return {
    busca: params.get("busca")?.slice(0, 60) ?? "",
    marca: params.get("marca") ?? "",
    ate: Number.isFinite(ate) && ate > 0 ? ate : null,
    ordem: ORDENS.some((o) => o.valor === ordem) ? (ordem as Ordem) : "catalogo",
  };
}

export function escreverSelecao(s: Selecao): string {
  const p = new URLSearchParams();
  if (s.busca.trim()) p.set("busca", s.busca.trim());
  if (s.marca) p.set("marca", s.marca);
  if (s.ate) p.set("ate", String(s.ate));
  if (s.ordem !== "catalogo") p.set("ordem", s.ordem);
  const q = p.toString();
  return q ? `?${q}` : "";
}

function texto(c: Carro): string {
  return [c.marca, c.modelo, c.nome, c.cor, c.motor, String(c.ano)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function aplicar(s: Selecao, carros: Carro[]): Carro[] {
  const busca = s.busca
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

  const lista = carros.filter((c) => {
    if (s.marca && c.marca !== s.marca) return false;
    if (s.ate && c.preco > s.ate) return false;
    if (busca && !texto(c).includes(busca)) return false;
    return true;
  });

  const ordenada = [...lista];
  if (s.ordem === "menor-preco") ordenada.sort((a, b) => a.preco - b.preco);
  if (s.ordem === "maior-preco") ordenada.sort((a, b) => b.preco - a.preco);
  if (s.ordem === "menor-km") {
    // Carro sem quilometragem declarada vai para o fim, em vez de fingir zero.
    ordenada.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
  }
  return ordenada;
}

export function quantosFiltros(s: Selecao): number {
  return [s.busca.trim(), s.marca, s.ate ? "1" : ""].filter(Boolean).length;
}
