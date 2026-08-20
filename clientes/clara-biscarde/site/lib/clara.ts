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

  // CRP 03 é o conselho da Bahia, mas a cidade não foi confirmada. Não chutar.
  cidade: null as string | null,
  estado: null as string | null,

  whatsapp: null as string | null, // "5571999999999"
  telefone: null as string | null,
  email: null as string | null,
  instagram: null as string | null, // só o usuário, sem @
  endereco: null as string | null,
  horario: null as string | null,

  /**
   * Retrato do hero. O arquivo precisa existir em /public com esse nome.
   * Enquanto não existir, o hero renderiza o painel de reserva.
   */
  retrato: "/clara.jpg" as string | null,
  retratoLargura: 1280,
  retratoAltura: 1280,
} as const;

const MENSAGEM =
  "Oi Clara, vim pelo site e queria saber sobre atendimento pro meu filho";

export const links = {
  /** wa.me abre o app no celular e o WhatsApp Web no computador. */
  whatsapp: clara.whatsapp
    ? `https://wa.me/${clara.whatsapp}?text=${encodeURIComponent(MENSAGEM)}`
    : null,

  /** Força o WhatsApp Web, para quem está no computador sem o app. */
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
  if (so.length === 11) return `(${so.slice(0, 2)}) ${so.slice(2, 7)}-${so.slice(7)}`;
  if (so.length === 10) return `(${so.slice(0, 2)}) ${so.slice(2, 6)}-${so.slice(6)}`;
  return numero;
}

/** Destino de todo botão de agendar. Sem canal, o botão não existe. */
export const agendar = links.whatsapp ?? links.instagram ?? null;

/**
 * Queixas que ela atende. Vazio de propósito.
 * Afirmar escopo clínico sem confirmação dela é inventar dado.
 * Preencher com a resposta da pergunta 2 do Bloco 7 e a seção Áreas aparece.
 */
export const areas: { titulo: string; texto: string }[] = [];

/**
 * Faixa etária, abordagem, duração e frequência da sessão.
 * Todos dependem de resposta dela. Enquanto forem null, a seção Atendimento
 * não renderiza.
 */
export const atendimento = {
  idadeMinima: null as number | null,
  idadeMaxima: null as number | null,
  abordagem: null as string | null,
  duracaoMinutos: null as number | null,
  frequencia: null as string | null,
  online: null as boolean | null,
  presencial: null as boolean | null,
} as const;

/**
 * Objeções. Só entra no site o par que tem resposta.
 * As respostas marcadas como null envolvem conduta clínica ou sigilo de menor
 * e são obrigação ética dela. O agente não escreve por ela.
 */
export const objecoes: { pergunta: string; resposta: string | null }[] = [
  {
    pergunta: "Meu filho vai achar que tem alguma coisa errada com ele.",
    resposta:
      "Criança não entende terapia como castigo quando o assunto é apresentado sem mistério. Vale dizer que é um lugar de conversar e brincar, com alguém que ajuda quando as coisas ficam difíceis de explicar.",
  },
  {
    pergunta: "Ele não fala nem comigo. Não vai falar com uma estranha.",
    resposta:
      "Quase nenhuma criança chega falando, e o consultório não depende disso para funcionar. A diferença é que ali ninguém cobra resposta nem tem pressa.",
  },
  {
    pergunta: "Isso é fase ou é caso pra psicóloga?",
    resposta:
      "Uma conversa inicial serve exatamente pra isso. Se for fase, você sai sabendo o que observar. Se não for, você já saiu do lugar de dúvida.",
  },
  // Pendentes. Só a Clara responde.
  { pergunta: "Eu preciso ficar na sala junto?", resposta: null },
  { pergunta: "Com que idade dá pra começar?", resposta: null },
  {
    pergunta: "Eu vou ficar sabendo o que ele falou na sessão?",
    resposta: null,
  },
];

/**
 * Conteúdo de apoio para o pai ou a mãe.
 *
 * Nada aqui afirma protocolo, técnica ou escopo da Clara. São orientações
 * gerais dirigidas a quem cuida, sem valor diagnóstico. Mesmo assim ela deve
 * ler antes de publicar, porque sai no site com o nome dela.
 */

