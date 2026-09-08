import type { MetadataRoute } from "next";
import { CARROS } from "@/lib/estoque";
import { SITE } from "./layout";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: SITE, lastModified: agora, priority: 1 },
    { url: `${SITE}/estoque`, lastModified: agora, priority: 0.9 },
    { url: `${SITE}/procuro`, lastModified: agora, priority: 0.7 },
    { url: `${SITE}/vender`, lastModified: agora, priority: 0.7 },
    ...CARROS.map((c) => ({
      url: `${SITE}/estoque/${c.slug}`,
      lastModified: agora,
      priority: 0.8,
    })),
  ];
}
