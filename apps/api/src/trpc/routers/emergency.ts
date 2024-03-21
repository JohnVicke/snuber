import { schema } from "@snuber/db";
import { EmergencyRequestInsert } from "@snuber/schemas";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const emergencyRouter = createTRPCRouter({
  send: protectedProcedure
    .input(EmergencyRequestInsert)
    .mutation(async ({ ctx, input }) => {
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
          message: "Failed to create emergency request",
        });
      }

      return inserted?.[0];
    }),
});
