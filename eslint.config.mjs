import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Disables ESLint rules that conflict with Prettier — must come last.
  prettier,
  // StockFlow custom rules.
  {
    rules: {
      // Forbid direct process.env access. All env reads must go through
      // src/lib/env.ts (validated Zod schema). See Projects/StockFlow/Environment.md
      "no-process-env": "error",
    },
  },
  // Allow process.env only in the env validation module itself.
  {
    files: ["src/lib/env.ts"],
    rules: {
      "no-process-env": "off",
    },
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
