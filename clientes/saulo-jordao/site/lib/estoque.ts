/**
 * O estoque.
 *
 * Cada carro saiu da legenda do próprio anúncio, minerada em 08/09/2026 do
 * catálogo de saulojordao.com. Campo que a legenda não diz não existe aqui, e o
 * que não existe aqui não aparece no site: a linha some inteira, em vez de o
 * site deduzir câmbio, cor ou quilometragem de carro que está à venda.
 *
 * O Audi RS5 é o caso extremo e continua no ar: o anúncio dele não tem descrição
 * nenhuma, então ele entra com nome, ano, preço e as dez fotos. Nada mais.
 *
 * Duas divergências entre catálogo e legenda foram decididas pelo cliente em
 * 08/09/2026: a X6 2023 vale R$ 695.000, que é o preço do catálogo, e o Jeep
 * Commander é BlackHawk, que é o nome da legenda e do endereço do anúncio.
 *
 * Para editar: mexa no objeto do carro. Preço em número inteiro de reais,
 * quilometragem em número inteiro de quilômetros, `fotos` é quantos arquivos
 * existem em public/images para aquele slug.
 */

export type Carro = {
  slug: string;
  marca: string;
  /** Nome curto, o que aparece no cartão da grade. */
  modelo: string;
  /** Nome inteiro, o que aparece no topo da ficha. */
  nome: string;
  ano: number;
  /** Quando a legenda traz ano de fabricação e modelo, como "2026/2026". */
  anoTexto?: string;
  preco: number;
  km?: number;
  potencia?: number;
  motor?: string;
  cambio?: string;
  tracao?: string;
  cor?: string;
  interior?: string;
  /** O que já está resolvido: dono, IPVA, garantia, revisões, proteção. */
  conferido: string[];
  /** Opcionais e equipamentos, na ordem em que a legenda lista. */
  itens: string[];
  /** Um fato concreto que muda o valor do carro. Aparece no cartão e na ficha. */
  nota?: string;
  /** Quantas fotos existem para este carro. */
  fotos: number;
};

