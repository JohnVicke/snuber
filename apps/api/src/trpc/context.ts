import type { Database } from "@snuber/db";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Session, User } from "lucia";

import type { ServicesContext } from "~/app";

export function createTRPCContext({
  services: { db },
  req: _req,
  resHeaders: _resHeaders,
}: FetchCreateContextFnOptions & { services: ServicesContext }) {
  return createInnerTRPCContext({ db, session: null, user: null });
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

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

export function createInnerTRPCContext(opts: CreateInnerContextOptions) {
  return opts;
}
