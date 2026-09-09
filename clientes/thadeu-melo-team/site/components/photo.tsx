import Image from "next/image";
import type { Photo } from "@/lib/content";

// Todo retrato do site passa por aqui. Centralizar isso é o que garante que
// nenhuma foto seja pedida acima do arquivo que existe: `sizes` é obrigatório,
// e a legenda vem do próprio arquivo, não escrita de novo em cada seção.
export function Frame({ photo, sizes, className = "", caption = true, priority = false, reveal, ariaHidden }: {
  photo: Photo;
  sizes: string;
  className?: string;
  caption?: boolean;
  priority?: boolean;
  reveal?: "frame";
  ariaHidden?: boolean;
}) {
  return <figure className={"frame " + className} data-reveal={reveal} aria-hidden={ariaHidden}>
    <Image src={photo.src} alt={photo.alt} width={photo.w} height={photo.h} sizes={sizes}
      priority={priority} loading={priority ? undefined : "lazy"} quality={90} />
    {caption && photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
  </figure>;
}
