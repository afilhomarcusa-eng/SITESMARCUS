"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EMPRESA, MENSAGEM_DIRETA, whatsapp } from "@/lib/contato";

const DESTINOS = [
  { href: "/estoque", rotulo: "Estoque" },
  { href: "/procuro", rotulo: "Procuro um carro" },
  { href: "/vender", rotulo: "Quero vender" },
];

/**
 * O cabeçalho.
 *
 * O botão de WhatsApp daqui é a única conversa em branco do site, junto com o
 * do rodapé. É a saída de quem só quer falar. Todo o resto leva a um caminho
 * que chega qualificado: o carro, o que a pessoa procura, ou o carro dela.
 *
 * No celular, "Estoque" fica na barra de baixo, à vista, e não dentro de um
 * botão sanfona: é o destino que mais interessa a quem chega, e escondê-lo
 * custa um toque logo no começo.
 */
export default function Cabecalho() {
  const rota = usePathname();

  return (
    <>
      <header className="cabecalho">
        <Link href="/" className="marca">
          {EMPRESA.nome}
          <span>Premium Cars</span>
        </Link>

        <nav className="menu" aria-label="Principal">
          {DESTINOS.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              aria-current={rota === d.href ? "page" : undefined}
            >
              {d.rotulo}
            </Link>
          ))}
        </nav>

        <a
          className="acao cabecalho-acao"
          href={whatsapp(MENSAGEM_DIRETA)}
          target="_blank"
          rel="noopener"
          data-conversa="cabecalho"
        >
          WhatsApp
        </a>
      </header>

      <nav className="barra-mobile" aria-label="Atalhos">
        {DESTINOS.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            aria-current={rota === d.href ? "page" : undefined}
          >
            {d.rotulo === "Procuro um carro" ? "Procuro" : d.rotulo}
          </Link>
        ))}
      </nav>
    </>
  );
}
