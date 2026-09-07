import type { MetadataRoute } from "next";
import { CARROS_INICIAIS } from "@/lib/carros";

const SITE = "https://usadosdeluxo.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    ...CARROS_INICIAIS.map((c) => ({
      url: `${SITE}/estoque/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
