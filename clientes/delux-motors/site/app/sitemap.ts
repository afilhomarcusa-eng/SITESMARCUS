import type { MetadataRoute } from "next";
import { CARROS_INICIAIS } from "@/lib/carros";
import { FORMULARIOS } from "@/lib/formularios";

const SITE = "https://deluxmotors.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/estoque`, changeFrequency: "daily", priority: 0.9 },
    // Um formulário por serviço, cada um com a própria página, porque cada
    // um responde a uma busca diferente no Google.
    ...FORMULARIOS.map((f) => ({
      url: `${SITE}${f.rota}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...CARROS_INICIAIS.map((c) => ({
      url: `${SITE}/estoque/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
