"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CARROS_INICIAIS } from "@/lib/carros";
import {
  apagarFoto,
  gravarFoto,
  gravarTudo,
  lerFoto,
  lerTudo,
  restaurarInicial,
  type CarroSalvo,
} from "@/lib/estoque";
import { brl, km } from "@/lib/fmt";

/**
 * Gerência do estoque.
 *
 * Nesta loja ela não é um extra: é o único jeito de o estoque existir. A Delux
 * Motors não publica carro em lugar nenhum, então o site nasceu sem catálogo, e
 * é aqui que ele começa.
 *
 * O que ela é hoje: cadastro completo que grava no IndexedDB deste navegador.
 * Funciona de verdade, o estoque do site muda de verdade, e nada aqui finge ter
 * mandado dado para servidor nenhum.
 *
 * O que falta para virar multiusuário: trocar as funções de lib/estoque.ts por
 * chamadas de API e pôr uma senha na frente desta página. Nenhum campo, nenhum
 * formulário e nenhum componente precisa mudar por causa disso.
 */

const VAZIO: CarroSalvo = {
  slug: "",
  marca: "",
  modelo: "",
  versao: "",
  motor: "",
  potencia: 0,
  combustivel: "Flex",
  cambio: "Automático",
  tracao: "Dianteira",
  ano: "",
  km: 0,
  preco: 0,
  destaques: [],
  // Nasce sem foto. Herdar o arquivo de outro carro faria um Porsche recém
  // cadastrado aparecer com a foto do M4, que é foto falsa com outro nome.
  foto: "",
  fotos: 0,
  nativa: { w: 1440, h: 1800 },
  origem: "",
};

const COMBUSTIVEIS = ["Flex", "Gasolina", "Diesel", "Híbrido", "Elétrico"];
const CAMBIOS = ["Automático", "Manual", "Automatizado", "CVT", "S tronic", "DCT"];
const TRACOES = ["Dianteira", "Traseira", "Integral", "4x4"];

/** Gera o slug a partir de marca, modelo e ano. */
function paraSlug(c: CarroSalvo) {
  const ano = (c.ano.split("/").pop() ?? "").trim();
  const anoCheio = ano.length === 2 ? `20${ano}` : ano;
  return [c.marca, c.modelo, c.versao, anoCheio]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Reduz a foto enviada antes de guardar. Nunca amplia: se a origem for menor
 * que 1440, ela fica do tamanho que é. Ampliar para bater uma meta de retina
 * só produz foto borrada com arquivo grande.
 */
function prepararFoto(arquivo: File): Promise<{ dataUrl: string; w: number; h: number }> {
  return new Promise((ok, erro) => {
    const leitor = new FileReader();
    leitor.onerror = () => erro(new Error("Não consegui ler o arquivo."));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => erro(new Error("Esse arquivo não parece ser uma imagem."));
      img.onload = () => {
        const largura = Math.min(1440, img.naturalWidth);
        const altura = Math.round((largura / img.naturalWidth) * img.naturalHeight);
        const cv = document.createElement("canvas");
        cv.width = largura;
        cv.height = altura;
        cv.getContext("2d")!.drawImage(img, 0, 0, largura, altura);
        ok({ dataUrl: cv.toDataURL("image/webp", 0.84), w: largura, h: altura });
      };
      img.src = leitor.result as string;
    };
    leitor.readAsDataURL(arquivo);
  });
}

function Campo({
  rotulo,
  children,
  dica,
}: {
  rotulo: string;
  children: React.ReactNode;
  dica?: string;
}) {
  return (
    <label className="block">
      <span className="etiqueta mb-2 block">{rotulo}</span>
      {children}
      {dica ? (
        <span className="mt-1.5 block text-[0.65rem]" style={{ color: "var(--tinta-3)" }}>
          {dica}
        </span>
      ) : null}
    </label>
  );
}

const entrada =
  "w-full bg-transparent px-3 py-2.5 text-[0.9rem] outline-none transition-colors duration-200";

