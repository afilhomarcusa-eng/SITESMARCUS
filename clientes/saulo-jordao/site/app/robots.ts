import type { MetadataRoute } from "next";
import { SITE } from "./layout";

/**
 * Enquanto o endereço for link de aprovação do cliente, nada entra no índice.
 * No dia em que o domínio próprio subir, isto vira allow e o `robots` do
 * layout vira index: true. São os dois lugares, e só eles.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
