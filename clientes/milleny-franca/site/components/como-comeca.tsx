import { linkWhatsApp, agendamentoRecomendado } from "@/lib/dados";
import { numeroDaSecao } from "@/lib/navegacao";
import { Seta } from "@/components/icones";

/**
 * O caminho real ate a primeira sessao, e so ele.
 * O que acontece dentro do consultorio nao esta publicado em lugar nenhum,
 * entao nao esta descrito aqui: seria inventar processo clinico.
 *
 * Desktop: o caminho corre na horizontal e o marcador segue a dobra.
 * Celular: o mesmo caminho vira vertical, sem estouro lateral.
 */
const paradas = [
  {
    n: 1,
    titulo: "Você chama no WhatsApp",
    texto:
      "Diga a idade da criança e que você quer um horário. Não precisa escrever mais do que isso.",
    cor: "var(--coral)",
  },
  {
    n: 2,
    titulo: "A gente combina o horário",
    texto: `${agendamentoRecomendado}, então o dia e a hora saem dessa conversa, dentro dos horários que estão abertos na semana.`,
    cor: "var(--ocre)",
  },
  {
    n: 3,
    titulo: "Vocês vêm ao consultório",
    texto:
      "No dia e na hora combinados, no Jardins. O que vem depois vocês acertam comigo pessoalmente.",
    cor: "var(--cobalto)",
  },
];

export function ComoComeca() {
  return (
    <section className="secao secao-caminho" id="como-comeca">
      <div className="envelope">
        <div className="cabeca-secao">
          <p className="rotulo">
            <span className="numero">{numeroDaSecao("como-comeca")}</span> Como começa
          </p>
          <h2 className="titulo-secao">
            Três passos até
            <em> a primeira sessão</em>
          </h2>
          <p className="texto-grande limitado">
            É todo o caminho até a porta. Não tem cadastro nem formulário longo.
          </p>
        </div>

        <ol className="caminho">
          {/* a linha desenhada, atras das paradas */}
          <svg className="caminho-linha" viewBox="0 0 1000 120" fill="none" aria-hidden="true" preserveAspectRatio="none">
            <path
              d="M40 78 C 200 78, 200 30, 360 30 S 520 92, 680 66 S 880 40, 964 52"
              stroke="var(--borda)"
              strokeWidth="3"
              strokeDasharray="9 12"
              strokeLinecap="round"
            />
          </svg>

          {paradas.map((p) => (
            <li key={p.n} className="parada" style={{ "--parada-cor": p.cor } as React.CSSProperties}>
              <span className="parada-selo" aria-hidden="true">{p.n}</span>
              <h3 className="parada-titulo">{p.titulo}</h3>
              <p className="parada-texto">{p.texto}</p>
            </li>
          ))}
        </ol>

        <div className="caminho-acao">
          <a
            data-cta="como-comeca"
            className="btn btn-primario"
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Começar pelo passo 1
            <Seta className="seta" />
          </a>
        </div>
      </div>
    </section>
  );
}
