import { createDrizzle, createLibSqlClient } from "@snuber/db";

interface Connectionoptions {
  url: string;
  authToken: string;
}

export function createConnection(options: Connectionoptions) {
  const client = createLibSqlClient({
    connectionType: "remote",
    url: options.url,
    authToken: options.authToken,
  });
  return { client, db: createDrizzle({ client }) };
}

export type Database = ReturnType<typeof createConnection>["db"];
export type DbClient = ReturnType<typeof createConnection>["client"];
