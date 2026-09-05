import { fotosUnidades } from "@/lib/fotos-unidades";

export function FotoUnidade({ slug, alt, principal = false }: { slug: string; alt: string; principal?: boolean }) {
  const foto = fotosUnidades[slug];
  if (!foto) return null;
  return <img
    src={foto.src}
    srcSet={foto.srcSet}
    sizes={principal ? "(max-width: 640px) 100vw, (max-width: 1740px) 92vw, 1600px" : "(max-width: 640px) 45vw, (max-width: 1024px) 44vw, 380px"}
    width={foto.width}
    height={foto.height}
    alt={alt}
    loading={principal ? "eager" : "lazy"}
    fetchPriority={principal ? "high" : "auto"}
    decoding="async"
    style={{ objectPosition: foto.position }}
  />;
}