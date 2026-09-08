import { EMPRESA } from "@/lib/contato";
import { SCRIPT_PULAR } from "@/lib/abertura";

/**
 * A abertura, em diafragma.
 *
 * Está aqui, no HTML que o servidor manda, e quem anima é o CSS. Não é criada
 * por React nem por efeito nenhum: o navegador pinta o HTML do servidor bem
 * antes de a hidratação acontecer, e se a cortina nascesse depois, existiria um
 * intervalo em que a página apareceria inteira, aberta, antes de ela cair por
 * cima. Em aparelho lento esse intervalo é enorme.
 *
 * Como não depende de script para sair, ela sai mesmo se o pacote da página
 * falhar. E como o padrão do CSS é `display: none`, sem JavaScript nenhum ela
 * simplesmente não existe: quem está sem script vê o site direto, nunca uma
 * tela branca parada.
 *
 * É aria-hidden porque é decoração. Quem usa leitor de tela recebe a página
 * inteira desde o começo, sem esperar animação.
 */
export default function Cortina() {
  return (
    <>
      <div className="cortina" aria-hidden="true">
        <div className="cortina-chapa">
          <span className="cortina-nome">{EMPRESA.nome}</span>
          <span className="cortina-linha">
            {EMPRESA.atividade} · {EMPRESA.cidade}
          </span>
        </div>
        <i className="folha folha-cima" />
        <i className="folha folha-baixo" />
        <i className="folha folha-esq" />
        <i className="folha folha-dir" />
      </div>

      {/* O primeiro gesto encerra. Fica depois da cortina de propósito: se este
          script não rodar, a animação do CSS termina sozinha do mesmo jeito. */}
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_PULAR }} />
    </>
  );
}