export const CARROS: Carro[] = [
  {
    slug: "corvette-stingray",
    marca: "Chevrolet",
    modelo: "Corvette Stingray 1LT Conversível",
    nome: "Chevrolet Corvette Stingray 1LT Conversível 6.2 V8 495cv",
    ano: 2026,
    preco: 1290000,
    km: 2000,
    potencia: 495,
    motor: "6.2 V8 traseiro central",
    cambio: "Automático de 8 marchas, dupla embreagem",
    tracao: "Traseira",
    conferido: ["IPVA 2026 quitado", "PPF frontal"],
    itens: [
      "Capota conversível",
      "Cinco modos de condução",
      "Diferencial eletrônico limited-slip",
      "Head-up display",
      "Painel de instrumentos digital de 12\"",
      "Faróis full LED adaptativos",
      "Volante em couro com aquecimento",
      "Alerta de ponto cego e de tráfego cruzado",
      "Carregamento do telefone por indução",
      "Chevrolet Infotainment 3 System",
      "Som BOSE com 10 alto-falantes",
      "Performance Data Recorder",
      "Rodas Vossen e pneus Michelin",
      "Skap Vulcano Performance",
    ],
    fotos: 12,
  },
  {
    slug: "bmw-x6-2025",
    marca: "BMW",
    modelo: "X6 M Competition",
    nome: "BMW X6 M Competition 4.4 V8 Biturbo 625cv",
    ano: 2025,
    preco: 1150000,
    km: 8000,
    potencia: 625,
    motor: "4.4 V8 biturbo",
    cambio: "M Steptronic Sport Drivelogic de 8 marchas",
    tracao: "M xDrive integral com diferencial Active M",
    cor: "Cinza Brooklyn",
    interior: "Silverstone",
    conferido: [
      "Único dono",
      "IPVA 2026 quitado",
      "Garantia até 31 de outubro de 2027",
      "Todas as revisões em concessionária BMW",
    ],
    itens: [
      "Faróis BMW Laser",
      "Teto panorâmico",
      "Rodas 21\" na frente e 22\" atrás",
      "Piloto automático adaptativo",
      "Seletor de modos de condução",
      "Parking Assistant Professional",
      "Chave digital com touchscreen",
      "Porta-malas com acionamento elétrico",
      "Bancos dianteiros com memória",
      "Seletor de abertura de difusor",
      "Frenagem de emergência",
      "Aviso de ponto cego",
      "Painel digital",
      "AutoHold",
    ],
    fotos: 15,
  },
  {
    slug: "porsche-911",
    marca: "Porsche",
    modelo: "911 Carrera S Coupé",
    nome: "Porsche 911 Carrera S Coupé 3.0 450cv",
    ano: 2024,
    preco: 949000,
    km: 2600,
    potencia: 450,
    motor: "3.0 boxer",
    cor: "Guards Red",
    interior: "Race-Tex no volante e alcântara no apoio de braço",
    conferido: [
      "Único dono",
      "PPF full",
      "Garantia até maio de 2026",
      "Todas as revisões na concessionária",
    ],
    itens: [
      "Pacote Sport Chrono",
      "Rodas RS Spyder aro 20 e 21\" Dark Silver",
      "Pinças de freio vermelhas",
      "Discos de freio ventilados",
      "Aerofólio com ativação eletrônica",
      "Teto solar translúcido",
      "Cronômetro na cor Guards Red",
      "Logotipo Porsche nos encostos de cabeça",
    ],
    fotos: 14,
  },
  {
    slug: "bmw-x6-2023",
    marca: "BMW",
    modelo: "X6 M Competition",
    nome: "BMW X6 M Competition 4.4 V8 Biturbo 625cv",
    ano: 2023,
    preco: 695000,
    km: 28000,
    potencia: 625,
    motor: "4.4 V8 biturbo",
    cambio: "M Steptronic Sport Drivelogic de 8 marchas",
    tracao: "M xDrive integral com diferencial Active M",
    conferido: ["IPVA 2026 quitado", "Todas as revisões em concessionária BMW"],
    itens: [
      "Faróis BMW Laser",
      "Teto panorâmico",
      "Rodas 21\" na frente e 22\" atrás",
      "Piloto automático adaptativo",
      "Seletor de modos de condução",
      "Parking Assistant Professional",
      "Chave digital com touchscreen",
      "Porta-malas com acionamento elétrico",
      "Bancos dianteiros com memória",
      "Frenagem de emergência",
      "Aviso de ponto cego",
      "Painel digital",
      "AutoHold",
    ],
    fotos: 12,
  },
  {
    slug: "bmw-m2",
    marca: "BMW",
    modelo: "M2 Coupé",
    nome: "BMW M2 3.0 Biturbo 6 cilindros Coupé (G87)",
    ano: 2025,
    preco: 590000,
    km: 10132,
    potencia: 480,
    motor: "3.0 biturbo de 6 cilindros, 61,2 kgfm",
    tracao: "Traseira",
    conferido: ["Full PPF", "Garantia de fábrica", "IPVA 2026 quitado"],
    itens: [
      "Suspensão adaptativa M",
      "Diferencial M Sport",
      "Direção M Servotronic de relação variável",
      "Escapamento esportivo com válvula",
      "Rodas 19\" na frente e 20\" atrás",
      "BMW Curved Display",
      "Painel de instrumentos digital de 14,9\"",
      "Head-up display colorido",
      "M Lap Timer e M Drift Analyser",
      "Modos M Road, Track e Sport",
      "Som Harman Kardon",
      "Ar-condicionado trizone e 8 airbags",
      "Parking Assistant com câmera de ré",
      "Carregador por indução",
      "Luzes M Shadow Line",
    ],
    fotos: 12,
  },
  {
    slug: "porsche-718",
    marca: "Porsche",
    modelo: "718 Boxster",
    nome: "Porsche 718 Boxster 2.0 Turbo 300cv",
    ano: 2024,
    preco: 580000,
    potencia: 300,
    motor: "2.0 turbo boxer",
    cor: "Cinza Crayon",
    interior: "Preto e Crayon",
    conferido: ["PPF full"],
    nota: "Valor de nota fiscal de R$ 728.842, com R$ 173 mil em opcionais de fábrica.",
    itens: [
      "Banco de 18 vias (R$ 20.903)",
      "Pacote Sport Chrono (R$ 15.091)",
      "Rodas 911 Turbo aro 20\" (R$ 21.468)",
      "Pacote SportDesign em preto (R$ 20.095)",
      "Cor Cinza Crayon (R$ 15.900)",
      "Interior em preto e Crayon (R$ 16.746)",
      "PPF full (R$ 20.000)",
      "Faróis em LED com PDLS (R$ 10.331)",
      "Controle de cruzeiro adaptativo (R$ 8.313)",
      "Park Assist com câmera de ré (R$ 4.438)",
      "Porsche Entry & Drive (R$ 4.763)",
      "Assistente de mudança de faixa (R$ 3.965)",
      "Ponteiras de escape esportivas pretas (R$ 3.600)",
      "Barras anti-capotamento em preto (R$ 3.400)",
      "Aquecimento dos bancos (R$ 2.824)",
      "Chave na cor do carro com chaveiro (R$ 2.502)",
      "Cintos em Vermelho Guards (R$ 1.857)",
      "Adesivos 718 nas portas em preto (R$ 1.614)",
      "Escudo Porsche gravado nos bancos (R$ 1.500)",
      "Lanterna traseira escurecida (R$ 4.157)",
      "Escudo Porsche colorido nas rodas (R$ 1.000)",
      "Tanque de combustível de 64 litros (R$ 809)",
      "Parafusos de roda anti-roubo (R$ 405)",
      "Capota conversível em preto",
    ],
    fotos: 13,
  },
  {
    slug: "mustang-dark-horse",
    marca: "Ford",
    modelo: "Mustang Dark Horse",
    nome: "Ford Mustang Dark Horse 5.0 V8 507cv",
    ano: 2025,
    preco: 579900,
    km: 900,
    potencia: 507,
    motor: "5.0 V8",
    cambio: "Automático de 10 marchas",
    conferido: ["Único dono", "IPVA e licenciamento 2026 quitados"],
    itens: [
      "Drift Brake",
      "Launch Control",
      "Line Lock, pré-aquecimento de pneus",
      "Freios Brembo",
      "Suspensão adaptativa MagneRide",
      "Escape com quatro saídas e válvula ativa",
      "Diferencial Torsen",
      "Modo de condução Pista e Track Apps",
      "Som Bang & Olufsen",
      "Multimídia touch de 13,4\"",
      "Bancos com aquecimento e refrigeração",
      "Volante em couro com aquecimento",
      "Piloto automático adaptativo",
      "Detecção de buracos, Pothole Mitigation",
      "Aviso de ponto cego BLIS",
      "Rodas 19\"",
      "Partida remota",
    ],
    fotos: 7,
  },
  {
    slug: "mercedes-glc300",
    marca: "Mercedes-Benz",
    modelo: "GLC 300 AMG Coupé 4Matic",
    nome: "Mercedes-Benz GLC 300 AMG Coupé 4Matic",
    ano: 2025,
    preco: 475900,
    km: 7300,
    potencia: 258,
    motor: "2.0 turbo, 40,8 kgfm, 281cv de potência combinada",
    cambio: "9G-Tronic com paddle shifts",
    tracao: "Integral 4Matic",
    cor: "Prata High Tech",
    interior: "Cinza Neva",
    conferido: ["Único dono", "IPVA 2026 quitado"],
    itens: [
      "Teto solar",
      "Cockpit digital com tela de 12,3\"",
      "Som premium Burmester 3D",
      "Iluminação ambiente com 64 cores",
      "Volante multifuncional touch com ajuste elétrico",
      "Sensor de impressão digital",
      "Câmera 360° e Park Assist",
      "Frenagem de emergência",
      "Piloto automático com aviso de colisão",
      "Seletor de modos de condução",
      "Rodas AMG aro 20\"",
      "0 a 100 km/h em 6,3 s, máxima de 246 km/h",
    ],
    fotos: 13,
  },
  {
    slug: "audi-rs5",
    marca: "Audi",
    modelo: "RS5 2.9 V6 Biturbo",
    nome: "Audi RS5 2.9 V6 Biturbo 450cv",
    ano: 2021,
    preco: 420000,
    potencia: 450,
    motor: "2.9 V6 biturbo",
    conferido: [],
    itens: [],
    fotos: 10,
  },
  {
    slug: "bmw-x4",
    marca: "BMW",
    modelo: "X4 xDrive30i M Sport",
    nome: "BMW X4 xDrive30i M Sport 2.0 Turbo 252cv",
    ano: 2025,
    preco: 370000,
    km: 54000,
    potencia: 252,
    motor: "2.0 turbo",
    cambio: "ZF de 8 marchas",
    tracao: "Integral",
    cor: "Preto Safira",
    interior: "Marrom",
    conferido: [
      "Garantia de fábrica",
      "IPVA 2026 quitado",
      "Todas as revisões na BMW",
    ],
    itens: [
      "Teto panorâmico",
      "Live Cockpit Professional",
      "Som premium Harman Kardon",
      "Piloto automático adaptativo",
      "Direção Servotronic de relação variável",
      "Assistente de manutenção em faixa",
      "Parking Assistant Plus",
      "Faróis e lanternas em full LED",
      "Seletor de modos de condução",
      "0 a 100 km/h em 6,4 s",
      "Pneu estepe",
    ],
    fotos: 10,
  },
  {
    slug: "bmw-x1",
    marca: "BMW",
    modelo: "X1 M Sport",
    nome: "BMW X1 M Sport 2.0 Turbo 204cv",
    ano: 2026,
    anoTexto: "2026/2026",
    preco: 360000,
    km: 3200,
    potencia: 204,
    motor: "2.0 turbo",
    cambio: "Dupla embreagem",
    cor: "Branco Alpino",
    interior: "Couro Vernasca Mocha",
    conferido: [
      "Único dono",
      "Faturada há dois meses",
      "Garantia de fábrica",
      "IPVA 2026 quitado, R$ 11 mil já pagos em Sergipe",
      "PPF frontal, quinas das portas, maçanetas e multimídia",
      "Plano de revisões BMW até 40 mil km",
    ],
    itens: [
      "Teto solar com cortina elétrica",
      "Câmera 360° e Parking Assistant com câmera de ré",
      "Head-up display e iDrive com chip 4G",
      "Multimídia touch de 10,7\" com GPS",
      "Som Harman Kardon",
      "Bancos elétricos com memória",
      "Ar-condicionado trizone e 8 airbags",
      "Alerta de mudança de faixa e de pré-colisão",
      "Detectores de ponto cego",
      "Faróis full LED e lanternas tridimensionais",
      "Rodas 20\" e pneus Star Marking run-flat",
      "Freio de mão eletrônico com Auto Hold",
      "Carregamento do celular por indução",
      "Assistente por comandos de voz",
      "Quatro modos de condução e start/stop",
    ],
    fotos: 13,
  },
  {
    slug: "jeep-commander",
    marca: "Jeep",
    modelo: "Commander BlackHawk",
    nome: "Jeep Commander BlackHawk 272cv 4x4",
    ano: 2025,
    preco: 225000,
    km: 2230,
    potencia: 272,
    tracao: "4x4",
    interior: "Couro marrom com painel em alcântara",
    conferido: ["Garantia de fábrica", "IPVA e licenciamento 2026 quitados"],
    itens: [
      "Teto panorâmico",
      "Som premium Harman Kardon",
      "Controle de cruzeiro adaptativo",
      "Assistente de manutenção em faixa",
      "Frenagem de emergência",
      "Aviso de ponto cego e de tráfego cruzado",
      "Chave presencial",
      "Direção elétrica",
      "Paddle shifts",
      "Start/stop",
    ],
    fotos: 4,
  },
  {
    slug: "bronco-badlands",
    marca: "Ford",
    modelo: "Bronco Badlands",
    nome: "Ford Bronco Badlands 2.0 EcoBoost 253cv",
    ano: 2025,
    preco: 199900,
    km: 17800,
    potencia: 253,
    motor: "2.0 EcoBoost",
    tracao: "4x4",
    cor: "Cinza Torres",
    conferido: [
      "Único dono",
      "IPVA 2026 quitado",
      "Garantia de fábrica até julho de 2030",
      "Revisões na concessionária",
    ],
    itens: [
      "Sete modos de terreno, G.O.A.T. Modes",
      "Vetorização de torque",
      "Câmera 360° e Park Assist",
      "Som premium Bang & Olufsen com 10 alto-falantes e subwoofer",
      "Piloto automático",
      "Nove airbags",
    ],
    fotos: 10,
  },
];

