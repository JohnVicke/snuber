import { eq, schema } from "@snuber/db";
import { TRPCError } from "@trpc/server";
import { generateId } from "lucia";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const fooRouter = createTRPCRouter({
  test: publicProcedure.mutation(() => {
    return "foo";
  }),
  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx: { db } }) => {
      const res = await db
        .insert(schema.foo)
        .values({
          id: generateId(15),
          name: input.name,
        })

        .returning();
      if (!res?.[0]) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return res[0];
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx: { db } }) => {
      const foo = await db.query.foo.findFirst({
        where: eq(schema.foo.id, input.id),
      });
      return foo;
    }),
});
