"use client";

import { useState } from "react";
import Link from "next/link";
import { SetaDireita } from "./icones";

/**
 * Os três caminhos, numa alavanca de câmbio.
 *
 * Engatar uma marcha é o gesto que todo mundo que compra carro conhece de cor,
 * e aqui ele faz um trabalho de verdade: escolhe o caminho e troca o painel.
 * Não é enfeite girando sozinho na tela.
 *
 * Acessibilidade não foi sacrificada pelo brinquedo: os encaixes são abas de
 * verdade, com seta do teclado, Home e End funcionando, e cada painel continua
 * sendo um bloco de texto com um link dentro.
 *
 * Sem JavaScript, os três painéis aparecem empilhados e os três botões
 * funcionam. O que o script acrescenta é a troca, nunca o conteúdo.
 */

const CAMINHOS = [
  {
    id: "comprar",
    letra: "C",
    marcha: "Marcha 01",
    titulo: "Comprar do estoque",
    texto:
      "Cada carro tem página própria, com as fotos do anúncio, a ficha inteira e o que já está pago: IPVA, garantia, revisões e proteção de pintura.",
    href: "/estoque",
    botao: "Ver o estoque",
  },
  {
    id: "procurar",
    letra: "P",
    marcha: "Marcha 02",
    titulo: "Procurar um carro",
    texto:
      "Diga marca, modelo, ano e faixa de preço. Saulo procura e avalia o carro em qualquer lugar do Brasil, e volta com as opções.",
    href: "/procuro",
    botao: "Dizer o que procuro",
  },
  {
    id: "vender",
    letra: "V",
    marcha: "Marcha 03",
    titulo: "Vender o seu",
    texto:
      "Quem quer se desfazer de um carro premium com segurança manda a ficha por aqui. Saulo avalia e conduz a venda.",
    href: "/vender",
    botao: "Mandar a ficha do meu",
  },
];

export default function Caminhos() {
  const [engate, setEngate] = useState(0);

  function teclado(e: React.KeyboardEvent) {
    const teclas: Record<string, number> = {
      ArrowDown: engate + 1,
      ArrowRight: engate + 1,
      ArrowUp: engate - 1,
      ArrowLeft: engate - 1,
      Home: 0,
      End: CAMINHOS.length - 1,
    };
    const alvo = teclas[e.key];
    if (alvo === undefined) return;
    e.preventDefault();
    const novo = Math.min(CAMINHOS.length - 1, Math.max(0, alvo));
    setEngate(novo);
    document.getElementById(`encaixe-${CAMINHOS[novo].id}`)?.focus();
  }

  return (
    <div className="seletor">
      <div
        className="trilho"
        role="tablist"
        aria-orientation="vertical"
        aria-label="Escolher o caminho"
        onKeyDown={teclado}
      >
        <div className="alavanca" style={{ "--engate": engate } as React.CSSProperties} aria-hidden="true" />
        {CAMINHOS.map((c, i) => (
          <button
            key={c.id}
            id={`encaixe-${c.id}`}
            type="button"
            role="tab"
            className="encaixe"
            aria-selected={engate === i}
            aria-controls={`painel-${c.id}`}
            tabIndex={engate === i ? 0 : -1}
            onClick={() => setEngate(i)}
            data-encaixe={c.id}
          >
            {c.letra}
          </button>
        ))}
      </div>

      <div>
        {CAMINHOS.map((c, i) => (
          <div
            key={c.id}
            id={`painel-${c.id}`}
            role="tabpanel"
            aria-labelledby={`encaixe-${c.id}`}
            className="painel-caminho"
            data-oculto={engate === i ? "0" : "1"}
            data-painel={c.id}
          >
            <span className="marcha">{c.marcha}</span>
            <h3>{c.titulo}</h3>
            <p>{c.texto}</p>
            <div>
              <Link className="acao" href={c.href} data-porta={c.href}>
                {c.botao}
                <SetaDireita />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
