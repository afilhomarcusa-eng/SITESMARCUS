/**
 * Fonte única de verdade do site.
 *
 * Regra do briefing: campo vazio remove o elemento. Nada aqui é inventado.
 * Cada `null` faz o botão, link ou seção correspondente desaparecer da página.
 * Quando a Clara responder, troca o valor e o elemento nasce sozinho.
 */

export const clara = {
  nome: "Clara Biscarde",
  profissao: "Psicóloga Infantojuvenil",
  registro: "CRP 03/34973",

  cidade: "Salvador" as string | null,
  estado: "BA" as string | null,

  /** Número puro, só dígitos com DDI. */
  whatsapp: "5571999132904" as string | null,

  /**
   * Link de convite do WhatsApp, o que veio do QR code. Fica de reserva:
   * com o número acima preenchido, o wa.me clássico tem prioridade porque
   * é o único formato que garante a mensagem já escrita.
   */
  whatsappLink: "https://wa.me/qr/6KU5S74BUCQOA1" as string | null,

  telefone: null as string | null,
  email: null as string | null,
  instagram: "psiclarabiscarde" as string | null, // só o usuário, sem @
  endereco: null as string | null,
  horario: null as string | null,

  /**
   * Retrato do hero. O arquivo precisa existir em /public com esse nome.
   * Enquanto não existir, o hero renderiza o painel de reserva.
   */
  retrato: "/clara.jpg" as string | null,
  retratoLargura: 1600,
  retratoAltura: 1600,
} as const;

const MENSAGEM =
  "Oi Clara, vim pelo site e queria saber sobre atendimento pro meu filho";

/**
 * Monta o destino do WhatsApp com a mensagem já escrita.
 *
 * Com o número, é o wa.me clássico e o texto chega garantido. Sem ele, sobra o
 * link de convite do QR: abre a conversa certa, e o `text` vai junto na
 * tentativa de aproveitar, mas o WhatsApp pode descartar nesse formato. Quando
 * o número dela chegar, preencher `clara.whatsapp` resolve os dois casos.
 */
export function whatsappCom(texto: string): string | null {
  const parametro = `?text=${encodeURIComponent(texto)}`;
  if (clara.whatsapp) return `https://wa.me/${clara.whatsapp}${parametro}`;
  if (clara.whatsappLink) return `${clara.whatsappLink}${parametro}`;
  return null;
}

export const links = {
  /** wa.me abre o app no celular e o WhatsApp Web no computador. */
  whatsapp: whatsappCom(MENSAGEM),

  /** Força o WhatsApp Web, para quem está no computador sem o app.
      Só existe com o número: essa rota não aceita link de convite. */
  whatsappWeb: clara.whatsapp
    ? `https://web.whatsapp.com/send?phone=${clara.whatsapp}&text=${encodeURIComponent(MENSAGEM)}`
    : null,

  instagram: clara.instagram
    ? `https://instagram.com/${clara.instagram}`
    : null,
  telefone: clara.telefone ? `tel:+${clara.telefone}` : null,
  email: clara.email ? `mailto:${clara.email}` : null,
} as const;

/** Formata 5571999998888 como (71) 99999-8888 para exibir na tela. */
export function telefoneLegivel(numero: string | null): string | null {
  if (!numero) return null;
  const so = numero.replace(/\D/g, "").replace(/^55/, "");
  if (so.length === 11)
    return `(${so.slice(0, 2)}) ${so.slice(2, 7)}-${so.slice(7)}`;
  if (so.length === 10)
    return `(${so.slice(0, 2)}) ${so.slice(2, 6)}-${so.slice(6)}`;
  return numero;
}

/** Destino de todo botão de agendar. Sem canal, o botão não existe. */
export const agendar = links.whatsapp ?? links.instagram ?? null;


/**
 * Atendimento. Preenchido com o que ela confirmou junto com a copy definitiva.
 * Duração da sessão e faixa etária exata seguem sem resposta.
 */
export const atendimento = {
  idadeMinima: null as number | null,
  idadeMaxima: null as number | null,
  abordagem: "Terapia Cognitivo-Comportamental" as string | null,
  duracaoMinutos: null as number | null,
  frequencia: "Uma vez por semana, ajustável ao longo do acompanhamento",
  online: true,
  presencial: true,
} as const;

/**
 * Faixa que corre logo depois da capa.
 *
 * Ela pediu só dois itens: o que faz e o registro. Cidade e público já
 * aparecem em outras seções da página, então repetir aqui virou redundância
 * aos olhos dela depois de ver o site rodando.
 */
