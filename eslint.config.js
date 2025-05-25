export default [
  {
    files: ["eslint.config.js"],
    ignores: [
      "**/*.js",
      "**/*.jsx",
      "**/*.ts",
      "**/*.tsx",
      "**/*.astro",
      "**/*.d.ts",
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {},
  },
  {
    ignores: ["**"],
  },
];
