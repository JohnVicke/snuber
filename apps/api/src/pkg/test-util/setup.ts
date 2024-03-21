import * as path from "path";
import { migrate, sql } from "@snuber/db";
import { beforeAll, beforeEach } from "vitest";

import { testDB } from "./test-db";

beforeAll(async () => {
  await migrate(
    testDB,
    path.resolve(__dirname, "../../../../../packages/db/drizzle"),
  );
});

beforeEach(async () => {
  await reset();
});

async function reset() {
  const tableSchema = testDB._.schema;
  if (!tableSchema) {
    throw new Error("No table schema found");
  }

  const queries = Object.values(tableSchema).map((table) => {
    return sql.raw(`DELETE FROM ${table.dbName};`);
  });

  await testDB.transaction(async (tx) => {
    await Promise.all(
      queries.map(async (query) => {
        if (query) await tx.run(query);
      }),
    );
  });

  console.log("✅ Database emptied");
}
