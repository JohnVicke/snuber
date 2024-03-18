import type { Database } from "@snuber/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";

import type { SnuberEnv } from "./env";
import type { AuthContext } from "./pkg/auth/lucia";

export interface ServicesContext {
  db: Database;
  auth: AuthContext;
}

export interface HonoEnv {
  Bindings: SnuberEnv;
  Variables: {
    services: ServicesContext;
  };
}

export function createApp() {
  const app = new Hono<HonoEnv>();

  app.use(prettyJSON());
  app.use(cors());

  return app;
}

export type App = ReturnType<typeof createApp>;
