import type { Session, User } from "lucia";
import { createDrizzle, createLibSqlClient } from "@snuber/db";

import type { ServicesContext } from "~/app";
import { createInnerSnuberTRPCContext } from "~/trpc/context";
import { initAuth } from "../auth/lucia";

export const testDbclient = createLibSqlClient({
  connectionType: "local",
  url: "file:test.sqlite",
});

export const testDb = createDrizzle({ client: testDbclient });

const auth = initAuth({
  client: testDbclient,
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

const testServices = {
  auth,
  db: testDb,
} satisfies ServicesContext;

export const testContext = createInnerSnuberTRPCContext({
  ...testServices,
  user: null,
  session: null,
});

export const createTestContext = (
  opts: { user: User; session: Session } | { user: null; session: null },
) => {
  return createInnerSnuberTRPCContext({
    ...opts,
    ...testServices,
  });
};
