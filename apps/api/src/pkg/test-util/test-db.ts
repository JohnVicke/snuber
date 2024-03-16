import { initDb } from "~/trpc/context";

export const testDb = initDb({
  connectionType: "local",
  url: "file:test.sqlite",
});
