import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    /**
     * O <img> aqui é escolha, não descuido.
     *
     * Quem recorta e redimensiona é scripts/build-assets.mjs, que grava a
     * dimensão nativa de cada origem no manifesto. É contra esse manifesto que
     * o QA cobra a lei da resolução. Passar as fotos pelo next/image devolveria
     * o corte para o servidor de imagem e deixaria a lei sem o que conferir.
     */
    files: ["components/**/*.tsx", "app/**/*.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
