export const brl = (n: number) =>
  n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export const km = (n: number) => `${n.toLocaleString("pt-BR")} km`;

export const nome = (c: { marca: string; modelo: string; versao?: string }) =>
  [c.marca, c.modelo, c.versao].filter(Boolean).join(" ");
