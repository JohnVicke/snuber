import { and, eq, not, schema } from "@snuber/db";
import { EmergencyRequestInsert } from "@snuber/schemas";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const emergencyRouter = createTRPCRouter({
  send: protectedProcedure
    .input(EmergencyRequestInsert)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.emergencyRequest.findFirst({
        where: and(
          not(eq(schema.emergencyRequest.status, "completed")),
          eq(schema.emergencyRequest.userId, ctx.user.id),
        ),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
        });
      }

      const inserted = await ctx.db
        .insert(schema.emergencyRequest)
        .values({
          id: ctx.generateId(15),
          createdAt: Date.now(),
          status: "pending",
          userId: ctx.user.id,
          latitude: input.latitude,
          longitude: input.longitude,
          accuracy: input?.accuracy,
        })
        .returning();

      if (!inserted?.[0]) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return inserted?.[0];
    }),
});
