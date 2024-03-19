import type { Google, GoogleTokens } from "arctic";
import type { Context } from "hono";
import { eq, schema } from "@snuber/db";
import { getCookie } from "hono/cookie";
import { generateId } from "lucia";

import type { HonoEnv } from "~/app";
import { CallbackAdapter } from "./adapter";

export class GoogleAdapter extends CallbackAdapter {
  private google: Google;

  constructor(c: Context<HonoEnv>) {
    super(c);
    this.google = c.get("services").auth.providers.google;
  }

  public async validateRequest() {
    const code = this.url.searchParams.get("code");
    const state = this.url.searchParams.get("state");
    const storedState = getCookie(this.c, "google-oauth-state");
    const storedVerifier = getCookie(this.c, "google-oauth-verifier");
    if (!code || !state || !storedVerifier || state !== storedState) {
      throw new Error("invalid verifier");
    }

    return this.google.validateAuthorizationCode(code, storedVerifier);
  }

  public async getUser(tokens: GoogleTokens) {
    const profileResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const profile = (await profileResponse.json()) as GoogleProfile;

    const dbUser = await this.db.query.users.findFirst({
      where: eq(schema.users.googleProfileId, profile.id),
    });

    if (dbUser) {
      return dbUser;
    }

    return await this.db.transaction(async (tx) => {
      await tx.insert(schema.googleProfiles).values({
        id: profile.id,
        picture: profile.picture,
        givenName: profile.given_name,
        familyName: profile.family_name,
      });
      const result = await tx
        .insert(schema.users)
        .values({
          id: generateId(15),
          email: profile.email,
          imageUrl: profile.picture,
          googleProfileId: profile.id,
        })
        .returning();

      if (!result?.[0]) {
        throw new Error();
      }

      return result[0];
    });
  }
}

interface GoogleProfile extends Record<string, any> {
  id: string;
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  hd: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  nbf: number;
  picture: string;
  sub: string;
}
