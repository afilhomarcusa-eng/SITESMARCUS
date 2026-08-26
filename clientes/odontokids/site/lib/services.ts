export type Service = {
  slug: string;
  number: string;
  title: string;
  short: string;
  kicker: string;
  summary: string;
  image: string;
  imageAlt: string;
  tag: string;
  color: string;
  introTitle: string;
  intro: string;
  benefits: { title: string; text: string }[];
  steps: { label: string; title: string; text: string }[];
  highlights: string[];
};

export const services: Service[] = [
  {
    slug: "odontologia-para-bebes",
    number: "01",
    title: "Odontologia para bebês",
    short: "Primeiros sorrisos",
    kicker: "Cuidado desde os primeiros dias",
    summary: "Orientação e prevenção para os primeiros dentinhos, com apoio à família em cada nova descoberta.",
    image: "/bebe.jpg",
    imageAlt: "Pés de um bebê envoltos em uma manta branca",
    tag: "Desde o nascimento",
    color: "coral",
    introTitle: "Uma base saudável começa antes mesmo do primeiro dente.",
    intro: "As primeiras consultas ajudam a família a entender higiene, amamentação, mamadeira, chupeta e erupção dos dentes. Quanto mais cedo começa o acompanhamento, mais natural se torna a relação da criança com o consultório.",
    benefits: [
      { title: "Primeira consulta", text: "Avaliação preventiva e orientação individual para pais e responsáveis." },
      { title: "Higiene bucal", text: "Técnicas adequadas para cada fase, antes e depois dos primeiros dentes." },
      { title: "Hábitos saudáveis", text: "Apoio sobre alimentação, chupeta, mamadeira e prevenção de cáries." },
    ],
    steps: [
      { label: "0–6 meses", title: "Antes dos dentinhos", text: "Orientações para limpeza da gengiva e desenvolvimento oral." },
      { label: "6–12 meses", title: "Primeiros dentes", text: "Início da escovação e primeira consulta odontológica." },
      { label: "1–3 anos", title: "Dentição de leite", text: "Rotina preventiva, avaliação de hábitos e acompanhamento periódico." },
    ],
    highlights: ["Acompanhamento preventivo", "Orientação sobre amamentação", "Prevenção de cárie precoce"],
  },
  {
    slug: "sedacao-consciente",
    number: "02",
    title: "Sedação consciente",
    short: "Visita mais tranquila",
    kicker: "Conforto durante o cuidado",
    summary: "Técnica com óxido nitroso para reduzir a ansiedade enquanto a criança permanece acordada e acompanhada.",
    image: "/sedacao.jpeg",
    imageAlt: "Criança recebendo sedação consciente durante atendimento odontológico",
    tag: "Conforto e segurança",
    color: "yellow",
    introTitle: "Respirar, relaxar e continuar no controle.",
    intro: "A sedação consciente é indicada após avaliação individual. O óxido nitroso ajuda a diminuir ansiedade e desconforto sem fazer a criança dormir, mantendo comunicação e reflexos durante o atendimento.",
    benefits: [
      { title: "Ação rápida", text: "O relaxamento acontece em poucos minutos e é ajustado durante a consulta." },
      { title: "Criança consciente", text: "Ela continua acordada, respirando normalmente e respondendo à equipe." },
      { title: "Recuperação breve", text: "Ao final, a administração é interrompida e a criança é acompanhada." },
    ],
    steps: [
      { label: "01", title: "Avaliação", text: "Histórico de saúde, ansiedade e necessidade clínica são analisados." },
      { label: "02", title: "Adaptação", text: "A máscara é apresentada de forma lúdica e colocada com calma." },
      { label: "03", title: "Acompanhamento", text: "A equipe monitora a criança durante todo o procedimento." },
    ],
    highlights: ["Indicação individualizada", "Óxido nitroso", "Monitoramento contínuo"],
  },
  {
    slug: "ortodontia-infantil",
    number: "03",
    title: "Ortodontia infantil",
    short: "Sorriso em movimento",
    kicker: "Desenvolvimento acompanhado",
    summary: "Avaliação da mordida e do alinhamento para orientar o crescimento e intervir no momento adequado.",
    image: "/ortodontia.jpg",
    imageAlt: "Jovem colocando alinhador ortodôntico transparente",
    tag: "Crianças e adolescentes",
    color: "blue",
    introTitle: "Crescer também é dar espaço para o sorriso.",
    intro: "A avaliação ortodôntica identifica alterações de mordida, hábitos e desenvolvimento facial. Dependendo da fase, podem ser indicados aparelhos ortopédicos, fixos ou alinhadores.",
    benefits: [
      { title: "Prevenção", text: "Problemas de crescimento podem ser percebidos e acompanhados cedo." },
      { title: "Planejamento", text: "Cada aparelho é escolhido conforme idade, dentição e necessidade." },
      { title: "Família envolvida", text: "Orientação sobre higiene, alimentação e evolução do tratamento." },
    ],
    steps: [
      { label: "4–11 anos", title: "Fase preventiva", text: "Avaliação do desenvolvimento facial e correção de hábitos." },
      { label: "12–17 anos", title: "Fase corretiva", text: "Alinhamento dos dentes permanentes e ajuste da mordida." },
      { label: "Sempre", title: "Acompanhamento", text: "Revisões e orientação para manter conforto e higiene." },
    ],
    highlights: ["Aparelhos ortopédicos", "Aparelhos fixos", "Alinhadores transparentes"],
  },
  {
    slug: "necessidades-especiais",
    number: "04",
    title: "Necessidades especiais",
    short: "Cuidado no seu ritmo",
    kicker: "Cada criança é única",
    summary: "Atendimento adaptado, comunicação cuidadosa e respeito ao tempo e às necessidades de cada criança.",
    image: "/crianca-sorrindo.jpg",
    imageAlt: "Criança brincando com uma câmera em ambiente infantil",
    tag: "Atendimento humanizado",
    color: "purple",
    introTitle: "O cuidado se adapta à criança — nunca o contrário.",
    intro: "A equipe utiliza dessensibilização gradual, recursos visuais e ajustes no ambiente para construir previsibilidade e confiança junto com pais e cuidadores.",
    benefits: [
      { title: "Acolhimento", text: "A abordagem considera preferências, limites e formas de comunicação." },
      { title: "Ambiente adaptado", text: "Luz, sons, pausas e estímulos são ajustados sempre que necessário." },
      { title: "Família parceira", text: "Pais e cuidadores participam das decisões e orientações de rotina." },
    ],
    steps: [
      { label: "01", title: "Conhecer", text: "Entendemos a rotina, os gatilhos e as estratégias que já funcionam." },
      { label: "02", title: "Familiarizar", text: "Aproximação gradual do ambiente e dos instrumentos." },
      { label: "03", title: "Cuidar", text: "Procedimentos no ritmo possível, com pausas e reforço positivo." },
    ],
    highlights: ["Dessensibilização gradual", "Comunicação visual", "Conforto sensorial"],
  },
  {
    slug: "frenectomia",
    number: "05",
    title: "Frenectomia",
    short: "Funções com liberdade",
    kicker: "Procedimento especializado",
    summary: "Avaliação e correção do freio lingual ou labial quando ele interfere em funções importantes.",
    image: "/frenectomia.jpeg",
    imageAlt: "Avaliação do freio lingual de um bebê",
    tag: "Bebês e crianças",
    color: "green",
    introTitle: "Mais liberdade para mamar, falar e sorrir.",
    intro: "A frenectomia é um procedimento simples, indicado após avaliação criteriosa do freio lingual ou labial. Em bebês, pode contribuir para a amamentação; em outras fases, pode apoiar fala, higiene e desenvolvimento oral.",
    benefits: [
      { title: "Avaliação precisa", text: "A indicação considera mobilidade, função e fase do desenvolvimento." },
      { title: "Procedimento breve", text: "Técnica planejada para trazer segurança e conforto ao paciente." },
      { title: "Orientação pós-cuidado", text: "A família recebe instruções claras para o período de recuperação." },
    ],
    steps: [
      { label: "01", title: "Avaliar", text: "Análise clínica do freio e das funções relacionadas." },
      { label: "02", title: "Planejar", text: "Explicação da indicação, técnica e cuidados aos responsáveis." },
      { label: "03", title: "Acompanhar", text: "Revisão do processo de cicatrização e evolução funcional." },
    ],
    highlights: ["Freio lingual", "Freio labial", "Acompanhamento pós-operatório"],
  },
  {
    slug: "tratamento-de-canal",
    number: "06",
    title: "Tratamento de canal",
    short: "Preservar para crescer",
    kicker: "Endodontia infantil",
    summary: "Tratamento para preservar dentes comprometidos por cárie profunda, trauma ou infecção.",
    image: "/tratamentos.jpg",
    imageAlt: "Procedimento odontológico para preservação de um dente",
    tag: "Preservação",
    color: "aqua",
    introTitle: "Dente de leite também merece ser preservado.",
    intro: "Quando a parte interna do dente é afetada, o tratamento controla dor e infecção e ajuda a manter o espaço necessário para o nascimento do dente permanente.",
    benefits: [
      { title: "Alívio", text: "O tratamento remove tecido comprometido e controla a infecção." },
      { title: "Preservação", text: "Mantém o dente em função até o momento natural da troca." },
      { title: "Proteção futura", text: "Ajuda a preservar espaço e desenvolvimento da dentição permanente." },
    ],
    steps: [
      { label: "01", title: "Diagnóstico", text: "Avaliação clínica e exames para entender a extensão do problema." },
      { label: "02", title: "Tratamento", text: "Limpeza, desinfecção e preenchimento do interior do dente." },
      { label: "03", title: "Restauração", text: "Reconstrução e acompanhamento para devolver forma e função." },
    ],
    highlights: ["Cáries profundas", "Traumas dentários", "Preservação do dente"],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
