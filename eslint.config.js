import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginQuery from "@tanstack/eslint-plugin-query";
import eslintPluginSolid from "eslint-plugin-solid";

export default defineConfig([
  // Базовые настройки
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["tsconfig.app.json"], // Использует tsconfig.json
        jsxPragma: "h", // Solid.js использует JSX, но не React
      },
    },
  },

  // Рекомендуемые правила ESLint
  js.configs.recommended,

  // Рекомендуемые правила TypeScript
  ...tseslint.configs.recommended,
  // Плагин Solid.js
  {
    plugins: {
      solid: eslintPluginSolid,
    },
    rules: {
      ...eslintPluginSolid.configs.typescript.rules,
      // Дополнительные правила Solid.js
      "solid/reactivity": "warn",
      "solid/no-destructure": "warn",
      "solid/jsx-no-undef": "error",
      // Отключаем конфликтующие правила
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },

  ...pluginQuery.configs["flat/recommended"],
]);
