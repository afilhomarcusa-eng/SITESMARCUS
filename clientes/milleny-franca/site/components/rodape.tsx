import { negocio, contato, endereco } from "@/lib/dados";
import { secoes } from "@/lib/navegacao";
import { IconeInstagram, IconeLocal } from "@/components/icones";

export function Rodape() {
  const ano = 2026;
  return (
    <footer className="rodape">
      <div className="envelope rodape-grade">
        <div className="rodape-marca">
          <p className="rodape-nome">Milleny França</p>
          <p className="rodape-papel">
            {negocio.categoria} <span className="ponto" aria-hidden="true" /> {negocio.crp}
          </p>
          <p className="rodape-lugar">
            {endereco.logradouro}
            <br />
            {endereco.bairro}, {endereco.cidade}, {endereco.estado}
          </p>
        </div>

        <nav className="rodape-nav" aria-label="Seções do site, rodapé">
          {secoes.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{s.rotulo}</a>
          ))}
        </nav>

        <div className="rodape-links">
          <a href={contato.instagramUrl} target="_blank" rel="noopener noreferrer">
            <IconeInstagram /> @{contato.instagramUsuario}
          </a>
          <a href={contato.mapsUrl} target="_blank" rel="noopener noreferrer">
            <IconeLocal /> Ver no mapa
          </a>
          <a href={`tel:${contato.telefoneTel}`}>{contato.telefoneExibicao}</a>
        </div>
      </div>

      <div className="envelope rodape-fim">
        <p>{ano} Milleny França. Todos os direitos reservados.</p>
        <p className="rodape-aviso">
          Este site é informativo. Ele não faz avaliação, diagnóstico nem
          atendimento de urgência.
        </p>
      </div>
    </footer>
  );
}
