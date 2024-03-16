import { createRoute, z } from "@hono/zod-openapi";

import type { App } from "~/app/create-app";
import type { InferJsonResponse } from "~/types/infer-json-response";
import { SnuberApiError } from "~/pkg/errors/error";

const route = createRoute({
  method: "get",
  path: "/v1/user",
  responses: {
    200: {
      description: "User",
      content: {
        "application/json": {
          schema: z.object({
            user: z.any(),
          }),
        },
      },
    },
  },
});

export const registerUser = (app: App) => {
  app.openapi(route, async (c) => {
    const {
      auth: { lucia },
    } = c.get("services");
    const authHeader = c.req.header("Authorization");
    const sessionId = lucia.readBearerToken(authHeader ?? "");

    if (!sessionId) {
      throw new SnuberApiError({
        code: "UNAUTHORIZED",
        message: "Invalid bearer token",
      });
    }

    const session = await lucia.validateSession(sessionId);

    if (!session || !session.session?.fresh) {
      throw new SnuberApiError({
        code: "UNAUTHORIZED",
        message: "Invalid session",
      });
    }

    return c.json({ user: session.user });
  });
};

export type LivenessResponse = InferJsonResponse<typeof route>;
