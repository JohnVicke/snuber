import type { z } from "zod";

import { createApp } from "./app";
import { SnuberEnv } from "./env";
import { initMiddleware } from "./pkg/middleware";
import { honoRouter } from "./pkg/routes";
import { registerTRPCHandler } from "./trpc/register-trpc-handler";

export type Env = z.infer<typeof SnuberEnv>;

const app = createApp().use("*", initMiddleware()).route("/api/v1", honoRouter);

app.get("/api/v1/routes", (c) => {
  return c.json(
    app.routes.map((route) => ({
      method: route.method,
      path: route.path,
    })),
  );
});

registerTRPCHandler(app);

const handler = {
  fetch: async (req: Request, env: Env, ctx: ExecutionContext) => {
    const parsedEnv = SnuberEnv.safeParse(env);

    if (!parsedEnv.success) {
      return Response.json(
        {
          code: "INVALID_ENV",
          message: "Invalid environment",
          errors: parsedEnv.error.errors,
        },
        { status: 500 },
      );
    }

    return app.fetch(req, env, ctx);
  },
} satisfies ExportedHandler<Env>;

export default handler;
