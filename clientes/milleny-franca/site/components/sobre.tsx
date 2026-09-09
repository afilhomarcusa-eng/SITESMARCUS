import { negocio, fotos } from "@/lib/dados";
import { numeroDaSecao } from "@/lib/navegacao";

/**
 * Sobre mim. So o que esta publicado: registro, area e as palavras dela.
 * Nada de anos de experiencia, numero de pacientes ou abordagem que ela
 * nao declarou em lugar nenhum.
 */
export function Sobre() {
  const f = fotos.sobre;

  return (
    <section className="secao secao-sobre" id="sobre-mim">
      <div className="envelope sobre-grade">
        <div className="sobre-foto">
          <div className="sobre-moldura">
            <picture>
              <source
                type="image/avif"
                srcSet="/img/milleny-sobre-480.avif 480w, /img/milleny-sobre-720.avif 720w, /img/milleny-sobre-1000.avif 1000w"
                sizes="(min-width: 900px) 38vw, 82vw"
              />
              <img
                src="/img/milleny-sobre-720.webp"
                srcSet="/img/milleny-sobre-480.webp 480w, /img/milleny-sobre-720.webp 720w, /img/milleny-sobre-1000.webp 1000w"
                sizes="(min-width: 900px) 38vw, 82vw"
                alt={f.alt}
                width={720}
                height={833}
                loading="lazy"
              />
            </picture>
          </div>
          {/* fita de papel, presa na foto */}
          <span className="sobre-fita" aria-hidden="true" />
        </div>

        <div className="sobre-texto">
          <p className="rotulo">
            <span className="numero">{numeroDaSecao("sobre-mim")}</span> Sobre mim
          </p>

          <h2 className="titulo-secao">
            Milleny França,
            <em> psicóloga infantil</em>
          </h2>

          <p className="texto-grande">
            É assim que me apresento no meu perfil, e continua valendo aqui:
            apoio ao desenvolvimento com acolhimento e ciência.
          </p>

          <ul className="sobre-fatos">
            <li>
              <span className="fato-chave">Registro</span>
              <span className="fato-valor">{negocio.crp}</span>
            </li>
            <li>
              <span className="fato-chave">Área</span>
              <span className="fato-valor">Psicologia infantil</span>
            </li>
            <li>
              <span className="fato-chave">Foco</span>
              <span className="fato-valor">{negocio.foco}</span>
            </li>
            <li>
              <span className="fato-chave">Onde atendo</span>
              <span className="fato-valor">Jardins, Aracaju</span>
            </li>
          </ul>

          <p className="sobre-nota">
            Este site não faz avaliação nem triagem. Ele existe para você saber
            onde fica, que dias abre e como marcar, antes de gastar uma mensagem
            perguntando.
          </p>
        </div>
      </div>
    </section>
  );
}
