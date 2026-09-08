/**
 * As mensagens que chegam no WhatsApp dele.
 *
 * Nenhuma delas começa em branco. Quem clica num carro manda o carro junto, e
 * quem preenche um formulário manda a ficha inteira já escrita. Conversa em
 * branco só sai do botão do cabeçalho e do rodapé, que existe para quem só quer
 * falar.
 */

import { whatsapp } from "./contato";
import type { Carro } from "./estoque";
import { reais } from "./fmt";

export function mensagemDoCarro(carro: Carro): string {
  const ano = carro.anoTexto ?? String(carro.ano);
  return `Olá, Saulo. Vi o ${carro.nome} ${ano}, por ${reais(carro.preco)}, no site. Pode me falar mais sobre ele?`;
}

export function linkDoCarro(carro: Carro): string {
  return whatsapp(mensagemDoCarro(carro));
}
