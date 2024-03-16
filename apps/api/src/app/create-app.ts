import { OpenAPIHono } from "@hono/zod-openapi";
import { prettyJSON } from "hono/pretty-json";

import type { HonoEnv } from "./env";
import {
  handleError,
  handleZodError,
  notFound,
} from "~/pkg/errors/handle-error";

export function createApp() {
  const app = new OpenAPIHono<HonoEnv>({
    defaultHook: handleZodError,
  });

  app.use(prettyJSON());
  app.onError(handleError);
  app.notFound(notFound);
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "My API",
    },
  });

  return app;
}

export type App = ReturnType<typeof createApp>;
