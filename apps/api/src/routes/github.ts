import { createRoute, z } from "@hono/zod-openapi";
import { eq, schema } from "@snuber/db";
import { generateState } from "arctic";
import { getCookie } from "hono/cookie";
import { generateId } from "lucia";
import { serializeCookie } from "oslo/cookie";

import type { App } from "~/app/create-app";
import type { SnuberError } from "~/pkg/errors/error";
import { SnuberApiError } from "~/pkg/errors/error";
import { errorResponses } from "~/pkg/errors/error-responses";

const GITHUB_COOKIE_NAME = "github_oauth_state";

const loginRoute = createRoute({
  method: "get",
  path: "/v1/login/github",
  responses: {
    302: {
      description: "Redirect to GitHub OAuth",
    },
    ...errorResponses,
  },
});

export function registerGithubLogin(app: App) {
  app.openapi(loginRoute, async (c) => {
    const {
      auth: { github },
    } = c.get("services");

    const state = generateState();
    const authUrl = await github.createAuthorizationURL(state);

    c.header(
      "Set-Cookie",
      serializeCookie(GITHUB_COOKIE_NAME, state, {
        path: "/",
        secure: c.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      }),
    );

    return c.redirect(authUrl.toString());
  });
}

const callbackRoute = createRoute({
  method: "get",
  path: "/v1/login/github/callback",
  request: {
    params: z.object({
      code: z.string(),
      state: z.string(),
    }),
  },
  responses: {
    302: {
      description: "Redirect to app",
    },
  },
});

export function registerGithubCallback(app: App) {
  app.openapi(callbackRoute, async (c) => {
    const {
      db,
      auth: { github, lucia },
    } = c.get("services");
    const { code, state } = c.req.valid("param");
    const storedState = getCookie(c, GITHUB_COOKIE_NAME);

    if (state !== storedState) {
      throw new SnuberApiError({
        code: "BAD_REQUEST",
        message: "Invalid state",
      });
    }

    try {
      const tokens = await github.validateAuthorizationCode(code);
      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });

      const githubUser = (await githubUserResponse.json()) as GitHubProfile;

      const getEmail = async () => {
        if (githubUser.email) {
          return { email: githubUser.email, verified: false };
        }

        const githubEmailsResponse = await fetch(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
              Accept: "application/vnd.github+json",
            },
          },
        );

        const emails = (await githubEmailsResponse.json()) as {
          email: string;
          primary: boolean;
          verified: boolean;
          visibility: string;
        }[];

        return emails.find((email) => email.primary);
      };

      const githubEmail = await getEmail();

      if (!githubEmail) {
        throw new SnuberApiError({
          code: "BAD_REQUEST",
          message: "No primary email",
        });
      }

      const getUser = async () => {
        const existingUser = await db.query.users.findFirst({
          where: eq(schema.users.email, githubEmail.email),
          with: {
            githubProfile: true,
          },
        });

        if (existingUser?.githubProfile) {
          return existingUser;
        }

        if (existingUser && !existingUser.githubProfile) {
          const profile = (
            await db
              .insert(schema.githubProfiles)
              .values({
                id: githubUser.id,
                username: githubUser.login,
                avatarUrl: githubUser.avatar_url,
              })
              .returning()
          )?.[0];
          return {
            ...existingUser,
            githubProfile: profile,
          };
        }

        const newUser = await db.transaction(async (tx) => {
          const profile = await tx
            .insert(schema.githubProfiles)
            .values({
              id: githubUser.id,
              username: githubUser.login,
              avatarUrl: githubUser.avatar_url,
            })
            .returning();

          const user = await tx
            .insert(schema.users)
            .values({
              imageUrl: githubUser.avatar_url,
              id: generateId(15),
              email: githubEmail.email,
              emailVerified: githubEmail.verified,
              githubProfileId: githubUser.id,
            })
            .returning();

          return {
            ...user?.[0],
            githubProfile: profile?.[0],
          };
        });

        return newUser;
      };

      const user = await getUser();
      const session = await lucia.createSession(user.id, {});
      return c.redirect(
        `exp://192.168.2.100:8081/login?session_token=${session.id}`,
      );
    } catch (e) {
      if (e instanceof SnuberApiError) {
        throw e;
      }
      return c.json<SnuberError>(
        {
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          },
        },
        { status: 500 },
      );
    }
  });
}

/** @see [Get the authenticated user](https://docs.github.com/en/rest/users/users#get-the-authenticated-user) */
export interface GitHubProfile {
  email: string | null;
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  suspended_at?: string | null;
  collaborators?: number;
  two_factor_authentication: boolean;
  plan?: {
    collaborators: number;
    name: string;
    space: number;
    private_repos: number;
  };
  [claim: string]: unknown;
}
