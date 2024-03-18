import type { MiddlewareHandler } from "hono";
import { createDrizzle, createLibSqlClient } from "@snuber/db";

import type { HonoEnv } from "~/app";
import { initAuth } from "../auth/lucia";

export function initMiddleware(): MiddlewareHandler<HonoEnv> {
  return (c, next) => {
    const { env } = c;

    const client = createLibSqlClient({
      connectionType: "remote",
      url: env.DATABASE_URL,
      authToken: env.DATABASE_AUTH_TOKEN,
    });

    const db = createDrizzle({ client });

    const auth = initAuth({
      client,
      providers: {
        google: {
          clientId: c.env.GOOGLE_CLIENT_ID,
          clientSecret: c.env.GOOGLE_CLIENT_SECRET,
          redirectURI: c.env.GOOGLE_REDIRECT_URI,
        },
        apple: {
          redirectURI: c.env.APPLE_REDIRECT_URI,
          credentials: {
            clientId: c.env.APPLE_CLIENT_ID,
            keyId: c.env.APPLE_KEY_ID,
            teamId: c.env.APPLE_TEAM_ID,
            certificate: c.env.APPLE_CERTIFICATE,
          },
        },
      },
    });

    c.set("services", { db, auth });

    return next();
  };
}