export const quandoProcurarCrianca = [
  {
    titulo: "Voltou a fazer xixi na cama",
    texto:
      "Voltar a um jeito de funcionar já abandonado costuma aparecer quando alguma coisa saiu do lugar. Não é manha, e brigar costuma piorar.",
  },
  {
    titulo: "Toda manhã de aula dói alguma coisa",
    texto:
      "Dor que aparece antes da escola e some no sábado diz alguma coisa. A dor é real, o gatilho é que não é físico.",
  },
  {
    titulo: "As birras não diminuíram com a idade",
    texto:
      "O esperado é que a crise vá perdendo força com o tempo. Quando a intensidade fica igual ou aumenta, vale olhar.",
  },
  {
    titulo: "A noite virou uma batalha",
    texto:
      "Sono é dos primeiros lugares onde a angústia infantil aparece. Vale para pesadelo que repete, medo do escuro e recusa de dormir sozinho.",
  },
];

export const quandoProcurarAdolescente = [
  {
    titulo: "Não sai mais do quarto",
    texto:
      "Recolher um pouco é esperado. Parar de ver os amigos e largar o que gostava de fazer, por semanas, é outra coisa.",
  },
  {
    titulo: "As notas caíram de repente",
    texto:
      "Queda sem mudança de escola ou de professor costuma ter causa fora da sala. Concentração é das primeiras coisas que o sofrimento leva.",
  },
  {
    titulo: "Se irrita com tudo e a casa anda pisando em ovos",
    texto:
      "Irritação constante é sintoma tanto quanto tristeza, e bem mais fácil de confundir com falta de educação.",
  },
  {
    titulo: "Vi marcas no corpo ou ouvi falar em morrer",
    alerta: true,
    texto:
      "Aqui não vale esperar a agenda abrir. Procure atendimento imediatamente. O CVV atende de graça, 24 horas, no 188. Em risco imediato, o SAMU é o 192. Falar sobre o assunto não aumenta o risco.",
  },
];

/** Mantido por compatibilidade com a versão anterior da seção. */
export const quandoProcurar = [
  {
    faixa: "Criança",
    titulo: "Voltou a fazer xixi na cama depois de anos sem fazer",
    texto:
      "Voltar a um jeito de funcionar que já tinha sido abandonado costuma aparecer quando alguma coisa saiu do lugar. Vale para o xixi, para o dedo na boca, para falar como bebê e para querer dormir na cama dos pais de novo. Não é manha nem preguiça, e brigar costuma piorar.",
  },
  {
    faixa: "Criança",
    titulo: "Toda manhã de aula dói alguma coisa",
    texto:
      "Dor de barriga e dor de cabeça que aparecem antes da escola e somem no sábado dizem alguma coisa. O corpo da criança costuma falar antes da boca, e ela não está inventando a dor. A dor é real, o gatilho é que não é físico.",
  },
  {
    faixa: "Criança",
    titulo: "As birras não diminuíram com a idade",
    texto:
      "Crise faz parte do desenvolvimento e o esperado é que vá perdendo força com o tempo. Quando a intensidade fica igual ou aumenta, e quando a crise passa a acontecer fora de casa também, vale olhar com atenção.",
  },
  {
    faixa: "Criança",
    titulo: "A noite virou uma batalha",
    texto:
      "Não conseguir dormir sozinho, pesadelo que repete o mesmo enredo, medo de apagar a luz, acordar toda madrugada. Sono é dos primeiros lugares onde a angústia infantil aparece.",
  },
  {
    faixa: "Criança",
    titulo: "A professora falou que ele fica sozinho no recreio",
    texto:
      "Entrar num grupo é uma habilidade, e algumas crianças precisam de ajuda para aprender. Quando a queixa vem da escola e você também percebe em festa e em casa de parente, os dois lugares estão apontando para o mesmo ponto.",
  },
  {
    faixa: "Adolescente",
    titulo: "Ela não sai mais do quarto",
    texto:
      "Adolescente se recolher um pouco é esperado. Parar de ver os amigos, largar o que gostava de fazer e passar o dia inteiro de porta fechada é outra coisa, principalmente quando dura semanas.",
  },
  {
    faixa: "Adolescente",
    titulo: "As notas caíram de um semestre para o outro",
    texto:
      "Queda de rendimento sem mudança de escola, de professor ou de matéria costuma ter causa fora da sala de aula. Concentração é das primeiras coisas que a ansiedade e o sofrimento levam embora.",
  },
  {
    faixa: "Adolescente",
    titulo: "Ele se irrita com tudo e eu ando pisando em ovos",
    texto:
      "Irritação constante em adolescente é sintoma tanto quanto tristeza, e é bem mais fácil de confundir com falta de educação. Quando a casa inteira começa a se organizar para não provocar crise, o problema já não é só dele.",
  },
  {
    faixa: "Procure ajuda agora",
    titulo: "Vi marcas no corpo dela ou ele falou em morrer",
    texto:
      "Essa é a única situação desta lista em que não vale esperar a agenda abrir. Procure atendimento imediatamente. O CVV atende de graça, 24 horas, no telefone 188 e no site cvv.org.br. Em caso de risco imediato, o SAMU é o 192. Falar sobre o assunto com seu filho não aumenta o risco, e o silêncio não protege ninguém.",
  },
  {
    faixa: "Quem cuida",
    titulo: "Você está no limite",
    texto:
      "O cansaço de quem cuida também é motivo. Não precisa esperar a criança piorar para procurar ajuda, e chegar antes costuma encurtar o caminho.",
  },
];

