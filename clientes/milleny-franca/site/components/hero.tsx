import { negocio, endereco, fotos, linkWhatsApp } from "@/lib/dados";
import { Seta } from "@/components/icones";

/**
 * Primeiro quadro. Pintado opaco desde o primeiro pixel: quem esconde e a
 * cortina, nao a opacidade daqui. Por isso o LCP e o retrato, e ele conta
 * mesmo com a abertura rodando.
 *
 * Fundo: tipografia grande e a malha desenhada.
 * Meio: o retrato dela, mascarado num recorte de papel.
 * Frente: formas de papel que passam por cima da borda da foto.
 */
export function Hero() {
  const f = fotos.hero;

  return (
    <section className="hero" id="topo">
      {/* ---------- fundo ---------- */}
      <div className="hero-fundo" aria-hidden="true">
        <span className="hero-palavra">brincar</span>
        <svg className="hero-malha" viewBox="0 0 600 400" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M-20 300 C 120 300, 150 150, 300 170 S 500 240, 640 140"
            stroke="var(--borda)" strokeWidth="2" strokeDasharray="7 11" strokeLinecap="round" />
          <path d="M-20 350 C 140 360, 190 230, 330 250 S 520 300, 640 210"
            stroke="var(--borda)" strokeWidth="2" strokeDasharray="7 11" strokeLinecap="round" />
        </svg>
      </div>

      <div className="envelope hero-grade">
        {/* ---------- conteudo ----------
            No celular a ordem do DOM ja e a ordem visual: cabeca, retrato,
            corpo. Assim o rosto dela entra na primeira tela em vez de ficar
            embaixo de um bloco de texto. No desktop o grid recoloca. */}
        <div className="hero-cabeca">
          <p className="rotulo hero-rotulo">
            {negocio.crp} <span className="ponto" aria-hidden="true" /> {endereco.cidade}, {endereco.estado}
          </p>

          <h1 className="hero-titulo">
            Um lugar onde a criança
            <em> chega brincando</em> e é
            levada a sério.
          </h1>
        </div>

        <div className="hero-corpo">
          <p className="hero-linha">
            Sou <strong>Milleny França</strong>, psicóloga infantil no bairro Jardins.
            Trabalho com intervenção precoce: apoio ao desenvolvimento com
            acolhimento e ciência.
          </p>

          <div className="hero-acoes">
            <a
              data-cta="hero"
              className="btn btn-primario"
              href={linkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar um horário
              <Seta className="seta" />
            </a>
            <a className="btn btn-secundario" href="#como-comeca">
              Ver como começa
            </a>
          </div>
        </div>

        {/* ---------- retrato ---------- */}
        <div className="hero-retrato">
          <div className="hero-moldura">
            <picture>
              <source
                media="(max-width: 767px)"
                type="image/avif"
                srcSet="/img/milleny-hero-mobile-480.avif 480w, /img/milleny-hero-mobile-720.avif 720w, /img/milleny-hero-mobile-1080.avif 1080w"
                sizes="100vw"
              />
              <source
                media="(max-width: 767px)"
                type="image/webp"
                srcSet="/img/milleny-hero-mobile-480.webp 480w, /img/milleny-hero-mobile-720.webp 720w, /img/milleny-hero-mobile-1080.webp 1080w"
                sizes="100vw"
              />
              <source
                type="image/avif"
                srcSet="/img/milleny-hero-640.avif 640w, /img/milleny-hero-900.avif 900w, /img/milleny-hero-1200.avif 1200w, /img/milleny-hero-1600.avif 1600w"
                sizes="(min-width: 1200px) 46vw, 52vw"
              />
              <img
                src="/img/milleny-hero-900.webp"
                srcSet="/img/milleny-hero-640.webp 640w, /img/milleny-hero-900.webp 900w, /img/milleny-hero-1200.webp 1200w, /img/milleny-hero-1600.webp 1600w"
                sizes="(min-width: 1200px) 46vw, 52vw"
                alt={f.alt}
                width={900}
                height={1436}
                fetchPriority="high"
                decoding="sync"
              />
            </picture>
          </div>

          {/* ---------- frente: papel que cruza a borda ---------- */}
          <svg className="hero-frente hero-frente-sol" viewBox="0 0 90 90" fill="none" aria-hidden="true">
            <circle cx="45" cy="45" r="20" fill="var(--ocre)" />
            <g stroke="var(--ocre)" strokeWidth="4" strokeLinecap="round">
              <path d="M45 8v10M45 72v10M8 45h10M72 45h10M18 18l7 7M65 65l7 7M72 18l-7 7M25 65l-7 7" />
            </g>
          </svg>
          <svg className="hero-frente hero-frente-onda" viewBox="0 0 120 40" fill="none" aria-hidden="true">
            <path d="M4 26 C 20 4, 36 4, 52 26 S 84 48, 100 26 S 116 12, 116 12"
              stroke="var(--cobalto)" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
