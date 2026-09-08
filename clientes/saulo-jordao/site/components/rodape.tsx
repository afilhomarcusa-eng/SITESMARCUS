import Link from "next/link";
import {
  CONTATO,
  EMPRESA,
  INSTAGRAM_URL,
  MENSAGEM_DIRETA,
  ONDE_ATENDE,
  whatsapp,
} from "@/lib/contato";

export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="rodape-grade">
        <div>
          <h2>{EMPRESA.nome}</h2>
          <p className="fino">{EMPRESA.atividade}</p>
          <p style={{ marginTop: 12, color: "var(--tinta-media)", maxWidth: "30ch" }}>
            {ONDE_ATENDE}
          </p>
        </div>

        <div>
          <p className="fino" style={{ marginBottom: 14 }}>
            Falar com Saulo
          </p>
          <ul>
            <li>
              <a
                href={whatsapp(MENSAGEM_DIRETA)}
                target="_blank"
                rel="noopener"
                data-conversa="rodape"
              >
                WhatsApp {CONTATO.exibicao}
              </a>
            </li>
            <li>
              <a href={`tel:+${CONTATO.e164}`}>Ligar para {CONTATO.exibicao}</a>
            </li>
            <li>
              <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener">
                Instagram @{EMPRESA.instagram}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="fino" style={{ marginBottom: 14 }}>
            Páginas
          </p>
          <ul>
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>
              <Link href="/estoque">Estoque</Link>
            </li>
            <li>
              <Link href="/procuro">Procuro um carro</Link>
            </li>
            <li>
              <Link href="/vender">Quero vender o meu</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="rodape-fim">
        <span>
          {EMPRESA.assinatura}, {EMPRESA.cidade}, {EMPRESA.uf}
        </span>
        <span>Corretor de veículos premium desde {EMPRESA.desde}</span>
      </div>
    </footer>
  );
}
