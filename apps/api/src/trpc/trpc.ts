import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import type { TRPCContext } from "./context";

export const t = initTRPC
  .context<TRPCContext>()
  .create({ transformer: superjson });

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const auth = t.middleware(({ next, ctx }) => {
  if (!ctx.user || !ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx,
  });
});
