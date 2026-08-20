import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Curva única do projeto. Nunca linear, nunca ease padrão. */
export const curva = [0.16, 1, 0.3, 1] as const;
