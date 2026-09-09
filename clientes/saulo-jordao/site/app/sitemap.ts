import type { MetadataRoute } from "next";
import { lerEstoque } from "@/lib/banco";
import { SITE } from "./layout";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();
  const carros = await lerEstoque();
  return [
    { url: SITE, lastModified: agora, priority: 1 },
    { url: `${SITE}/estoque`, lastModified: agora, priority: 0.9 },
    { url: `${SITE}/procuro`, lastModified: agora, priority: 0.7 },
    { url: `${SITE}/vender`, lastModified: agora, priority: 0.7 },
    ...carros.map((c) => ({
      url: `${SITE}/estoque/${c.slug}`,
      lastModified: agora,
      priority: 0.8,
    })),
  ];
}
