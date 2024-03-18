import { createDrizzle, createLibSqlClient } from "@snuber/db";

export const testDbclient = createLibSqlClient({
  connectionType: "local",
  url: "file:test.sqlite",
});

export const testDb = createDrizzle({ client: testDbclient });
