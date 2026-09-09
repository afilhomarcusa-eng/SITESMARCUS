"use client";

import { useState } from "react";
import FotoCarro from "./foto";
import { Fechar, Marcado } from "./icones";
import { reais } from "@/lib/fmt";
import type { Carro, Foto } from "@/lib/tipos";

/**
 * A gerência do estoque.
 *
 * Tudo que está aqui mexe no banco de verdade: o que o Saulo salva é o que todo
 * visitante vê, em qualquer aparelho. Não existe cópia guardada no navegador
 * dele fingindo ser estoque.
 *
 * A tela trabalha sobre uma cópia da lista e só grava quando ele manda. Isso
 * deixa cancelar sem consequência, e evita gravar dez vezes enquanto ele
 * digita um preço.
 *
 * A foto é a exceção: ela sobe na hora em que é escolhida, porque quem recorta
 * e redimensiona é o servidor. O que volta é o registro pronto, com a dimensão
 * da origem, que é o que o site usa para nunca desenhar a foto maior do que ela
 * é.
 */

const VAZIO: Carro = {
  slug: "",
  marca: "",
  modelo: "",
  nome: "",
  ano: new Date().getFullYear(),
  preco: 0,
  conferido: [],
  itens: [],
  fotos: [],
};

function endereco(marca: string, modelo: string, ano: number): string {
  return `${marca} ${modelo} ${ano}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export default function Gerencia({
  inicial,
  usandoSemente,
}: {
  inicial: Carro[];
  usandoSemente: boolean;
}) {
  const [carros, setCarros] = useState<Carro[]>(inicial);
  const [editando, setEditando] = useState<number | null>(null);
  const [recado, setRecado] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mexeu, setMexeu] = useState(false);
  const [semente, setSemente] = useState(usandoSemente);

  const carro = editando === null ? null : carros[editando];

  function alterar(mudanca: Partial<Carro>) {
    if (editando === null) return;
    setCarros((lista) =>
      lista.map((c, i) => (i === editando ? { ...c, ...mudanca } : c)),
    );
    setMexeu(true);
  }

  function novo() {
    setCarros((lista) => [...lista, { ...VAZIO }]);
    setEditando(carros.length);
    setMexeu(true);
    setRecado("");
  }

  function remover(indice: number) {
    const alvo = carros[indice];
    if (!confirm(`Tirar ${alvo.modelo || "este carro"} do estoque?`)) return;
    setCarros((lista) => lista.filter((_, i) => i !== indice));
    setEditando(null);
    setMexeu(true);
  }

  async function subirFoto(arquivo: File, posicao: number) {
    if (!carro) return;
    const slug = carro.slug || endereco(carro.marca, carro.modelo, carro.ano);
    if (!slug) {
      setRecado("Preencha marca e modelo antes de subir foto: o endereço vem deles.");
      return;
    }

    setSalvando(true);
    try {
    setRecado("Subindo a foto e gerando os tamanhos...");
    const corpo = new FormData();
    // Mantém o corpo abaixo do limite de upload da hospedagem, inclusive com fotos de celular.
    let envio: Blob = arquivo;
    if (arquivo.size > 3_500_000) {
      const bitmap = await createImageBitmap(arquivo);
      try {
        const escala = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * escala); canvas.height = Math.round(bitmap.height * escala);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Imagem indisponível.");
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        envio = await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Imagem inválida.")), "image/jpeg", .86));
      } finally { bitmap.close(); }
    }
    if (envio.size > 3_500_000) { setRecado("Escolha uma foto menor para concluir o envio."); return; }
    corpo.append("foto", envio, arquivo.name);
    corpo.append("slug", slug);
    corpo.append("indice", String(posicao));

    const resposta = await fetch("/api/gerencia/foto", { method: "POST", body: corpo });
    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      setRecado(dados.erro ?? "A foto não subiu.");
      return;
    }

    const fotos = [...carro.fotos];
    fotos[posicao] = dados.foto as Foto;
    alterar({ slug, fotos: fotos.filter(Boolean) });
    setRecado("Foto pronta.");
    } catch { setRecado("Não consegui enviar a foto. Verifique a conexão e tente novamente."); }
    finally { setSalvando(false); }
  }

  async function restaurar() {
    if (
      !confirm(
        "Isto troca o estoque inteiro pela lista original de 08/09/2026. O que estiver cadastrado agora se perde. Continuar?",
      )
    )
      return;

    setSalvando(true);
    try {
    setRecado("Restaurando a lista original...");
    const resposta = await fetch("/api/gerencia/estoque", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ semear: true }),
    });
    setSalvando(false);
    if (!resposta.ok) {
      setRecado("Não consegui restaurar.");
      return;
    }
    const dados = await resposta.json();
    setCarros(dados.lista);
    setEditando(null);
    setMexeu(false);
    setSemente(false);
    setRecado("Lista original restaurada.");
    } catch { setRecado("Não consegui restaurar. Verifique a conexão e tente novamente."); }
    finally { setSalvando(false); }
  }

  async function salvar() {
    setSalvando(true);
    try {
    setRecado("Salvando...");

    const limpos = carros.map((c) => ({
      ...c,
      conferido: c.conferido.map(v=>v.trim()).filter(Boolean),
      itens: c.itens.map(v=>v.trim()).filter(Boolean),
      slug: c.slug || endereco(c.marca, c.modelo, c.ano),
    }));

    const resposta = await fetch("/api/gerencia/estoque", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ carros: limpos }),
    });
    const dados = await resposta.json().catch(() => ({}));
    setSalvando(false);

    if (!resposta.ok) {
      setRecado(dados.erro ?? "Não consegui salvar.");
      return;
    }

    setSemente(false);
    setCarros(limpos);
    setMexeu(false);
    setRecado(`Salvo. O site já está mostrando ${dados.carros} carros.`);
    } catch { setRecado("Não consegui salvar. Verifique a conexão e tente novamente."); }
    finally { setSalvando(false); }
  }

  return (
    <div className="gerencia">
      <header className="gerencia-topo">
        <div>
          <p className="fino">Gerência do estoque</p>
          <h1>{carros.length} carros</h1>
          <p className="gerencia-estado">
            {semente
              ? "O banco ainda está vazio: esta lista é a de 08/09/2026. Salvar cria o banco."
              : "Lista vinda do banco."}
          </p>
        </div>

        <div className="gerencia-acoes">
          <button type="button" className="limpar" onClick={restaurar} disabled={salvando} data-restaurar>
            Restaurar a lista original
          </button>
          <button type="button" className="acao acao-vazada" onClick={novo} disabled={salvando}>
            Adicionar carro
          </button>
          <button
            type="button"
            className="acao"
            onClick={salvar}
            disabled={salvando || (!mexeu && !semente)}
            data-salvar
          >
            <Marcado />
            {semente && !mexeu ? "Criar o banco com esta lista" : mexeu ? "Salvar no site" : "Tudo salvo"}
          </button>
        </div>
      </header>

      {recado ? (
        <p className="gerencia-recado" role="status" data-recado>
          {recado}
        </p>
      ) : null}

      <div className="gerencia-grade">
        <ol className="gerencia-lista">
          {carros.map((c, i) => (
            <li key={`${c.slug}-${i}`} data-linha={c.slug}>
              <button
                type="button"
                className={`gerencia-linha${editando === i ? " gerencia-linha-ativa" : ""}`}
                onClick={() => setEditando(i)}
                disabled={salvando}
              >
                <span className="serie">{String(i + 1).padStart(2, "0")}</span>
                <span className="gerencia-nome">
                  <strong>{c.modelo || "Carro novo"}</strong>
                  <small>{c.marca}</small>
                </span>
                <span className="serie">{c.preco ? reais(c.preco) : "sem preço"}</span>
              </button>
              <button
                type="button"
                className="gerencia-tirar"
                onClick={() => remover(i)}
                disabled={salvando}
                aria-label={`Tirar ${c.modelo || "carro"} do estoque`}
                data-remover={c.slug}
              >
                <Fechar />
              </button>
            </li>
          ))}
        </ol>

        {carro ? (
          <form className="gerencia-editor" onSubmit={(e) => e.preventDefault()}>
            <fieldset disabled={salvando}>
            <div className="campos">
              <Campo rotulo="Marca" valor={carro.marca} ao={(v) => alterar({ marca: v })} />
              <Campo rotulo="Modelo, o nome curto do cartão" valor={carro.modelo} ao={(v) => alterar({ modelo: v })} />
              <Campo
                rotulo="Nome inteiro, o título da ficha"
                valor={carro.nome}
                ao={(v) => alterar({ nome: v })}
                largo
              />
              <Campo
                rotulo="Ano"
                valor={String(carro.ano)}
                ao={(v) => alterar({ ano: Number(v) || 0 })}
              />
              <Campo
                rotulo="Preço, em reais"
                valor={String(carro.preco)}
                ao={(v) => alterar({ preco: Number(v.replace(/\D/g, "")) || 0 })}
                dica={carro.preco ? reais(carro.preco) : "só números"}
              />
              <Campo
                rotulo="Quilometragem"
                valor={carro.km ? String(carro.km) : ""}
                ao={(v) => alterar({ km: v ? Number(v.replace(/\D/g, "")) : undefined })}
                dica="em branco não aparece na ficha"
              />
              <Campo
                rotulo="Potência, em cv"
                valor={carro.potencia ? String(carro.potencia) : ""}
                ao={(v) => alterar({ potencia: v ? Number(v.replace(/\D/g, "")) : undefined })}
              />
              <Campo rotulo="Motor" valor={carro.motor ?? ""} ao={(v) => alterar({ motor: v || undefined })} />
              <Campo rotulo="Câmbio" valor={carro.cambio ?? ""} ao={(v) => alterar({ cambio: v || undefined })} />
              <Campo rotulo="Tração" valor={carro.tracao ?? ""} ao={(v) => alterar({ tracao: v || undefined })} />
              <Campo rotulo="Cor" valor={carro.cor ?? ""} ao={(v) => alterar({ cor: v || undefined })} />
              <Campo rotulo="Interior" valor={carro.interior ?? ""} ao={(v) => alterar({ interior: v || undefined })} />
              <Campo
                rotulo="Aviso que muda o valor do carro"
                valor={carro.nota ?? ""}
                ao={(v) => alterar({ nota: v || undefined })}
                dica="aparece no cartão e em destaque na ficha"
                largo
              />

              <Lista
                rotulo="O que já está resolvido, um por linha"
                valores={carro.conferido}
                ao={(v) => alterar({ conferido: v })}
              />
              <Lista
                rotulo="Equipamentos, um por linha"
                valores={carro.itens}
                ao={(v) => alterar({ itens: v })}
              />
            </div>

            <div className="gerencia-fotos">
              <p className="fino">Fotos, até seis. A primeira é a capa</p>
              <div className="gerencia-tira">
                {[0, 1, 2, 3, 4, 5].map((pos) => {
                  const foto = carro.fotos[pos];
                  return (
                    <label key={pos} className="gerencia-slot">
                      {foto ? (
                        <FotoCarro foto={foto} alt={`Foto ${pos + 1}`} sizes="160px" />
                      ) : (
                        <span className="gerencia-vazio serie">{pos + 1}</span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="so-leitor"
                        onChange={(e) => {
                          const arq = e.target.files?.[0];
                          if (arq) subirFoto(arq, pos);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  );
                })}
              </div>
              <p className="gerencia-dica">
                A foto é recortada em pé, 3 por 4, e sai em três tamanhos. O
                original nunca é ampliado: foto pequena fica pequena.
              </p>
            </div>
            </fieldset>
          </form>
        ) : (
          <div className="gerencia-editor gerencia-nada">
            <p>Escolha um carro na lista para editar, ou adicione um novo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Campo({
  rotulo,
  valor,
  ao,
  dica,
  largo,
}: {
  rotulo: string;
  valor: string;
  ao: (v: string) => void;
  dica?: string;
  largo?: boolean;
}) {
  const id = `g-${rotulo.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className={`campo${largo ? " campo-largo" : ""}`}>
      <label htmlFor={id}>{rotulo}</label>
      <input id={id} value={valor} onChange={(e) => ao(e.target.value)} />
      {dica ? <small>{dica}</small> : null}
    </div>
  );
}

function Lista({
  rotulo,
  valores,
  ao,
}: {
  rotulo: string;
  valores: string[];
  ao: (v: string[]) => void;
}) {
  const id = `g-${rotulo.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="campo campo-largo">
      <label htmlFor={id}>{rotulo}</label>
      <textarea
        id={id}
        value={valores.join("\n")}
        onChange={(e) => ao(e.target.value.split("\n"))}
        rows={6}
      />
    </div>
  );
}
