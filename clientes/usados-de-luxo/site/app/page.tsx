import Navegacao from "@/components/navegacao";
import Movimento from "@/components/movimento";
import Heroi from "@/components/heroi";
import SecaoDestaques from "@/components/secao-destaques";
import SecaoEstudio from "@/components/secao-estudio";
import SecaoDistancia from "@/components/secao-distancia";
import SecaoLoja from "@/components/secao-loja";
import SecaoDuvidas, { DUVIDAS } from "@/components/secao-duvidas";
import SecaoFinal from "@/components/secao-final";
import { CARROS_INICIAIS } from "@/lib/carros";

/**
 * A home vende, não se apresenta.
 *
 * A ordem foi invertida em relação à primeira versão: os carros vêm logo
 * depois do herói, e a história da loja passou para depois. Quem entra no site
 * de uma revenda quer ver carro, e o argumento de confiança só é ouvido depois
 * que algum carro chamou atenção.
 *
 * O catálogo de verdade, com filtro, busca e ordenação, mora em /estoque, que
 * tem endereço próprio para ser mandado num link e achado no Google.
 *
 * O carro em destaque sai da vitrine da home e não se repete na grade abaixo,
 * para a mesma fotografia não aparecer duas vezes na mesma página.
 */
const DESTAQUE = CARROS_INICIAIS[0];
const RESTO = CARROS_INICIAIS.slice(1);

const perguntasEstruturadas = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DUVIDAS.map((d) => ({
    "@type": "Question",
    name: d.p,
    acceptedAnswer: { "@type": "Answer", text: d.r },
  })),
};

export default function Home() {
  const precos = CARROS_INICIAIS.map((c) => c.preco);

  return (
    <>
      <Movimento />
      <Navegacao />
      <main>
        <Heroi
          total={CARROS_INICIAIS.length}
          menorPreco={Math.min(...precos)}
          maiorPreco={Math.max(...precos)}
          destaque={DESTAQUE}
        />

        <SecaoDestaques inicial={RESTO} total={CARROS_INICIAIS.length} />

        <SecaoEstudio
          /* O perfil do M4: é a foto que mostra a sala inteira, com parede,
             piso, reflexo e as luminárias. Mesma origem da galeria do carro,
             mesmo arquivo, sem cópia com outro nome. */
          src="/images/bmw-m4-coupe-2-1440.webp"
          alt="BMW M4 Coupé branco de perfil dentro do estúdio, com a parede preta ao fundo e o reflexo no piso"
          total={CARROS_INICIAIS.length}
        />

        <SecaoDistancia carros={CARROS_INICIAIS} />
        <SecaoLoja />
        <SecaoDuvidas />
        <SecaoFinal total={CARROS_INICIAIS.length} />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(perguntasEstruturadas) }}
      />
    </>
  );
}
