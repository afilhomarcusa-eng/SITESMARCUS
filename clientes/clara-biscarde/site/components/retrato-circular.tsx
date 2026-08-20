/**
 * Retrato em círculo perfeito. Contraste real contra a mancha orgânica
 * (.folha/.folha-alt) já usada em outras seções — aqui não é o mesmo blob,
 * é moldura redonda de verdade, tipo retrato de perfil.
 *
 * Sem "use client": é só apresentação, compõe normalmente dentro da árvore
 * de Server Component de app/page.tsx.
 */

import Image from "next/image";
import { cn } from "@/lib/utils";

interface RetratoCircularProps {
  src: string;
  alt: string;
  /** Lado do anel de destaque, deslocado para o lado oposto ao retrato. */
  lado?: "esquerda" | "direita";
  className?: string;
}

export function RetratoCircular({
  src,
  alt,
  lado = "direita",
  className,
}: RetratoCircularProps) {
  return (
    <div
      className={cn("relative aspect-square h-64 w-64 md:h-80 md:w-80", className)}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-full border-2 border-oliva-apoio/50",
          lado === "esquerda"
            ? "-translate-x-3 -translate-y-3"
            : "translate-x-3 -translate-y-3"
        )}
      />
      <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-creme shadow-[0_10px_30px_rgba(46,43,33,0.18)]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 20rem, 60vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
