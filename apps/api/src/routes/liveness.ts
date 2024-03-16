import { createRoute, z } from "@hono/zod-openapi";

import type { App } from "~/app/create-app";
import type { InferJsonResponse } from "~/types/infer-json-response";

const route = createRoute({
  method: "get",
  path: "/v1/liveness",
  responses: {
    200: {
      description: "The service is alive and well",
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({
              description: "The status of the server",
            }),
          }),
        },
      },
    },
  },
});

export const registerLiveness = (app: App) => {
  app.openapi(route, (c) => {
    return c.json({ status: "ok" });
  });
};

export type LivenessResponse = InferJsonResponse<typeof route>;
