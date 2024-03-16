import { createTRPCRouter } from "../trpc";
import { fooRouter } from "./foo";

export const router = createTRPCRouter({
  foo: fooRouter,
});

export type AppRouter = typeof router;
