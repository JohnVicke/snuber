import { createTRPCRouter, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  signout: protectedProcedure.mutation(async ({ ctx }) => {
    const {
      session,
      auth: { lucia },
    } = ctx;
    await lucia.invalidateSession(session.id);
    return { ok: true };
  }),
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
