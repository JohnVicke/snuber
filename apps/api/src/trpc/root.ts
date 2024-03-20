import { authRouter } from "./routers/auth";
import { fooRouter } from "./routers/foo";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  foo: fooRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
