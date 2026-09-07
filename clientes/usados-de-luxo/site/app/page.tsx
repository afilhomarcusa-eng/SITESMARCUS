import Navegacao from "@/components/navegacao";
import Movimento from "@/components/movimento";
import Heroi from "@/components/heroi";
import SecaoEstudio from "@/components/secao-estudio";
import SecaoEstoque from "@/components/secao-estoque";
import SecaoDistancia from "@/components/secao-distancia";
import SecaoLoja from "@/components/secao-loja";
import SecaoDuvidas, { DUVIDAS } from "@/components/secao-duvidas";
import SecaoFinal from "@/components/secao-final";
import { CARROS_INICIAIS } from "@/lib/carros";

/**
 * O carro em destaque sai do estoque e não se repete na grade abaixo. Assim a
 * mesma fotografia não aparece duas vezes na mesma página, e o herói passa a
 * ter função de vitrine em vez de enfeite.
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

        <SecaoEstudio
          /* O perfil do M4: é a foto que mostra a sala inteira, com parede,
             piso, reflexo e as luminárias. Mesma origem da galeria do carro,
             mesmo arquivo, sem cópia com outro nome. */
          src="/images/bmw-m4-coupe-2-1440.webp"
          alt="BMW M4 Coupé branco de perfil dentro do estúdio, com a parede preta ao fundo e o reflexo no piso"
          total={CARROS_INICIAIS.length}
        />

        <SecaoEstoque inicial={RESTO} />
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
