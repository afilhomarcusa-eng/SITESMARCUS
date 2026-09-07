import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "qa/**",
  ]),
  {
    rules: {
      /**
       * Este projeto usa <img> de propósito, não por descuido.
       *
       * As imagens são geradas por scripts/build-assets.mjs em larguras exatas,
       * medidas dos slots reais do layout, e cada arquivo é registrado num
       * manifesto com a dimensão nativa da origem. O portão de QA compara a
       * caixa desenhada na tela contra essa dimensão nativa, que é o único jeito
       * de pegar um pipeline que amplia a foto.
       *
       * Passar por cima disso com next/image entregaria o controle da largura
       * final ao otimizador e deixaria a verificação sem chão para medir.
       */
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
