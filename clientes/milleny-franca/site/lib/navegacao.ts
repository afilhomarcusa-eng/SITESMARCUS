/**
 * As ancoras saem daqui, e as secoes da pagina leem a mesma lista.
 * Numeracao e rotulo nao sao escritos a mao em lugar nenhum.
 */
export const secoes = [
  { id: "sobre-mim", rotulo: "Sobre mim" },
  { id: "atendimento", rotulo: "Atendimento" },
  { id: "como-comeca", rotulo: "Como começa" },
  { id: "duvidas", rotulo: "Dúvidas" },
  { id: "contato", rotulo: "Contato" },
] as const;

export type Secao = (typeof secoes)[number];

export function numeroDaSecao(id: string) {
  const i = secoes.findIndex((s) => s.id === id);
  return i < 0 ? "" : String(i + 1).padStart(2, "0");
}
