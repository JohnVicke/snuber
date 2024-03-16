import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["./test/integration/**", "./test/routes/**"],
    reporters: ["html", "verbose"],
    outputFile: "./.vitest/html",
    alias: {
      "~/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
