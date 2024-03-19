import { createClient } from "@libsql/client";
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
  logger?: boolean;
}

export const createDrizzle = ({
  logger = false,
  client,
}: CreateDrizzleOptions) => {
  return drizzle(client, {
    schema,
    logger,
  });
};

export * as schema from "./schema";

export * from "drizzle-orm";

export type Database = ReturnType<typeof createDrizzle>;
export type LibSQLClient = ReturnType<typeof createLibSqlClient>;

export function migrate(db: Database, migrationsFolder: string) {
  return drizzleMigrate(db, { migrationsFolder });
}
