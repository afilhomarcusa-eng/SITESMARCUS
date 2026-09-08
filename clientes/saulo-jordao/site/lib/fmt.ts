/** Formatação. Número na tela sai do dado, nunca escrito à mão. */

export function reais(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

/** "R$ 7,88 milhões", para somas grandes que ninguém lê dígito a dígito. */
export function milhoes(valor: number): string {
  return (valor / 1_000_000).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function km(valor: number): string {
  return `${valor.toLocaleString("pt-BR")} km`;
}
