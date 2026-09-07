import type { CarroSalvo } from "./estoque";

/**
 * Filtro e ordenação do estoque.
 *
 * Funções puras, sem React e sem DOM, porque isto é a regra de negócio da
 * página que mais importa do site. O componente só liga a interface nelas.
 *
 * O estado inteiro cabe na barra de endereço. Isso não é enfeite: quem atende
 * no WhatsApp precisa mandar "olha os automáticos até 150 mil" como um link,
 * e não como uma instrução de quatro passos.
 */

export type Ordem = "menor" | "maior" | "km" | "novo";

export type Filtro = {
  busca: string;
  marcas: string[];
  cambios: string[];
  combustiveis: string[];
  precoMax: number | null;
  ordem: Ordem;
};

export const FILTRO_VAZIO: Filtro = {
  busca: "",
  marcas: [],
  cambios: [],
  combustiveis: [],
  precoMax: null,
  ordem: "menor",
};

export const ORDENS: { id: Ordem; rotulo: string }[] = [
  { id: "menor", rotulo: "Menor preço" },
  { id: "maior", rotulo: "Maior preço" },
  { id: "km", rotulo: "Menos rodado" },
  { id: "novo", rotulo: "Mais novo" },
];

/** Ano de fabricação a partir de "2023" ou "22/23". Serve para ordenar. */
export function anoNumero(ano: string): number {
  const ultimo = ano.split("/").pop()?.trim() ?? "";
  const n = Number(ultimo);
  if (!Number.isFinite(n)) return 0;
  return n < 100 ? 2000 + n : n;
}

/** Normaliza para busca: sem acento, sem caixa. */
function chave(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Câmbio tem muitos nomes comerciais (S tronic, DCT, CVT, automatizado) e todos
 * são, para quem compra, "não preciso trocar marcha". Agrupar aqui evita um
 * filtro com sete opções que separam a mesma coisa.
 */
export function grupoCambio(cambio: string): "Automático" | "Manual" {
  return /manual/i.test(cambio) ? "Manual" : "Automático";
}

export function opcoes(carros: CarroSalvo[]) {
  // Campo em branco não vira opção. Quando a legenda do anúncio não diz o
  // combustível, o certo é o carro não aparecer sob nenhum, e não o filtro
  // ganhar uma pílula sem texto.
  const unico = (xs: string[]) =>
    [...new Set(xs.filter((x) => x && x.trim()))].sort((a, b) =>
      a.localeCompare(b, "pt-BR"),
    );
  return {
    marcas: unico(carros.map((c) => c.marca)),
    cambios: unico(carros.map((c) => grupoCambio(c.cambio))),
    combustiveis: unico(carros.map((c) => c.combustivel)),
    precoMin: carros.length ? Math.min(...carros.map((c) => c.preco)) : 0,
    precoMax: carros.length ? Math.max(...carros.map((c) => c.preco)) : 0,
  };
}

export function aplicar(carros: CarroSalvo[], f: Filtro): CarroSalvo[] {
  const busca = chave(f.busca.trim());

  const filtrados = carros.filter((c) => {
    if (f.marcas.length && !f.marcas.includes(c.marca)) return false;
    if (f.cambios.length && !f.cambios.includes(grupoCambio(c.cambio))) return false;
    if (f.combustiveis.length && !f.combustiveis.includes(c.combustivel)) return false;
    if (f.precoMax !== null && c.preco > f.precoMax) return false;
    if (busca) {
      const alvo = chave(`${c.marca} ${c.modelo} ${c.versao} ${c.motor} ${c.ano}`);
      // Cada palavra digitada precisa aparecer, em qualquer ordem. Assim
      // "bmw sport" acha a 320i M Sport e "sport bmw" também.
      if (!busca.split(/\s+/).every((p) => alvo.includes(p))) return false;
    }
    return true;
  });

  const ordenado = [...filtrados];
  if (f.ordem === "menor") ordenado.sort((a, b) => a.preco - b.preco);
  if (f.ordem === "maior") ordenado.sort((a, b) => b.preco - a.preco);
  if (f.ordem === "km") ordenado.sort((a, b) => a.km - b.km);
  if (f.ordem === "novo") ordenado.sort((a, b) => anoNumero(b.ano) - anoNumero(a.ano));
  return ordenado;
}

/** Quantos filtros o visitante ligou. Zero significa estoque inteiro. */
export function quantosAtivos(f: Filtro) {
  return (
    (f.busca.trim() ? 1 : 0) +
    f.marcas.length +
    f.cambios.length +
    f.combustiveis.length +
    (f.precoMax !== null ? 1 : 0)
  );
}

/* ------------------------------ barra de endereço ------------------------- */

export function paraQuery(f: Filtro): string {
  const p = new URLSearchParams();
  if (f.busca.trim()) p.set("q", f.busca.trim());
  if (f.marcas.length) p.set("marca", f.marcas.join(","));
  if (f.cambios.length) p.set("cambio", f.cambios.join(","));
  if (f.combustiveis.length) p.set("combustivel", f.combustiveis.join(","));
  if (f.precoMax !== null) p.set("ate", String(f.precoMax));
  if (f.ordem !== FILTRO_VAZIO.ordem) p.set("ordem", f.ordem);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function daQuery(busca: string): Filtro {
  const p = new URLSearchParams(busca);
  const lista = (k: string) => {
    const v = p.get(k);
    return v ? v.split(",").filter(Boolean) : [];
  };
  const ate = Number(p.get("ate"));
  const ordem = p.get("ordem");
  return {
    busca: p.get("q") ?? "",
    marcas: lista("marca"),
    cambios: lista("cambio"),
    combustiveis: lista("combustivel"),
    precoMax: Number.isFinite(ate) && ate > 0 ? ate : null,
    ordem: ORDENS.some((o) => o.id === ordem) ? (ordem as Ordem) : FILTRO_VAZIO.ordem,
  };
}
