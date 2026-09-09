/**
 * O estoque, e as contas que saem dele.
 *
 * Nenhum número deste site é escrito à mão. A quantidade de carros, a de
 * marcas, a faixa de preço e a soma dos anúncios saem todos daqui, calculados
 * sobre a lista que veio do banco. Quando o Saulo tira um carro em /admin, o
 * texto da home muda junto, e nunca dá para o site dizer "13 carros" quando são
 * doze.
 */

import manifesto from "@/public/images/manifest.json";
import { SEMENTE, type CarroSemente } from "./semente";
import { FOTOS_POR_CARRO, LARGURA_GRANDE, LARGURAS_FOTO, type Carro, type Foto, type Numeros } from "./tipos";

const IMAGENS: Record<string, { nativa: { w: number; h: number } }> = manifesto.imagens;

/**
 * Monta a foto de um carro da semente a partir dos arquivos que o pipeline
 * gerou. A dimensão nativa vem do manifesto, que é o único lugar que sabe o
 * tamanho do arquivo de origem.
 */
function fotoLocal(slug: string, indice: number): Foto | null {
  const larguras = indice === 0 ? [...LARGURAS_FOTO, LARGURA_GRANDE] : [...LARGURAS_FOTO];
  const fontes = [];
  let nativa = { w: 0, h: 0 };

  for (const w of larguras) {
    const arquivo = `${slug}-${indice}-${w}.webp`;
    const registro = IMAGENS[arquivo];
    if (!registro) continue;
    fontes.push({ w, url: `/images/${arquivo}` });
    nativa = registro.nativa;
  }

  return fontes.length ? { fontes, nativa } : null;
}

export function carroDaSemente(base: CarroSemente): Carro {
  const fotos: Foto[] = [];
  for (let i = 0; i < FOTOS_POR_CARRO; i++) {
    const foto = fotoLocal(base.slug, i);
    if (foto) fotos.push(foto);
  }
  const { fotosNoAnuncio, ...resto } = base;
  return { ...resto, fotos, fotosNoAnuncio };
}

/** O estoque de partida, no formato que o site desenha. */
export const ESTOQUE_SEMENTE: Carro[] = SEMENTE.map(carroDaSemente);

export function numeros(carros: Carro[]): Numeros {
  const precos = carros.map((c) => c.preco);
  return {
    carros: carros.length,
    marcas: new Set(carros.map((c) => c.marca)).size,
    menorPreco: precos.length ? Math.min(...precos) : 0,
    maiorPreco: precos.length ? Math.max(...precos) : 0,
    somaPrecos: precos.reduce((a, p) => a + p, 0),
    fotos: carros.reduce((a, c) => a + (c.fotosNoAnuncio ?? c.fotos.length), 0),
  };
}

export function marcasDe(carros: Carro[]): string[] {
  return [...new Set(carros.map((c) => c.marca))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function acharCarro(carros: Carro[], slug: string): Carro | undefined {
  return carros.find((c) => c.slug === slug);
}

/**
 * O carro do herói: o mais caro do estoque de hoje.
 *
 * Sai do dado, e não de um slug escrito à mão. Se o Saulo vender o Corvette em
 * /admin, o herói passa a ser o próximo, sem ninguém precisar mexer no código.
 */
export function destaque(carros: Carro[]): Carro | undefined {
  return [...carros].sort((a, b) => b.preco - a.preco)[0];
}

/**
 * Os seis da home.
 *
 * Espalhados pela faixa de preço inteira, do mais caro ao mais acessível, para
 * quem chega ver que o estoque tem alcance. O carro do herói fica de fora: ele
 * já está na página, e a mesma foto não aparece duas vezes.
 */
export function seisDaHome(carros: Carro[], fora?: string): Carro[] {
  const restantes = carros.filter((c) => c.slug !== fora).sort((a, b) => b.preco - a.preco);
  if (restantes.length <= 6) return restantes;

  const escolhidos: Carro[] = [];
  for (let i = 0; i < 6; i++) {
    // Seis posições distribuídas por igual na lista ordenada por preço.
    const pos = Math.round((i * (restantes.length - 1)) / 5);
    const carro = restantes[pos];
    if (!escolhidos.includes(carro)) escolhidos.push(carro);
  }

  // Se duas posições caíram no mesmo carro, completa com quem falta.
  for (const c of restantes) {
    if (escolhidos.length >= 6) break;
    if (!escolhidos.includes(c)) escolhidos.push(c);
  }
  return escolhidos.slice(0, 6);
}
