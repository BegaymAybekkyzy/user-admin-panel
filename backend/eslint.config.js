import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    ignores: ["eslint.config.js"],
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    extends: [js.configs.recommended],
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      eqeqeq: ["error", "always"],
      "no-multi-spaces": "error",
      "no-unreachable": "error",
      "no-redeclare": "error",
      "valid-typeof": "error",
      "no-undef": "error",
      "no-unused-vars": ["error", { args: "none" }],
      "prefer-const": "error",
      "import/no-unresolved": "error",
      "import/named": "error",
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: true,
          trailingComma: "all",
          printWidth: 80,
          tabWidth: 2,
        },
      ],
    },
  },
  {
    files: ["**/*.json"],
    language: "json/json",
    extends: [json.configs.recommended],
  },
]);
