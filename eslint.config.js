import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  // Base JS recommended rules
  js.configs.recommended,

  // Astro recommended config
  ...astro.configs.recommended,

  // Global ignores
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      "*.min.js",
      "public/sw.js",
      ".archived/**",
      "contrast-report.json",
      "translation-report.json",
    ],
  },

  // JavaScript files (pure vanilla JS — no React/JSX in this project)
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },

  // TypeScript files
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },

  // Scripts files - more lenient
  {
    files: ["scripts/**/*.js"],
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];
