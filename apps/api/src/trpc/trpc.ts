import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import type { Context } from "./context";

export const t = initTRPC.context<Context>().create({ transformer: superjson });

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const auth = t.middleware(({ next, ctx }) => {
  return next({
    ctx,
  });
});
