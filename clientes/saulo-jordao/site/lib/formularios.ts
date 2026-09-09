/**
 * Os dois formulários.
 *
 * Não existe servidor por trás deles, e nenhum finge que existe. O formulário
 * monta uma mensagem, a pessoa lê a mensagem inteira do lado enquanto digita, e
 * o botão abre o WhatsApp com o texto pronto. Formulário que diz "enviado com
 * sucesso" e não manda nada é pior do que não ter formulário: o corretor perde
 * o cliente e nunca fica sabendo.
 *
 * Nenhum campo é obrigatório, e isso é a diferença entre ser respondido e não
 * ser. Quem não sabe a quilometragem de cabeça não pode travar por causa dela.
 * Campo em branco simplesmente não vira linha, e a mensagem continua fazendo
 * sentido com uma linha só.
 *
 * A lista de marcas vem do estoque de hoje, passada de fora por quem já leu o
 * banco: assim o formulário nunca oferece uma marca que o site não tem, nem
 * esquece uma que o Saulo acabou de cadastrar.
 *
 * Para ligar isto a um destino de verdade depois, um CRM ou um e-mail: a função
 * `montarMensagem` já devolve o texto pronto, e é só mandar ele para onde for,
 * no lugar de abrir o WhatsApp. O ponto está em components/formulario.tsx, na
 * função que trata o envio.
 */



export type Campo = {
  id: string;
  rotulo: string;
  tipo: "texto" | "lista" | "longo";
  opcoes?: string[];
  dica?: string;
  /** Ocupa a linha inteira na grade de dois campos. */
  largo?: boolean;
};

export type Formulario = {
  rota: string;
  chave: "procuro" | "vender";
  titulo: string;
  linhaFina: string;
  abertura: string;
  botao: string;
  campos: Campo[];
};

const FAIXAS = [
  "Até R$ 300 mil",
  "De R$ 300 mil a R$ 500 mil",
  "De R$ 500 mil a R$ 800 mil",
  "De R$ 800 mil a R$ 1,2 milhão",
  "Acima de R$ 1,2 milhão",
];

export const PROCURO: Formulario = {
  rota: "/procuro",
  chave: "procuro",
  titulo: "Procuro um carro",
  linhaFina:
    "Não achou no estoque? Diga o que você quer e Saulo procura no Brasil inteiro.",
  abertura: "Olá, Saulo. Vim pelo site e estou procurando um carro.",
  botao: "Mandar no WhatsApp",
  campos: [
    { id: "modelo", rotulo: "Que carro você procura", tipo: "texto", dica: "Marca, modelo e versão, se já souber", largo: true },
    { id: "marca", rotulo: "Marca, se já tiver uma em mente", tipo: "lista", opcoes: [] },
    { id: "ano", rotulo: "Ano", tipo: "texto", dica: "Do ano tal em diante" },
    { id: "faixa", rotulo: "Faixa de preço", tipo: "lista", opcoes: FAIXAS },
    { id: "cor", rotulo: "Cor", tipo: "texto" },
    { id: "cidade", rotulo: "Sua cidade", tipo: "texto" },
    { id: "troca", rotulo: "Tem carro para dar na troca", tipo: "lista", opcoes: ["Sim", "Não", "Talvez"] },
    { id: "recado", rotulo: "Mais alguma coisa", tipo: "longo", dica: "Blindado, teto solar, prazo, o que for", largo: true },
    { id: "nome", rotulo: "Seu nome", tipo: "texto" },
  ],
};

export const VENDER: Formulario = {
  rota: "/vender",
  chave: "vender",
  titulo: "Quero vender o meu",
  /* "do anúncio à transferência" saiu daqui: nenhuma fonte diz que ele cuida da
     documentação. O que o site dele diz é consultoria para vender com segurança
     e rapidez, e é isso que está escrito agora. */
  linhaFina:
    "Mande a ficha do seu carro. Saulo avalia e conduz a venda, com atendimento em todo o Brasil.",
  abertura: "Olá, Saulo. Vim pelo site e quero vender o meu carro.",
  botao: "Mandar no WhatsApp",
  campos: [
    { id: "modelo", rotulo: "Qual é o carro", tipo: "texto", dica: "Marca, modelo e versão", largo: true },
    { id: "ano", rotulo: "Ano", tipo: "texto" },
    { id: "km", rotulo: "Quilometragem", tipo: "texto", dica: "Mais ou menos já serve" },
    { id: "cor", rotulo: "Cor", tipo: "texto" },
    { id: "valor", rotulo: "Quanto você quer pelo carro", tipo: "texto", dica: "Se ainda não sabe, deixe em branco" },
    { id: "estado", rotulo: "Estado geral", tipo: "lista", opcoes: ["Impecável", "Bem cuidado", "Tem detalhes a resolver"] },
    { id: "documento", rotulo: "Situação do documento", tipo: "lista", opcoes: ["Quitado", "Financiado", "Em consórcio"] },
    { id: "cidade", rotulo: "Onde o carro está", tipo: "texto" },
    { id: "recado", rotulo: "Mais alguma coisa", tipo: "longo", dica: "Opcionais, revisões, garantia, o que valorizar", largo: true },
    { id: "nome", rotulo: "Seu nome", tipo: "texto" },
  ],
};

export const FORMULARIOS = { procuro: PROCURO, vender: VENDER } as const;

/**
 * Devolve o formulário com as opções que dependem do estoque de hoje já
 * preenchidas. Campo de lista sem opção nenhuma não vai para a tela: seletor
 * vazio é promessa que a página não cumpre.
 */
export function comEstoque(f: Formulario, marcas: string[]): Formulario {
  return {
    ...f,
    campos: f.campos
      .map((c) => (c.id === "marca" ? { ...c, opcoes: marcas } : c))
      .filter((c) => c.tipo !== "lista" || (c.opcoes?.length ?? 0) > 0),
  };
}

/**
 * Monta a mensagem com o que foi preenchido.
 *
 * Campo em branco não vira linha. Uma linha só continua sendo uma mensagem que
 * faz sentido do outro lado.
 */
export function montarMensagem(f: Formulario, valores: Record<string, string>): string {
  const linhas = f.campos
    .map((c) => {
      const v = (valores[c.id] ?? "").trim();
      return v ? `${c.rotulo}: ${v}` : "";
    })
    .filter(Boolean);

  return linhas.length ? `${f.abertura}\n\n${linhas.join("\n")}` : f.abertura;
}
