const { defineConfig } = require("tsdown");

module.exports = defineConfig({
  entry: "index.js",
  outDir: "tsdown",
  dts: false,
  minify: true,
  format: "cjs",
});
