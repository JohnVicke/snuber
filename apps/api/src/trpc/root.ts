import { fooRouter } from "./routers/foo";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  foo: fooRouter,
});

export type AppRouter = typeof appRouter;
