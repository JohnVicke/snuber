import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: ["html", "verbose"],
    outputFile: "./.vitest/html",
    alias: {
      "~/": new URL("./src/", import.meta.url).pathname,
    },
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    testTimeout: 60_000,
    setupFiles: ["./src/pkg/test-util/setup.ts"],
  },
});
