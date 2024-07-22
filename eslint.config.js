import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  pluginPrettier,
  {
    plugins: {
      "@tanstack/query": pluginQuery
    },
    rules: {
      // tanstack query config
      "@tanstack/query/exhaustive-deps": "error",
      "@tanstack/query/stable-query-client": "error",
      "@tanstack/query/no-rest-destructuring": "error",

      //
      "vue/html-self-closing": "off",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
]);
