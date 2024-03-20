import type { Context } from "hono";
import type { Session, User } from "lucia";

import type { HonoEnv, ServicesContext } from "../app";

export async function createSnuberTRPCContext({
  ctx,
}: {
  ctx: Context<HonoEnv>;
}) {
  const services = ctx.get("services");
  const {
    auth: { lucia },
  } = services;
  const bearer = ctx.req.header("Authorization");
  const source = ctx.req.header("x-trpc-source");

  const token = bearer?.replace("Bearer ", "");

  const result = token
    ? await lucia.validateSession(token)
    : { user: null, session: null };
  return createInnerSnuberTRPCContext({ source, ...services, ...result });
}

export type SnuberTRPCContext = Awaited<
  ReturnType<typeof createSnuberTRPCContext>
>;

type CreateInnerSnuberContextOptions = ServicesContext &
  (
    | {
        session: Session;
        user: User;
      }
    | {
        session: null;
        user: null;
      }
  ) & {
    source?: string;
  };

export function createInnerSnuberTRPCContext(
  opts: CreateInnerSnuberContextOptions,
) {
  return opts;
}
