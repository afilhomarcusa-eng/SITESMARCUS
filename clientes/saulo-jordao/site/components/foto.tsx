import type { Foto } from "@/lib/tipos";

/**
 * Um retrato.
 *
 * É o único lugar do site que desenha foto de carro, e serve tanto para as que
 * o pipeline gerou na máquina quanto para as que o Saulo subiu em /admin. Duas
 * origens, um caminho só: se fossem dois, um deles ia envelhecer sem ninguém
 * perceber.
 *
 * A dimensão da origem viaja no `data-nativa`. Não é enfeite: é com ela que o
 * QA cobra a lei da resolução em cima da página desenhada, inclusive nas fotos
 * que vieram do banco e que nenhum manifesto local conhece.
 */
export default function FotoCarro({
  foto,
  alt,
  sizes,
  prioridade = false,
  className,
}: {
  foto: Foto;
  alt: string;
  sizes: string;
  prioridade?: boolean;
  className?: string;
}) {
  const fontes = [...foto.fontes].sort((a, b) => a.w - b.w);
  const menor = fontes[0];

  return (
    <img
      className={className}
      src={menor.url}
      srcSet={fontes.map((f) => `${f.url} ${f.w}w`).join(", ")}
      sizes={sizes}
      /* Proporção fixa, para a caixa nascer com o tamanho certo e a página não
         pular quando a foto chega. */
      width={300}
      height={400}
      alt={alt}
      loading={prioridade ? "eager" : "lazy"}
      fetchPriority={prioridade ? "high" : "auto"}
      decoding="async"
      data-nativa={`${foto.nativa.w}x${foto.nativa.h}`}
    />
  );
}
