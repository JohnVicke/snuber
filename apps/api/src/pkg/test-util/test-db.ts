import { createDrizzle, createLibSqlClient } from "@snuber/db";

export const testDbClient = createLibSqlClient({
  connectionType: "local",
  url: "file:test.sqlite",
});

export const testDB = createDrizzle({ client: testDbClient });
