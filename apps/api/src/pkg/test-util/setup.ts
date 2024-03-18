import * as path from "path";
import { migrate, sql } from "@snuber/db";
import { beforeAll, beforeEach } from "vitest";

import { testDb } from "./test-db";

beforeAll(async () => {
  await migrate(
    testDb,
    path.resolve(__dirname, "../../../../../packages/db/drizzle"),
  );
});

beforeEach(async () => {
  await reset();
});

async function reset() {
  const tableSchema = testDb._.schema;
  if (!tableSchema) {
    throw new Error("No table schema found");
  }

  const queries = Object.values(tableSchema).map((table) => {
    return sql.raw(`DELETE FROM ${table.dbName};`);
  });

  await testDb.transaction(async (tx) => {
    await Promise.all(
      queries.map(async (query) => {
        if (query) await tx.run(query);
      }),
    );
  });

  console.log("✅ Database emptied");
}
