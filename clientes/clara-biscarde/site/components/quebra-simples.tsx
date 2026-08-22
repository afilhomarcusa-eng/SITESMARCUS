/**
 * Quebra entre seções: um fio fino em oliva com o peão da marca girando no
 * meio.
 *
 * A faixa com a lista de informações roda uma vez só, logo depois da capa.
 * Repetir os mesmos três dados em toda quebra cansava e tirava o efeito de
 * quem lê pela primeira vez. Daqui em diante a quebra é só respiro.
 *
 * Não precisa de "use client": o giro é a classe .peao-gira, do globals.css,
 * e o bloco de prefers-reduced-motion de lá já congela ele sozinho.
 */

import Image from "next/image";

export function QuebraSimples() {
  return (
    <div className="flex justify-center py-9 md:py-12">
      <div className="flex w-full max-w-[26rem] items-center md:max-w-[32rem]">
        <span aria-hidden className="h-px flex-1 bg-oliva/45" />
        <Image
          src="/marca.png"
          alt=""
          aria-hidden
          width={429}
          height={564}
          sizes="40px"
          className="peao-gira mx-5 h-7 w-auto"
        />
        <span aria-hidden className="h-px flex-1 bg-oliva/45" />
      </div>
    </div>
  );
}
