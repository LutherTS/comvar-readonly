import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "source/library/index.js",
  outDir: "tsdown",
  dts: false,
  minify: true,
});
