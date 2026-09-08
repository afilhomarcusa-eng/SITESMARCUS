import { SCRIPT_PULAR } from "@/lib/abertura";

/**
 * A cortina.
 *
 * Um retângulo preto com o nome da loja, que recolhe para cima e entrega a
 * cena montada. É a quarta versão desta abertura e a primeira que não pode
 * abrir cedo, porque não depende de nada que chegue depois.
 *
 * Ela está aqui, no HTML que o servidor manda. Não é criada por React nem por
 * efeito nenhum. Antes era, e esse era o defeito: o navegador pinta o HTML do
 * servidor muito antes de o React hidratar, e nesse intervalo a página aparecia
 * inteira, aberta, sem abertura nenhuma por cima. Só depois o véu caía. Em
 * aparelho lento dava para ver o site antes da abertura, que é exatamente a
 * reclamação.
 *
 * Quem anima é o CSS, não o JavaScript. Então a cortina sai no tempo certo
 * mesmo que o pacote da página falhe, mesmo que o three nunca chegue, mesmo com
 * o JavaScript desligado no navegador. Abertura que precisa de script para
 * sumir é uma tela preta esperando o dia de dar errado.
 *
 * O conteúdo por baixo está pintado desde o primeiro quadro. A cortina cobre,
 * não substitui: o navegador conta a pintura do carro para o LCP no começo, e
 * por isso a abertura pode durar três segundos sem custar carregamento.
 *
 * Ela é aria-hidden porque é decoração. Quem usa leitor de tela recebe a página
 * inteira desde o começo, sem esperar animação.
 */
export default function Cortina() {
  return (
    <>
      <div className="cortina" aria-hidden="true">
        <div className="cortina-marca">
          <p className="cortina-nome">Delux</p>
          <span className="cortina-risco" />
          <p className="cortina-lugar">Salvador, Bahia</p>
        </div>
      </div>

      {/* A linha de luz que corre junto com a borda da cortina. Mesma duração e
          mesmos pontos de quadro que ela, então as duas andam coladas. */}
      <div className="cortina-luz" aria-hidden="true" />

      {/* Primeiro gesto encerra. Fica depois da cortina de propósito: se este
          script não rodar, a animação do CSS termina sozinha do mesmo jeito. */}
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_PULAR }} />
    </>
  );
}
