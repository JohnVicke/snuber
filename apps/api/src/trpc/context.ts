import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Session, User } from "lucia";
import { createDrizzle, createLibSqlClient } from "@snuber/db";

import type { Env } from "~/worker";

export function createContext({
  req,
  resHeaders,
  env,
}: FetchCreateContextFnOptions & { env: Env; ctx: ExecutionContext }) {
  const db = initDb({
    connectionType: "remote",
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  return createInnerContext({ db, session: null, user: null });
}

export type Context = Awaited<ReturnType<typeof createContext>>;

type CreateInnerContextOptions = { db: Database } & (
  | {
      session: Session;
      user: User;
    }
  | {
      session: null;
      user: null;
    }
);

export function createInnerContext(opts: CreateInnerContextOptions) {
  return opts;
}

export function initDb(opts: Parameters<typeof createLibSqlClient>[0]) {
  return createDrizzle({ client: createLibSqlClient(opts) });
}

type Database = ReturnType<typeof initDb>;
