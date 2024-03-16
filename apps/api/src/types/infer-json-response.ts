import type { z } from "@hono/zod-openapi";

interface HonoRouteLike {
  responses: Record<
    number,
    { content: { "application/json": { schema: z.ZodObject<z.ZodRawShape> } } }
  >;
}

export type InferJsonResponse<
  TRoute extends HonoRouteLike,
  TCode extends number = 200,
> = TRoute["responses"][TCode]["content"]["application/json"]["schema"];
