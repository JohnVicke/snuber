import { zValidator } from "@hono/zod-validator";
import { generateCodeVerifier, generateState } from "arctic";
import { setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { createRoute } from "../create-router";
import { getCallbackAdapter } from "./callback-adapters";

export const authRouter = createRoute();

authRouter.get(
  "/signout",
  zValidator(
    "header",
    z.object({
      Authorization: z.string().refine((v) => v.startsWith("Bearer "), {
        message: "Invalid Authorization header",
      }),
    }),
    (result) => {
      if (!result.success) {
        throw new HTTPException(401, {
          message: "Invalid authorization header",
        });
      }
    },
  ),
  async (c) => {
    const {
      auth: { lucia },
    } = c.get("services");

    const { Authorization } = c.req.valid("header");
    const sessionId = Authorization.split(" ")[1];

    try {
      await lucia.validateSession(sessionId);
      return c.json({ ok: true });
    } catch (e) {
      return c.json({ oopsie: "daisy" }, { status: 500 });
    }
  },
);

authRouter.get("/google", async (c) => {
  const { auth } = c.get("services");
  const state = generateState();
  const verifier = generateCodeVerifier();
  const url = await auth.providers.google.createAuthorizationURL(
    state,
    verifier,
    {
      scopes: ["email profile"],
    },
  );

  setCookie(c, "google-oauth-state", state, {
    path: "/",
    secure: c.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax",
  });

  setCookie(c, "google-oauth-verifier", verifier, {
    path: "/",
    secure: c.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "Lax",
  });

  return c.redirect(url.toString());
});

authRouter.get(
  "/callback/:provider",
  zValidator(
    "param",
    z.object({
      provider: z.enum(["google", "apple"]),
    }),
  ),
  async (c) => {
    const { provider } = c.req.valid("param");
    const {
      auth: { lucia },
    } = c.get("services");
    const adapter = getCallbackAdapter(provider)(c);

    try {
      const tokens = await adapter.validateRequest();
      const user = await adapter.getUser(tokens);
      const session = await lucia.createSession(user.id, {});
      return c.redirect(`exp://192.168.1.89:8081?session_token=${session.id}`);
    } catch (e) {
      console.log(e);
      return c.json({ oopsie: "daisy" }, { status: 500 });
    }
  },
);
