import { EQUIPE, whatsapp } from "@/lib/contato";
import type { Carro } from "@/lib/carros";
import { km } from "@/lib/fmt";

/**
 * Comprar de outro estado.
 *
 * Os passos aqui são só o que dá para confirmar nas fontes: eles vendem,
 * compram, aceitam consignação, fazem financiamento e entregam no Brasil
 * inteiro, e têm gente com nome e número para vendas e para financiamento.
 * Nada de laudo, prazo ou garantia inventados para a seção parecer mais cheia.
 *
 * Os números do painel são calculados do próprio estoque. Quando o estoque
 * muda, eles mudam junto, e por isso não têm como virar mentira.
 */

const SERVICOS = ["Compra", "Venda", "Consignação", "Financiamento", "Consultoria"];

export default function SecaoDistancia({ carros }: { carros: Carro[] }) {
  const marcas = new Set(carros.map((c) => c.marca)).size;
  const eletrificados = carros.filter((c) =>
    c.combustivel.toLowerCase().includes("híbrido"),
  ).length;
  const menorKm = Math.min(...carros.map((c) => c.km));
  const maiorCv = Math.max(...carros.map((c) => c.potencia));

  const numeros = [
    { k: "Marcas no estoque", v: String(marcas) },
    { k: "Híbridos", v: String(eletrificados) },
    { k: "Menor rodagem", v: km(menorKm) },
    { k: "Mais potente", v: `${maiorCv} cv` },
  ];

  const passos = [
    {
      n: "01",
      t: "Escolhe o carro",
      d: "O estoque do site é o estoque real, com ano, quilometragem, motor e preço de cada um.",
    },
    {
      n: "02",
      t: "Pede mais do que a foto",
      d: `${EQUIPE[0].nome} atende no WhatsApp e manda vídeo, detalhe e o que mais você quiser ver antes de decidir.`,
    },
    {
      n: "03",
      t: "Resolve o pagamento",
      d: `${EQUIPE[1].nome} cuida da parte de financiamento bancário. Também trabalhamos com consignação e compra do seu usado.`,
    },
    {
      n: "04",
      t: "Recebe onde você está",
      d: "A entrega vai para todo o Brasil. Combinamos o envio junto com o fechamento.",
    },
  ];

  return (
    <section id="distancia" className="secao" style={{ background: "var(--fumaca)" }}>
      <div className="casca">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="etiqueta mb-5">Comprar de longe</p>
            <h2
              className="display mb-7 text-[clamp(2rem,4.6vw,3.6rem)]"
              data-revela="sobe"
            >
              A maioria dos nossos clientes nunca pisou na loja
            </h2>
            <p className="corpo mb-9 max-w-[44ch]" data-revela="sobe">
              São 382 mil pessoas acompanhando o estoque pelo Instagram, de todos
              os estados. Quem fecha de longe precisa de duas coisas: foto que não
              esconde nada e uma pessoa com nome do outro lado da conversa.
            </p>

            <ul className="flex flex-wrap gap-x-2 gap-y-2" data-revela="sobe">
              {SERVICOS.map((s) => (
                <li
                  key={s}
                  className="dado px-3.5 py-2 text-[0.68rem] uppercase tracking-[0.12em]"
                  style={{
                    border: "1px solid var(--linha)",
                    color: "var(--tinta-2)",
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ol className="mb-14">
              {passos.map((p) => (
                <li
                  key={p.n}
                  data-revela="sobe"
                  className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 border-t py-7 md:gap-x-10 md:py-8"
                  style={{ borderColor: "var(--linha)" }}
                >
                  <span
                    className="dado pt-1 text-[0.72rem]"
                    style={{ color: "var(--latao)" }}
                  >
                    {p.n}
                  </span>
                  <div>
                    <h3 className="display-solto mb-2.5 text-[clamp(1.15rem,2vw,1.6rem)]">
                      {p.t}
                    </h3>
                    <p className="corpo max-w-[50ch] text-[0.98rem]">{p.d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div
              className="grid grid-cols-2 gap-x-6 gap-y-8 border-t pt-8 md:grid-cols-4"
              style={{ borderColor: "var(--linha)" }}
              data-revela="sobe"
            >
              {numeros.map((n) => (
                <div key={n.k}>
                  <p className="dado mb-1.5 text-[clamp(1.3rem,2.4vw,2rem)]">{n.v}</p>
                  <p className="etiqueta">{n.k}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {EQUIPE.slice(0, 2).map((p) => (
                <a
                  key={p.e164}
                  href={whatsapp(
                    `Olá, ${p.nome}! Vim pelo site e queria falar sobre ${p.papel === "Financiamento" ? "financiamento" : "um carro do estoque"}.`,
                    p.e164,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <span className="etiqueta mb-1.5 block">{p.papel}</span>
                  <span className="display-solto block text-[1.1rem]">
                    {p.nome}{" "}
                    <span
                      className="dado text-[0.75rem] transition-colors duration-200 group-hover:text-[var(--latao)]"
                      style={{ color: "var(--tinta-3)" }}
                    >
                      {p.exibicao}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
