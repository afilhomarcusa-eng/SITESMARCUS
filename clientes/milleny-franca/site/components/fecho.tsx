import { linkWhatsApp, contato } from "@/lib/dados";
import { Seta } from "@/components/icones";

/**
 * O fim fecha o laco: a mesma linha que a crianca desenhou na abertura volta,
 * agora dando a volta na acao de agendar.
 */
export function Fecho() {
  return (
    <section className="secao secao-fecho" id="agendar">
      <div className="envelope fecho-caixa revela">
        <svg className="fecho-laco" viewBox="0 0 900 340" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <path
            className="laco-linha"
            d="M112 62 C 40 92, 26 190, 84 244 C 148 304, 300 320, 450 320 C 600 320, 752 304, 816 244 C 874 190, 860 92, 788 62"
            stroke="var(--cobalto)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="66" cy="150" r="9" fill="var(--ocre)" />
          <rect x="826" y="142" width="16" height="16" rx="3" fill="var(--coral)" />
        </svg>

        <h2 className="fecho-titulo">
          Se você chegou até aqui,
          <em> a próxima parte é uma conversa.</em>
        </h2>

        <p className="fecho-texto">
          Me chame no WhatsApp e diga a idade da criança. A partir daí a gente
          acha um horário.
        </p>

        <div className="fecho-acoes">
          <a
            data-cta="fecho"
            className="btn btn-primario btn-grande"
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Agendar um horário
            <Seta className="seta" />
          </a>
          <a className="fecho-numero" href={`tel:${contato.telefoneTel}`}>
            ou ligue para {contato.telefoneExibicao}
          </a>
        </div>
      </div>
    </section>
  );
}