export const faixaInfo: string[] = [
  "Atendimento Infantojuvenil",
  clara.registro,
];

/**
 * Sobre mim. Texto da Clara, sem alteração, tirando os dois pontos depois de
 * "não aparece em palavras": no original faltava a pontuação e as duas orações
 * ficavam emendadas.
 *
 * A terceira frase da versão anterior, a que listava a formação em prosa,
 * saiu daqui: virou a lista `formacao` logo abaixo.
 */
export const sobre = [
  "A Psicologia me ensinou que, muitas vezes, o que uma criança ou adolescente sente não aparece em palavras: aparece no comportamento, na brincadeira, no silêncio, nas relações e até na forma como pede ajuda. Foi a partir desse olhar, construído especialmente nas minhas experiências com crianças e adolescentes no ambiente escolar, que encontrei sentido em acompanhar de perto as descobertas, os desafios e as transformações que fazem parte do crescer.",
  "No consultório, meu trabalho é oferecer um espaço seguro, acolhedor e respeitoso, onde cada criança e adolescente possa ser compreendido em sua própria forma de existir e se expressar. Através da escuta, do brincar e de recursos adequados a cada fase do desenvolvimento, busco ajudá-los a reconhecer emoções, fortalecer vínculos e construir novas formas de lidar com suas experiências. E como ninguém cresce sozinho, a família também faz parte desse caminho, com orientações e apoio para tornar os desafios do cotidiano mais compreensíveis e possíveis de atravessar juntos.",
];

/**
 * Formação, em faixas com ícone abaixo do texto de Sobre mim.
 *
 * `livro` é formação acadêmica, `labirinto` é o treinamento na escala de
 * mesmo nome: a distinção é o que impede a lista de virar três linhas
 * idênticas. O `detalhe` entra em tom mais claro ao lado
 * do título, sem travessão no meio, que o briefing proíbe.
 */
export const formacao = [
  {
    desenho: "livro" as const,
    titulo: "Formação EBMSP",
    detalhe: "Escola Bahiana de Medicina e Saúde Pública",
  },
  {
    desenho: "livro" as const,
    titulo: "Pós-graduanda em TCC",
    detalhe: "Terapia Cognitivo-Comportamental, no INTCC",
  },
  {
    desenho: "labirinto" as const,
    titulo: "Treinamento na Escala LABIRINTO",
    detalhe: "Avaliação de sinais de TEA",
  },
];

/**
 * Os quatro focos do acompanhamento. Texto da Clara, sem alteração.
 *
 * O layout segue a referência que ela mandou: quatro cartões com ícone,
 * salvia e rosé alternados. Ver components/desenhos.tsx (Coracao, Alvo,
 * Raio, Estrela) e a seção #fases em app/page.tsx.
 */
export const focos = [
  {
    titulo: "Emoções",
    texto:
      "Um espaço para acolher, compreender e expressar o que se sente.",
  },
  {
    titulo: "Comportamentos",
    texto:
      "Um espaço para compreender o que os comportamentos estão tentando comunicar.",
  },
  {
    titulo: "Relações",
    texto:
      "Um olhar cuidadoso para os vínculos construídos em casa, na escola e no dia a dia.",
  },
  {
    titulo: "Desenvolvimento",
    texto:
      "Acompanhamento das mudanças e desafios de cada fase do desenvolvimento.",
  },
];

/** Para quem ela atende. Texto da Clara, sem alteração. */
export const publicos = [
  {
    titulo: "Crianças",
    texto:
      "O brincar também é uma forma de expressão. Jogos, desenhos, histórias e outros recursos podem fazer parte do processo, respeitando a idade e as necessidades de cada criança.",
  },
  {
    titulo: "Adolescentes",
    texto:
      "Um espaço de escuta e diálogo para questões emocionais, relacionais e desafios próprios desta etapa do desenvolvimento.",
  },
  {
    titulo: "Famílias",
    texto:
      "A orientação familiar pode contribuir para a compreensão das necessidades da criança e do adolescente e para o diálogo sobre situações do cotidiano.",
  },
];

/**
 * Modalidades. Só entram porque ela confirmou as duas junto com a copy.
 *
 * O layout é a faixa cheia, borda a borda, que ela mandou como referência
 * (site da Lorena Lorenzo). Mesmo texto de sempre, salvia para Online e rosé
 * para Presencial no lugar das cores da referência.
 */
export const modalidades = [
  {
    titulo: "Online",
    texto:
      "Atendimento online, com acolhimento, segurança e sigilo, para que você possa cuidar da saúde emocional de onde estiver. Disponível para todo o Brasil.",
  },
  {
    titulo: "Presencial",
    texto: `Atendimento presencial em ${clara.cidade}, em um espaço pensado para acolher crianças, adolescentes e suas famílias.`,
  },
];

