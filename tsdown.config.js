import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "source/library/index.js",
  outDir: "tsdown/library",
  dts: false,
  minify: true,
});
