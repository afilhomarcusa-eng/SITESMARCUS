/**
 * Estoque.
 *
 * Cinco carros, todos com ficha e preço saídos das legendas do próprio
 * Instagram (@deluxmotorsba), entre 26 e 31 de agosto de 2026. Nada aqui foi
 * arredondado, completado ou deduzido.
 *
 * Onde a legenda não diz, o campo fica vazio e o site simplesmente não mostra
 * a linha. É o caso do combustível e da tração de alguns: dá para adivinhar
 * pelo modelo, mas adivinhar a ficha de um carro que está à venda é o tipo de
 * detalhe que vira discussão na hora de fechar. O cliente confirma e a gente
 * preenche.
 *
 * A partir daqui quem manda no estoque é a gerência, em /admin. Para trocar a
 * persistência por um banco, mexa só em lib/estoque.ts.
 */

export type Carro = {
  slug: string;
  marca: string;
  modelo: string;
  versao: string;
  motor: string;
  potencia: number;
  combustivel: string;
  cambio: string;
  tracao: string;
  ano: string;
  km: number;
  preco: number;
  destaques: string[];
  /**
   * Coisa que o comprador precisa saber antes de se apaixonar. Aparece em
   * destaque na ficha e no cartão, nunca escondida no meio da lista.
   */
  alertas?: string[];
  /** Nome base do arquivo em public/images, sem índice, tamanho nem extensão. */
  foto: string;
  /** Quantas fotos existem deste carro, de 0 até fotos-1. */
  fotos: number;
  /** Dimensão nativa da origem. O QA compara o desenho contra isto. */
  nativa: { w: number; h: number };
  origem: string;
};

export const CARROS_INICIAIS: Carro[] = [
  {
    slug: "ram-laramie-1500-classic-2022",
    marca: "RAM",
    modelo: "Laramie 1500",
    versao: "Classic",
    motor: "5.7 V8 HEMI",
    potencia: 400,
    combustivel: "",
    cambio: "Automático ZF de 8 velocidades",
    tracao: "4x4",
    ano: "2022",
    km: 48793,
    preco: 209900,
    alertas: ["Passagem por leilão"],
    destaques: [
      "Escapamento esportivo",
      "Bancos em couro",
      "Central multimídia",
      "Navegador GPS",
      "Câmera de ré",
      "Volante multifuncional",
      "Computador de bordo",
      "Vidros e retrovisores elétricos",
    ],
    foto: "ram-laramie",
    fotos: 5,
    nativa: { w: 1288, h: 1610 },
    origem: "https://www.instagram.com/p/Dcg8uIhmLnE/",
  },
  {
    slug: "bmw-x4-xdrive-28i-2017",
    marca: "BMW",
    modelo: "X4",
    versao: "xDrive 28i",
    motor: "2.0 16V Twin Turbo",
    potencia: 240,
    combustivel: "",
    cambio: "Automático ZF de 8 velocidades",
    tracao: "Integral xDrive",
    ano: "2017",
    km: 105000,
    preco: 139900,
    destaques: [
      "Teto solar panorâmico",
      "Interior marrom",
      "Sistema de som Hi-Fi",
      "Ar-condicionado automático e digital",
      "Bancos em couro",
      "Central multimídia",
      "Navegador GPS",
      "Câmera de ré",
    ],
    foto: "bmw-x4",
    fotos: 5,
    nativa: { w: 1288, h: 1606 },
    origem: "https://www.instagram.com/p/DcgUuPSDi-t/",
  },
  {
    slug: "toyota-corolla-altis-hybrid-2023",
    marca: "Toyota",
    modelo: "Corolla Altis",
    versao: "Hybrid Premium Pack",
    motor: "1.8 16V Dual VVT-i",
    potencia: 122,
    combustivel: "Híbrido",
    cambio: "Automático",
    tracao: "",
    ano: "2023",
    km: 101538,
    preco: 139900,
    destaques: [
      "Todas as revisões feitas em concessionária",
      "Garantia de fábrica",
      "Manual e chave reserva",
      "Interior bicolor",
      "Bancos em couro",
      "Central multimídia",
      "Navegador GPS",
      "Câmera de ré",
    ],
    foto: "corolla-altis",
    fotos: 5,
    nativa: { w: 1288, h: 1610 },
    origem: "https://www.instagram.com/p/DchE_NNmB0C/",
  },
  {
    slug: "lexus-nx-300-f-sport-2018",
    marca: "Lexus",
    modelo: "NX 300",
    versao: "F Sport",
    motor: "2.0 16V DVVT-i Turbo",
    potencia: 238,
    combustivel: "",
    cambio: "Automático de 6 velocidades",
    tracao: "AWD",
    ano: "2018",
    km: 123486,
    preco: 129900,
    destaques: [
      "Teto panorâmico",
      "Interior Circuit Red",
      "Modos de condução",
      "Ar-condicionado dual zone",
      "Bancos em couro",
      "Central multimídia",
      "Navegador GPS",
      "Câmera de ré",
    ],
    foto: "lexus-nx300",
    fotos: 4,
    nativa: { w: 1288, h: 1708 },
    origem: "https://www.instagram.com/p/DctoFYmkYGS/",
  },
  {
    slug: "honda-city-exl-cvt-2016",
    marca: "Honda",
    modelo: "City",
    versao: "EXL CVT",
    motor: "1.5 16V VTEC",
    potencia: 116,
    combustivel: "",
    cambio: "Automático CVT",
    tracao: "",
    ano: "2016",
    km: 102340,
    preco: 66900,
    destaques: [
      "Bancos em couro",
      "Central multimídia",
      "Navegador GPS",
      "Câmera de ré",
      "Volante multifuncional",
      "Vidros e retrovisores elétricos",
    ],
    foto: "honda-city",
    fotos: 5,
    nativa: { w: 1288, h: 1606 },
    origem: "https://www.instagram.com/p/DcjAdZ5jhrG/",
  },
];
