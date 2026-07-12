import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
  },
  ignorePatterns: ["tsdown/library/index.mjs", "plugin/tsdown/index.cjs"],
  overrides: [
    {
      files: ["source/typedefs/index.js"],
      rules: {
        "eslint/no-unused-vars": "off",
      },
    },
  ],
});
