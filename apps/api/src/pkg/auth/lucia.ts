import type { InferSelectModel, LibSQLClient, schema } from "@snuber/db";
import type { AppleCredentials } from "arctic";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { Apple, Google } from "arctic";
import { Lucia } from "lucia";

export interface InitAuthOptions {
  client: LibSQLClient;
  providers: {
    apple: {
      credentials: AppleCredentials;
      redirectURI: string;
    };
    google: {
      clientId: string;
      clientSecret: string;
      redirectURI: string;
    };
  };
}

export function initAuth(opts: InitAuthOptions) {
  const adapter = new LibSQLAdapter(opts.client, {
    user: "user",
    session: "session",
  });

  const lucia = new Lucia(adapter, {
    getUserAttributes: (attributes) => {
      return attributes;
    },
  });

  const apple = new Apple(
    opts.providers.apple.credentials,
    opts.providers.apple.redirectURI,
  );

  const google = new Google(
    opts.providers.google.clientId,
    opts.providers.google.clientSecret,
    opts.providers.google.redirectURI,
  );

  return { lucia, providers: { apple, google } };
}

export type DatabaseUser = Omit<
  InferSelectModel<(typeof schema)["users"]>,
  "id"
>;

export type AuthContext = ReturnType<typeof initAuth>;
