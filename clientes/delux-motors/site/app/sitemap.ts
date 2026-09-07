import type { MetadataRoute } from "next";
import { CARROS_INICIAIS } from "@/lib/carros";

const SITE = "https://deluxmotors.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/estoque`, changeFrequency: "daily", priority: 0.9 },
    ...CARROS_INICIAIS.map((c) => ({
      url: `${SITE}/estoque/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
