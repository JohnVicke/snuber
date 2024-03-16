import path from "path";
import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { migrate as drizzleMigrate } from "drizzle-orm/libsql/migrator";

import * as schema from "./schema";

interface DbClientOptionsBase {
  connectionType: string;
  url: string;
}

interface LocalDbClientOptions extends DbClientOptionsBase {
  connectionType: "local";
}

interface RemoteDbClientOptions extends DbClientOptionsBase {
  connectionType: "remote";
  authToken: string;
}

interface LocalReplicaDbClientOptions extends DbClientOptionsBase {
  connectionType: "local-replica";
  syncUrl: string;
  authToken: string;
}

export type CreateLibSqlClientOptions =
  | LocalDbClientOptions
  | RemoteDbClientOptions
  | LocalReplicaDbClientOptions;

/**
 * @example Configuration
  local: {
      url: "file:local.sqlite",
    
    }
    remote: {
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    }


    "local-replica": {
      url: "file:local.sqlite",
      syncUrl: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    }

**/
export const createLibSqlClient = (options: CreateLibSqlClientOptions) => {
  const client = createClient(options);
  if (options.connectionType === "local-replica") {
    void client.sync();
  }
  return client;
};

export interface CreateDrizzleOptions {
  client: ReturnType<typeof createLibSqlClient>;
}

export const createDrizzle = (options: CreateDrizzleOptions) => {
  return drizzle(options.client, { schema, logger: true });
};

export * as schema from "./schema";

export * from "drizzle-orm";

export type Database = ReturnType<typeof createDrizzle>;

export function migrate(db: Database) {
  const root = path.resolve(__dirname, "..");
  return drizzleMigrate(db, { migrationsFolder: `${root}/drizzle` });
}

export async function clearDb(db: Database) {
  const query = sql<string>`SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE';
    `;

  const tables = await db.execute(query);

  for (const table of tables) {
    const query = sql.raw(`TRUNCATE TABLE ${table.table_name} CASCADE;`);
    await db.execute(query);
  }
}
