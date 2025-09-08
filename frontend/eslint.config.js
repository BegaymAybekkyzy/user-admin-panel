import js from "@eslint/js";
import globals from "globals";
import css from "@eslint/css";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["node_modules"] },

  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
    plugins: { js, prettier: pluginPrettier },
    extends: [js.configs.recommended, prettier],
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 80,
          tabWidth: 2,
        },
      ],
      semi: ["error", "always"],
      "react-hooks/exhaustive-deps": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      "prefer-const": [
        "error",
        {
          destructuring: "all",
          ignoreReadBeforeAssign: false
        }
      ],
      "import/extensions": ["error", "ignorePackages", {
        "js": "always",
        "json": "always"
      }],
      "eqeqeq": ["error", "always"],
      "no-trailing-spaces": "error",
      "keyword-spacing": ["error", { before: true, after: true }],
    },
  },

  {
    files: ["**/*.css"],
    language: "css/css",
    plugins: { css },
    extends: ["css/recommended"],
  },
]);
