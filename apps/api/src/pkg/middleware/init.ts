import type { MiddlewareHandler } from "hono";

import type { HonoEnv } from "~/app/env";
import { createConnection } from "~/db";
import { createGithubOauth } from "../auth/github-oauth";
import { createLucia } from "../auth/lucia";

export function init(): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    const { db, client } = createConnection({
      url: c.env.DATABASE_URL,
      authToken: c.env.DATABASE_AUTH_TOKEN,
    });

    const lucia = createLucia({
      client,
      secure: c.env.NODE_ENV === "production",
    });

    const github = createGithubOauth({
      clientId: c.env.GITHUB_CLIENT_ID,
      clientSecret: c.env.GITHUB_CLIENT_SECRET,
    });

    c.set("services", { db, auth: { lucia, github } });
    await next();
  };
}
