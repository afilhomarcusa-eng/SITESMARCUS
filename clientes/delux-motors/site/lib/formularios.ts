/**
 * Os três formulários.
 *
 * A loja faz três coisas, então existem três formulários, um para cada. Quem
 * quer vender o carro não deveria responder pergunta de quem quer comprar.
 *
 * Nenhum campo é obrigatório, e isso não é descuido. Formulário de interesse
 * com campo obrigatório serve para o visitante desistir no meio: ele não sabe
 * a quilometragem de cabeça, não quer dizer quanto pretende pagar antes de
 * conversar, e vai embora. Aqui quem escreve só uma linha manda só uma linha, e
 * a mensagem continua fazendo sentido.
 *
 * Nada é enviado para servidor nenhum, porque a loja não tem servidor. Os
 * campos montam uma mensagem, o visitante lê ela inteira enquanto digita, e o
 * botão abre o WhatsApp com o texto pronto. Um formulário que diz "enviado com
 * sucesso" e não manda nada é pior do que não existir: o cliente vai embora
 * achando que falou com alguém, e a loja nunca fica sabendo.
 *
 * Este arquivo é só a descrição dos formulários. Quem desenha é
 * components/formulario.tsx, um só, para os três: campo novo se escreve aqui e
 * aparece lá com o mesmo comportamento de todos os outros.
 */

export type Campo = {
  id: string;
  rotulo: string;
  tipo: "texto" | "numero" | "area" | "escolha";
  /** Texto pequeno embaixo do campo, explicando o que ajuda de verdade. */
  dica?: string;
  /** A opção neutra de um select. Sempre a primeira, sempre selecionada. */
  vazio?: string;
  opcoes?: readonly string[];
  /** As marcas vêm do estoque de verdade, então são montadas na hora. */
  opcoesDoEstoque?: boolean;
  /** Ocupa meia coluna quando cabe ao lado do vizinho. */
  metade?: boolean;
  /** Como o valor preenchido vira uma linha da mensagem. */
  prefixo: string;
};

export type Formulario = {
  id: string;
  rota: string;
  /** Nome curto, para a aba de troca de serviço no topo do formulário. */
  aba: string;
  titulo: string;
  chamada: string;
  intro: string;
  /** Assunto da mensagem, logo depois da saudação. */
  assunto: string;
  /** Usada quando o visitante não preenche nada e manda assim mesmo. */
  vazia: string;
  botao: string;
  descricao: string;
  campos: readonly Campo[];
};

const NOME: Campo = {
  id: "nome",
  rotulo: "Seu nome",
  tipo: "texto",
  dica: "Só para a equipe saber como te chamar.",
  prefixo: "",
};

const OBSERVACAO: Campo = {
  id: "observacao",
  rotulo: "Mais alguma coisa",
  tipo: "area",
  prefixo: "",
};

/** Perguntas que valem para qualquer carro que a loja vá avaliar. */
const CARRO: Campo = {
  id: "carro",
  rotulo: "Qual o carro",
  tipo: "texto",
  dica: "Marca, modelo e versão, do jeito que você souber.",
  prefixo: "Carro",
};

const ANO: Campo = {
  id: "ano",
  rotulo: "Ano",
  tipo: "numero",
  metade: true,
  prefixo: "Ano",
};

const KM: Campo = {
  id: "km",
  rotulo: "Quilometragem",
  tipo: "numero",
  metade: true,
  dica: "Aproximada já serve.",
  prefixo: "Quilometragem",
};

const SITUACAO: Campo = {
  id: "situacao",
  rotulo: "Situação do carro",
  tipo: "escolha",
  vazio: "Prefiro falar depois",
  opcoes: ["Quitado", "Financiado, ainda pagando", "Financiado, quase quitado"],
  metade: true,
  prefixo: "Situação",
};

