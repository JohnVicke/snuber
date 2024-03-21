import { TimeSpan } from "lucia";
import { createDate } from "oslo";

import type { ServicesContext } from "~/app";
import type { InnerSnuberTRPCContext } from "~/trpc/context";
import { createInnerSnuberTRPCContext } from "~/trpc/context";
import { initAuth } from "../auth/lucia";
import { createCaller } from "./caller";
import { testDB, testDbClient } from "./test-db";

export abstract class Harness {
  protected services: ServicesContext;

  constructor() {
    this.services = {
      db: testDB,
      auth: this.setupAuth(),
    };
  }

  abstract create(opts?: { generateId?: (l: number) => string }): {
    ctx: InnerSnuberTRPCContext;
    caller: ReturnType<typeof createCaller>;
  };

  private setupAuth() {
    return initAuth({
      client: testDbClient,
      providers: {
        apple: {
          redirectURI: "redirectURI",
          credentials: {
            teamId: "teamId",
            keyId: "keyId",
            clientId: "clientId",
            certificate: "key",
          },
        },
        google: {
          clientId: "clientId",
          clientSecret: "clientSecret",
          redirectURI: "redirectURI",
        },
      },
    });
  }
}

export class AuthHarness extends Harness {
  constructor() {
    super();
  }

  public create(opts?: { generateId?: (l: number) => string }) {
    const auth = {
      user: {
        id: "userid",
        email: "tester@testsson.com",
        imageUrl: null,
        emailVerified: false,
        googleProfileId: null,
      },
      session: {
        id: "session-id",
        fresh: true,
        userId: "userid",
        expiresAt: createDate(new TimeSpan(30, "d")),
      },
    };

    const ctx = createInnerSnuberTRPCContext({
      ...this.services,
      ...auth,
      ...opts,
    });

    return { caller: createCaller(ctx), ctx: { ...ctx, ...auth } };
  }
}

export class NonAuthHarness extends Harness {
  constructor() {
    super();
  }
  public create() {
    const ctx = createInnerSnuberTRPCContext({
      ...this.services,
      user: null,
      session: null,
    });
    return { caller: createCaller(ctx), ctx };
  }
}
