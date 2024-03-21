import { authRouter } from "./routers/auth";
import { emergencyRouter } from "./routers/emergency";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  emergency: emergencyRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