/**
 * Do primeiro contato ao acompanhamento. Texto da Clara, sem alteração.
 *
 * Os desenhos aqui deixaram de ser castelo e dragão junto com a troca da copy:
 * a versão anterior tratava o processo como aventura, com "desafio" e
 * "travessia", e o texto dela é outro. Agora são cinco marcos neutros.
 */
export const caminho = [
  {
    desenho: "conversa" as const,
    rotulo: "Primeiro contato",
    titulo: "Primeiro contato",
    texto:
      "Você pode entrar em contato pelo WhatsApp, telefone ou Instagram.",
  },
  {
    desenho: "ponte" as const,
    rotulo: "Conversa com responsáveis",
    titulo: "Conversa com responsáveis",
    texto:
      "Antes de iniciar o atendimento com a criança ou adolescente, realizamos uma conversa para conhecer sua história, compreender as principais preocupações da família e entender melhor o momento vivido.",
  },
  {
    desenho: "bussola" as const,
    rotulo: "Conhecendo a criança ou adolescente",
    titulo: "Conhecendo a criança ou adolescente",
    texto:
      "Os primeiros encontros são construídos de forma acolhedora e respeitando o tempo de cada um. É um momento de criação de vínculo e de compreensão das emoções, comportamentos, relações e necessidades.",
  },
  {
    desenho: "bandeira" as const,
    rotulo: "Construímos o caminho juntos",
    titulo: "Construímos o caminho juntos",
    texto:
      "A partir do que for sendo compreendido ao longo dos encontros, o acompanhamento é pensado de forma individualizada, de acordo com as necessidades de cada criança ou adolescente.",
  },
  {
    desenho: "casa" as const,
    rotulo: "A família também faz parte",
    titulo: "A família também faz parte",
    texto:
      "Quando necessário, realizamos momentos de orientação com os responsáveis, ajudando a compreender o que está acontecendo e construindo possibilidades para os desafios do dia a dia.",
  },
];

/**
 * Dúvidas. Texto da Clara, sem alteração, tirando um "que situação" repetido
 * na primeira resposta.
 *
 * Diferente da versão anterior do site, aqui não existe pergunta sem resposta:
 * ela escreveu as cinco.
 */
export const duvidas = [
  {
    titulo: "Como saber se é o momento de procurar o acompanhamento psicológico?",
    texto:
      "Não existe uma única situação que determine essa procura. Mudanças emocionais, comportamentais, dificuldades nas relações ou dúvidas da própria família podem motivar uma conversa com uma profissional. O primeiro contato também pode servir para entender melhor a necessidade apresentada.",
  },
  {
    titulo: "Os pais participam do processo?",
    texto:
      "Sim. A família ocupa um lugar importante no acompanhamento. São realizados momentos de orientação com os responsáveis sempre que necessário, preservando também o espaço de confiança e privacidade da criança ou do adolescente.",
  },
  {
    titulo: "Com que frequência acontecem as sessões?",
    texto:
      "Geralmente, os atendimentos acontecem uma vez por semana. A frequência pode ser ajustada de acordo com as necessidades identificadas ao longo do acompanhamento.",
  },
  {
    titulo: "E se meu filho não quiser falar na terapia?",
    texto:
      "Tudo bem. Crianças e adolescentes não precisam chegar ao consultório sabendo explicar o que sentem. O vínculo é construído aos poucos, respeitando o tempo e a forma de expressão de cada um, seja pela conversa, pela brincadeira, pelo desenho, pelo silêncio ou por outros recursos.",
  },
  {
    titulo: "A terapia infantil é só brincar?",
    texto:
      "Não. Brincar é uma das principais formas de expressão da criança e, por isso, pode fazer parte do processo terapêutico. Por meio das brincadeiras, jogos, desenhos e outros recursos, a criança pode comunicar sentimentos, experiências e dificuldades que ainda não consegue colocar em palavras. Na terapia, o brincar não acontece “por brincar”: ele é utilizado de forma intencional, respeitando a idade, as necessidades e os objetivos de cada criança.",
  },
];

/** Menu do cabeçalho. Só entra âncora de seção que existe de fato. */
export const menu = [
  { rotulo: "Sobre mim", href: "#sobre" },
  { rotulo: "Atendimento", href: "#atendimento" },
  { rotulo: "Como começa", href: "#caminho" },
  { rotulo: "Dúvidas", href: "#duvidas" },
  { rotulo: "Contato", href: "#contato" },
];
