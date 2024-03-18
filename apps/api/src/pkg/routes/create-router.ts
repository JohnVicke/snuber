import { Hono } from "hono";

import type { HonoEnv } from "~/app";

export function createRoute() {
  return new Hono<HonoEnv>();
}
