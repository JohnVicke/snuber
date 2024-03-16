import type { InferSelectModel, schema } from "@snuber/db";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";

import type { DbClient } from "~/db";

interface LuciaConfig {
  client: DbClient;
  secure: boolean;
}

export function createLucia(config: LuciaConfig) {
  const adapter = new LibSQLAdapter(config.client, {
    user: "user",
    session: "session",
  });

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: config.secure,
      },
    },
    getUserAttributes: (attributes) => {
      return attributes;
    },
  });
}

export type DatabaseUser = Omit<
  InferSelectModel<(typeof schema)["users"]>,
  "id"
>;

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof createLucia>;
    DatabaseUserAttributes: DatabaseUser;
  }
}