export default function Gerencia() {
  const [lista, setLista] = useState<CarroSalvo[] | null>(null);
  const [rascunho, setRascunho] = useState<CarroSalvo>(VAZIO);
  const [editando, setEditando] = useState<string | null>(null);
  const [previa, setPrevia] = useState<string>("");
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");
  const arquivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    lerTudo().then((salvo) => setLista(salvo ?? (CARROS_INICIAIS as CarroSalvo[])));
  }, []);

  const destaquesTexto = useMemo(() => rascunho.destaques.join("\n"), [rascunho.destaques]);

  function limpar() {
    setRascunho(VAZIO);
    setEditando(null);
    setPrevia("");
    setErro("");
    if (arquivoRef.current) arquivoRef.current.value = "";
  }

  async function editar(c: CarroSalvo) {
    setRascunho(c);
    setEditando(c.slug);
    setErro("");
    setPrevia(
      c.fotoEnviada ? ((await lerFoto(c.fotoEnviada)) ?? "") : c.foto ? `/images/${c.foto}-0c-1000.webp` : "",
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function aoEscolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setErro("");
    try {
      const { dataUrl, w, h } = await prepararFoto(f);
      const chave = `foto-${Date.now()}`;
      await gravarFoto(chave, dataUrl);
      setRascunho((r) => ({ ...r, fotoEnviada: chave, nativa: { w, h } }));
      setPrevia(dataUrl);
      setAviso(`Foto guardada em ${w} por ${h} pixels.`);
    } catch (ex) {
      setErro(ex instanceof Error ? ex.message : "Não consegui usar essa foto.");
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!rascunho.marca.trim() || !rascunho.modelo.trim()) {
      return setErro("Marca e modelo são obrigatórios.");
    }
    if (!rascunho.ano.trim()) return setErro("Preencha o ano.");
    if (rascunho.preco <= 0) return setErro("O preço precisa ser maior que zero.");

    const slug = editando ?? paraSlug(rascunho);
    const atual = lista ?? [];
    if (!editando && atual.some((c) => c.slug === slug)) {
      return setErro("Já existe um carro com esse mesmo slug. Mude a versão ou o ano.");
    }

    const salvo: CarroSalvo = { ...rascunho, slug };
    const nova = editando
      ? atual.map((c) => (c.slug === editando ? salvo : c))
      : [salvo, ...atual];

    await gravarTudo(nova);
    setLista(nova);
    setAviso(editando ? "Carro atualizado." : "Carro cadastrado.");
    limpar();
  }

  async function remover(c: CarroSalvo) {
    if (!confirm(`Tirar ${c.marca} ${c.modelo} do estoque?`)) return;
    const nova = (lista ?? []).filter((x) => x.slug !== c.slug);
    if (c.fotoEnviada) await apagarFoto(c.fotoEnviada);
    await gravarTudo(nova);
    setLista(nova);
    setAviso("Carro removido do estoque.");
    if (editando === c.slug) limpar();
  }

  async function restaurar() {
    if (!confirm("Apagar tudo e voltar o estoque ao ponto de partida?")) return;
    await restaurarInicial();
    setLista(CARROS_INICIAIS as CarroSalvo[]);
    setAviso("Estoque restaurado.");
    limpar();
  }

  function baixarJson() {
    const blob = new Blob([JSON.stringify(lista ?? [], null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "estoque.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <main className="min-h-svh pb-24 pt-10">
      <div className="casca">
        <header
          className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b pb-7"
          style={{ borderColor: "var(--linha)" }}
        >
          <div>
            <p className="etiqueta mb-3">Gerência</p>
            <h1 className="display text-[clamp(1.7rem,3.6vw,2.6rem)]">Estoque</h1>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/"
              className="text-[0.7rem] uppercase tracking-[0.14em]"
              style={{ color: "var(--tinta-2)" }}
            >
              Ver o site
            </Link>
            <button
              type="button"
              onClick={baixarJson}
              className="text-[0.7rem] uppercase tracking-[0.14em]"
              style={{ color: "var(--tinta-2)" }}
            >
              Baixar JSON
            </button>
            <button
              type="button"
              onClick={restaurar}
              className="text-[0.7rem] uppercase tracking-[0.14em]"
              style={{ color: "var(--tinta-3)" }}
            >
              Apagar tudo
            </button>
          </div>
        </header>

        <p
          className="corpo mb-10 max-w-[70ch] border-l-2 pl-5 text-[0.88rem]"
          style={{ borderColor: "var(--tinta)" }}
        >
          O estoque do site começa aqui. O que você cadastrar é gravado neste
          navegador e aparece na página de estoque na hora, nesta máquina. Ainda
          não existe banco de dados, então outro computador não enxerga estas
          mudanças. Use o botão Baixar JSON para mandar a lista e ela virar o
          estoque publicado de verdade.
        </p>

        {aviso ? (
          <p role="status" className="mb-6 text-[0.78rem]" style={{ color: "var(--tinta)" }}>
            {aviso}
          </p>
        ) : null}

        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          {/* ------------------------------------------------------ formulário */}
          <form onSubmit={salvar} noValidate>
            <h2 className="display-leve mb-7 text-[1.15rem]">
              {editando ? "Editar carro" : "Cadastrar carro"}
            </h2>

            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Campo rotulo="Marca">
                  <input
                    required
                    value={rascunho.marca}
                    onChange={(e) => setRascunho({ ...rascunho, marca: e.target.value })}
                    className={entrada}
                    style={{ border: "1px solid var(--linha)" }}
                  />
                </Campo>
                <Campo rotulo="Modelo">
                  <input
                    required
                    value={rascunho.modelo}
                    onChange={(e) => setRascunho({ ...rascunho, modelo: e.target.value })}
                    className={entrada}
                    style={{ border: "1px solid var(--linha)" }}
                  />
                </Campo>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo rotulo="Versão">
                  <input
                    value={rascunho.versao}
                    onChange={(e) => setRascunho({ ...rascunho, versao: e.target.value })}
                    className={entrada}
                    style={{ border: "1px solid var(--linha)" }}
                  />
                </Campo>
                <Campo rotulo="Ano" dica="Como no anúncio: 2023 ou 22/23">
                  <input
                    required
                    value={rascunho.ano}
                    onChange={(e) => setRascunho({ ...rascunho, ano: e.target.value })}
                    className={entrada}
                    style={{ border: "1px solid var(--linha)" }}
                  />
                </Campo>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo rotulo="Motor" dica="Exemplo: 2.0 Turbo">
                  <input
                    value={rascunho.motor}
                    onChange={(e) => setRascunho({ ...rascunho, motor: e.target.value })}
                    className={entrada}
                    style={{ border: "1px solid var(--linha)" }}
                  />
                </Campo>
                <Campo rotulo="Potência em cv">
                  <input
                    type="number"
                    min={0}
                    value={rascunho.potencia || ""}
                    onChange={(e) =>
                      setRascunho({ ...rascunho, potencia: Number(e.target.value) })
                    }
                    className={entrada}
                    style={{ border: "1px solid var(--linha)" }}
                  />
                </Campo>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                {[
                  { r: "Combustível", v: rascunho.combustivel, o: COMBUSTIVEIS, k: "combustivel" },
                  { r: "Câmbio", v: rascunho.cambio, o: CAMBIOS, k: "cambio" },
                  { r: "Tração", v: rascunho.tracao, o: TRACOES, k: "tracao" },
                ].map((s) => (
                  <Campo key={s.k} rotulo={s.r}>
                    <select
                      value={s.v}
                      onChange={(e) => setRascunho({ ...rascunho, [s.k]: e.target.value })}
                      className={entrada}
                      style={{ border: "1px solid var(--linha)", color: "var(--tinta)" }}
                    >
                      {s.o.map((op) => (
                        <option key={op} value={op} style={{ background: "var(--branco)" }}>
                          {op}
                        </option>
                      ))}
                    </select>
                  </Campo>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Campo rotulo="Quilometragem">
                  <input
                    type="number"
                    min={0}
                    value={rascunho.km || ""}
                    onChange={(e) => setRascunho({ ...rascunho, km: Number(e.target.value) })}
                    className={entrada}
                    style={{ border: "1px solid var(--linha)" }}
                  />
                </Campo>
                <Campo rotulo="Preço em reais" dica="Só números, sem ponto">
                  <input
                    type="number"
                    min={0}
                    required
                    value={rascunho.preco || ""}
                    onChange={(e) => setRascunho({ ...rascunho, preco: Number(e.target.value) })}
                    className={entrada}
                    style={{ border: "1px solid var(--linha)" }}
                  />
                </Campo>
              </div>

              <Campo rotulo="Itens do carro" dica="Um por linha">
                <textarea
                  rows={5}
                  value={destaquesTexto}
                  onChange={(e) =>
                    setRascunho({
                      ...rascunho,
                      destaques: e.target.value.split("\n").filter((l) => l.trim()),
                    })
                  }
                  className={entrada}
                  style={{ border: "1px solid var(--linha)", resize: "vertical" }}
                />
              </Campo>

              <Campo
                rotulo="Foto do estúdio"
                dica="A foto é reduzida para no máximo 1440 px de largura e nunca é ampliada."
              >
                <input
                  ref={arquivoRef}
                  type="file"
                  accept="image/*"
                  onChange={aoEscolherFoto}
                  className="w-full text-[0.78rem]"
                  style={{ color: "var(--tinta-2)" }}
                />
              </Campo>

              {previa ? (
                <img
                  src={previa}
                  alt="Prévia da foto escolhida"
                  className="h-56 w-auto object-contain"
                  style={{ background: "var(--nuvem)" }}
                />
              ) : null}

              {erro ? (
                <p role="alert" className="text-[0.78rem]" style={{ color: "#e8896a" }}>
                  {erro}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="submit"
                  className="px-6 py-3.5 text-[0.72rem] uppercase tracking-[0.14em]"
                  style={{ background: "var(--tinta)", color: "var(--branco)", fontWeight: 500 }}
                >
                  {editando ? "Salvar alterações" : "Cadastrar no estoque"}
                </button>
                {editando ? (
                  <button
                    type="button"
                    onClick={limpar}
                    className="px-6 py-3.5 text-[0.72rem] uppercase tracking-[0.14em]"
                    style={{ border: "1px solid var(--linha)", color: "var(--tinta-2)" }}
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </div>
          </form>

          {/* ---------------------------------------------------------- lista */}
          <section aria-labelledby="lista-estoque">
            <h2 id="lista-estoque" className="display-leve mb-7 text-[1.15rem]">
              No estoque {lista ? `(${lista.length})` : ""}
            </h2>

            {lista === null ? (
              <p className="corpo text-[0.88rem]">Carregando o estoque.</p>
            ) : lista.length === 0 ? (
              <p className="corpo text-[0.88rem]">
                Nenhum carro cadastrado ainda. Preencha o formulário ao lado
                para o primeiro entrar na página de estoque.
              </p>
            ) : (
              <ul>
                {lista.map((c) => (
                  <li
                    key={c.slug}
                    className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-4 border-t py-4"
                    style={{ borderColor: "var(--linha)" }}
                  >
                    <LinhaFoto carro={c} />
                    <div className="min-w-0">
                      <p className="display-leve truncate text-[0.95rem]">
                        {c.marca} {c.modelo} {c.versao}
                      </p>
                      <p className="text-[0.7rem]" style={{ color: "var(--tinta-3)" }}>
                        {c.ano} · {km(c.km)} · {brl(c.preco)}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => editar(c)}
                        className="text-[0.68rem] uppercase tracking-[0.12em]"
                        style={{ color: "var(--tinta)" }}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => remover(c)}
                        className="text-[0.68rem] uppercase tracking-[0.12em]"
                        style={{ color: "var(--tinta-3)" }}
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function LinhaFoto({ carro }: { carro: CarroSalvo }) {
  const [src, setSrc] = useState(
    carro.fotoEnviada || !carro.foto ? "" : `/images/${carro.foto}-0c-1000.webp`,
  );
  useEffect(() => {
    if (!carro.fotoEnviada) return;
    let vivo = true;
    lerFoto(carro.fotoEnviada).then((d) => {
      if (vivo && d) setSrc(d);
    });
    return () => {
      vivo = false;
    };
  }, [carro.fotoEnviada]);

  return (
    <span
      className="block h-16 w-[4.5rem] overflow-hidden"
      style={{ background: "var(--nuvem)" }}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span
          className="etiqueta flex h-full w-full items-center justify-center text-center text-[0.5rem] leading-tight"
          style={{ letterSpacing: "0.1em" }}
        >
          Sem foto
        </span>
      )}
    </span>
  );
}