/** O carro do herói. É o de maior resolução de foto e o de maior valor. */
export const DESTAQUE = "corvette-stingray";

export function carroPorSlug(slug: string): Carro | undefined {
  return CARROS.find((c) => c.slug === slug);
}

/**
 * Números da home.
 *
 * Todos calculados a partir da lista acima, nunca escritos à mão. Trocar um
 * carro recalcula a seção inteira, e por isso nenhum deles pode envelhecer para
 * mentira.
 */
export const NUMEROS = {
  carros: CARROS.length,
  marcas: new Set(CARROS.map((c) => c.marca)).size,
  menorPreco: Math.min(...CARROS.map((c) => c.preco)),
  maiorPreco: Math.max(...CARROS.map((c) => c.preco)),
  somaPrecos: CARROS.reduce((a, c) => a + c.preco, 0),
  fotos: CARROS.reduce((a, c) => a + c.fotos, 0),
};

export const MARCAS = [...new Set(CARROS.map((c) => c.marca))].sort((a, b) =>
  a.localeCompare(b, "pt-BR"),
);

/**
 * Os seis que aparecem na home.
 *
 * Escolhidos para cobrir a faixa inteira de preço, do mais caro ao mais
 * acessível, e não os seis primeiros da lista. O carro do herói fica de fora de
 * propósito: ele já está na página, e a mesma foto não aparece duas vezes.
 */
export const NA_HOME = [
  "bmw-x6-2025",
  "porsche-911",
  "bmw-m2",
  "mustang-dark-horse",
  "mercedes-glc300",
  "bronco-badlands",
];

export const CARROS_DA_HOME = NA_HOME.map((slug) => {
  const carro = carroPorSlug(slug);
  if (!carro) throw new Error(`NA_HOME aponta para um carro que não existe: ${slug}`);
  if (slug === DESTAQUE) throw new Error("O carro do herói não pode repetir na home.");
  return carro;
});
