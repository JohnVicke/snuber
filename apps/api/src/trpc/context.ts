import type { Database } from "@snuber/db";
import type { Context } from "hono";
import type { Session, User } from "lucia";

import type { HonoEnv } from "../app";

export function createSnuberTRPCContext({ ctx }: { ctx: Context<HonoEnv> }) {
  const { db } = ctx.get("services");
  const auth = ctx.req.header("Authorization");
  const source = ctx.req.header("x-trpc-source");
  console.log({ auth, source });
  return createInnerSnuberTRPCContext({ db, session: null, user: null });
}

export type SnuberTRPCContext = ReturnType<typeof createSnuberTRPCContext>;

type CreateInnerSnuberContextOptions = { db: Database } & (
  | {
      session: Session;
      user: User;
    }
  | {
      session: null;
      user: null;
    }
);

export function createInnerSnuberTRPCContext(
  opts: CreateInnerSnuberContextOptions,
) {
  return opts;
}
