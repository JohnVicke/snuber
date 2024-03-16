import { defineConfig } from "tsup";

export default defineConfig((opts) => ({
  clean: !opts.watch,
  dts: true,
  format: ["esm"],
  minify: true,
  outDir: "dist",
  entry: ["./src/index.ts"],
}));
