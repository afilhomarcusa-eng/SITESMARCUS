import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return url ? [
    { url, changeFrequency: "monthly", priority: 1 },
    { url: url + "/cadastro", changeFrequency: "monthly", priority: 0.8 },
  ] : [];
}