/**
 * A jornada do pai ou da mãe, do momento de contar até a terapia virar rotina.
 *
 * Castelo e bandeira marcam conquista, dragão marca o momento difícil, ponte
 * marca travessia, bússola marca preparo. Tudo aqui é orientação geral para
 * quem cuida, sem valor diagnóstico e sem descrever protocolo da Clara.
 */
export const jornada = [
  {
    desenho: "bussola" as const,
    tipo: "Preparo",
    rotulo: "Antes de abrir o assunto",
    titulo: "O tom pesa mais do que a frase",
    texto:
      "Criança presta menos atenção nas palavras e mais no tom. Tenso demais soa grave. Leve demais soa enrolação.",
    dicas: [
      "Escolha um momento neutro: no carro, numa caminhada.",
      "Nunca logo depois de uma briga.",
      "Se forem dois cuidadores, combinem antes o que vão dizer.",
    ],
  },
  {
    desenho: "castelo" as const,
    tipo: "Parada",
    rotulo: "A conversa",
    titulo: "O objetivo não é convencer, é informar",
    texto:
      "Frase simples deixa menos espaço para ele imaginar que tem algo errado. Explicação longa demais soa como justificativa.",
    dicas: [
      "Diga o que é: um lugar de conversar e brincar com quem ajuda.",
      "Evite “você vai adorar”. Ele pode não adorar.",
      "Se vier “eu sou doido?”, responda que não — gente saudável também vai.",
    ],
  },
  {
    desenho: "dragao" as const,
    tipo: "Desafio",
    rotulo: "O “eu não quero ir”",
    titulo: "Recusar não quer dizer que não está funcionando",
    texto:
      "Quase toda criança trava em algum momento — geralmente quando o assunto ficou próximo demais. A recusa é informação, não fracasso.",
    dicas: [
      "Não negocie com prêmio: sorvete depois vira obrigação paga.",
      "Não ameace tirar a terapia como castigo.",
      "Leve a recusa para a psicóloga. É material de trabalho.",
    ],
  },
  {
    desenho: "ponte" as const,
    tipo: "Travessia",
    rotulo: "A primeira sessão",
    titulo: "Sair igual a como entrou também é normal",
    texto:
      "Vínculo não se forma em uma hora. Sair sem comentar nada não diz nada sobre como foi. As primeiras semanas servem pra ela descobrir que o lugar é seguro.",
    dicas: [
      "Chegue com minutos de folga — correndo já começa tenso.",
      "Não ensaie no caminho o que ele deve falar.",
      "Se ele quiser levar um brinquedo, deixe.",
    ],
  },
  {
    desenho: "dragao" as const,
    tipo: "Desafio",
    rotulo: "O silêncio depois",
    titulo: "A parte mais desconfortável para quem cuida",
    texto:
      "Você não vai saber em detalhe o que acontece lá dentro. O sigilo protege a confiança dela no espaço — não deixa você de fora, só muda a porta.",
    dicas: [
      "Evite perguntar “o que fizeram hoje?” toda semana.",
      "Prefira “como você está?” e aceite “bem” como resposta.",
      "Quando precisar de resposta, procure a psicóloga.",
    ],
  },
  {
    desenho: "bandeira" as const,
    tipo: "Chegada",
    rotulo: "Quando vira rotina",
    titulo: "Deixa de ser assunto e começa a render",
    texto:
      "Depois de algumas semanas a terapia vira parte da semana, como aula de natação. É aí que costuma começar a render de verdade.",
    dicas: [
      "Mantenha a frequência mesmo quando parece que está tudo bem.",
      "Avise sobre mudanças grandes em casa: mudança, separação, luto.",
      "Falta frequente trava o vínculo mais do que parece.",
    ],
  },
];

/** Menu do cabeçalho. Só entra âncora de seção que existe de fato. */
export const menu = [
  { rotulo: "Sobre mim", href: "#sobre" },
  ...(areas.length ? [{ rotulo: "Áreas", href: "#areas" }] : []),
  { rotulo: "Atendimento", href: "#atendimento" },
  { rotulo: "Para os pais", href: "#pais" },
  { rotulo: "Contato", href: "#contato" },
];