export const FORMULARIOS: readonly Formulario[] = [
  {
    id: "comprar",
    rota: "/comprar",
    aba: "Comprar",
    titulo: "Quero comprar um carro",
    chamada: "A gente procura o carro por você",
    intro:
      "O estoque gira toda semana e nem tudo chega a ser publicado. Diga o que você quer e a equipe avisa quando entrar.",
    assunto: "Quero comprar um carro.",
    vazia: "Queria ver os carros que vocês têm disponíveis.",
    botao: "Enviar no WhatsApp",
    descricao:
      "Diga o que você procura e a equipe da Delux Motors avisa quando entrar no estoque. Nada obrigatório, a mensagem vai pelo WhatsApp.",
    campos: [
      NOME,
      {
        id: "procura",
        rotulo: "O que você procura",
        tipo: "area",
        dica: "Pode ser um modelo, um tipo de carro ou só o uso: SUV para a família, picape para trabalho.",
        prefixo: "Procuro",
      },
      {
        id: "marca",
        rotulo: "Marca de preferência",
        tipo: "escolha",
        vazio: "Tanto faz",
        opcoesDoEstoque: true,
        metade: true,
        prefixo: "Marca de preferência",
      },
      {
        id: "faixa",
        rotulo: "Faixa de preço",
        tipo: "escolha",
        vazio: "Ainda não sei",
        opcoes: [
          "Até 50 mil",
          "De 50 a 80 mil",
          "De 80 a 120 mil",
          "De 120 a 200 mil",
          "Acima de 200 mil",
        ],
        metade: true,
        prefixo: "Faixa de preço",
      },
      { ...ANO, rotulo: "Ano a partir de", prefixo: "Ano a partir de" },
      {
        id: "pagamento",
        rotulo: "Como pretende pagar",
        tipo: "escolha",
        vazio: "Prefiro falar depois",
        opcoes: ["À vista", "Financiado", "Com entrada e financiamento", "Ainda decidindo"],
        metade: true,
        prefixo: "Pagamento",
      },
      {
        id: "troca",
        rotulo: "Tem carro para dar na troca",
        tipo: "texto",
        dica: "Modelo, ano e quilometragem já ajudam a equipe a fazer a conta.",
        prefixo: "Tenho para dar na troca",
      },
      OBSERVACAO,
    ],
  },

  {
    id: "vender",
    rota: "/vender",
    aba: "Vender",
    titulo: "Quero vender o meu",
    chamada: "Conte do seu carro e receba a avaliação",
    intro:
      "A loja compra direto, sem você ter que anunciar nem receber estranho em casa. Quanto mais coisa você contar aqui, mais firme sai a avaliação na conversa.",
    assunto: "Quero vender o meu carro.",
    vazia: "Queria saber como funciona a avaliação para vender meu carro.",
    botao: "Enviar no WhatsApp",
    descricao:
      "Conte do seu carro e a Delux Motors avalia a compra. Nada obrigatório, a mensagem vai pelo WhatsApp.",
    campos: [
      NOME,
      CARRO,
      ANO,
      KM,
      {
        id: "cambio",
        rotulo: "Câmbio",
        tipo: "escolha",
        vazio: "Não sei dizer",
        opcoes: ["Automático", "Manual"],
        metade: true,
        prefixo: "Câmbio",
      },
      {
        id: "cor",
        rotulo: "Cor",
        tipo: "texto",
        metade: true,
        prefixo: "Cor",
      },
      {
        id: "estado",
        rotulo: "Estado de conservação",
        tipo: "escolha",
        vazio: "Prefiro que vocês vejam",
        opcoes: [
          "Sem nada para arrumar",
          "Pequenos reparos de lataria ou pintura",
          "Tem coisa mecânica para resolver",
        ],
        metade: true,
        prefixo: "Estado",
      },
      SITUACAO,
      {
        id: "valor",
        rotulo: "Quanto você espera receber",
        tipo: "texto",
        dica: "Se ainda não fez ideia, deixe em branco e a equipe traz um número.",
        prefixo: "Espera receber",
      },
      {
        ...OBSERVACAO,
        dica: "As fotos você manda direto na conversa, que fica mais fácil.",
      },
    ],
  },

  {
    id: "consignar",
    rota: "/consignar",
    aba: "Consignar",
    titulo: "Quero deixar em consignação",
    chamada: "Seu carro exposto, e a venda por nossa conta",
    intro:
      "O carro fica na loja, na Av. Octávio Mangabeira, e a equipe anuncia, atende e negocia por você. Você recebe quando a venda fecha.",
    assunto: "Quero deixar meu carro em consignação.",
    vazia: "Queria saber como funciona a consignação.",
    botao: "Enviar no WhatsApp",
    descricao:
      "Deixe seu carro exposto na Delux Motors e a equipe cuida da venda. Nada obrigatório, a mensagem vai pelo WhatsApp.",
    campos: [
      NOME,
      CARRO,
      ANO,
      KM,
      {
        id: "valor",
        rotulo: "Por quanto quer vender",
        tipo: "texto",
        metade: true,
        prefixo: "Quer vender por",
      },
      SITUACAO,
      {
        id: "tempo",
        rotulo: "Há quanto tempo está tentando vender",
        tipo: "escolha",
        vazio: "Ainda não comecei",
        opcoes: ["Menos de um mês", "De um a três meses", "Mais de três meses"],
        prefixo: "Tentando vender há",
      },
      {
        id: "urgencia",
        rotulo: "Tem pressa",
        tipo: "escolha",
        vazio: "Prefiro falar depois",
        opcoes: ["Preciso vender rápido", "Sem pressa, quero o melhor preço"],
        metade: true,
        prefixo: "Prazo",
      },
      OBSERVACAO,
    ],
  },
] as const;

export function acharFormulario(id: string) {
  const f = FORMULARIOS.find((x) => x.id === id);
  if (!f) throw new Error(`formulário desconhecido: ${id}`);
  return f;
}

/**
 * Monta a mensagem a partir do que foi preenchido.
 *
 * Só entra no texto o campo que tem conteúdo. Uma mensagem cheia de "não
 * informado" faz o visitante parecer desorganizado e a loja perder tempo lendo
 * linha vazia.
 *
 * Vive aqui, fora do componente, para o teste poder chamar ela direto.
 */
export function montarMensagem(
  form: Formulario,
  valores: Record<string, string>,
): string {
  const nome = (valores.nome ?? "").trim();
  const linhas: string[] = [
    nome
      ? `Olá! Aqui é ${nome}, vim pelo site da Delux Motors.`
      : "Olá! Vim pelo site da Delux Motors.",
    "",
    form.assunto,
    "",
  ];

  let contou = 0;
  for (const campo of form.campos) {
    if (campo.id === "nome" || campo.id === "observacao") continue;
    const v = (valores[campo.id] ?? "").trim();
    if (!v) continue;
    contou++;
    linhas.push(`${campo.prefixo}: ${v}`);
  }

  const obs = (valores.observacao ?? "").trim();
  if (obs) {
    contou++;
    linhas.push("");
    linhas.push(obs);
  }

  if (contou === 0) {
    linhas.push(form.vazia);
  }

  // Sem linha em branco sobrando no fim nem duas seguidas no meio.
  return linhas
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
