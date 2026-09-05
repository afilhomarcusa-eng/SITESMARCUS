import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".art-direction/**", ".next/**", ".vercel/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
