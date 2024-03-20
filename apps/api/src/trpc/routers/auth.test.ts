import type { Session, User } from "lucia";
import { createDate, TimeSpan } from "oslo";
import { describe, expect, test } from "vitest";

import { createCaller } from "~/pkg/test-util/caller";
import { createTestContext } from "~/pkg/test-util/test-context";

describe("authRouter", () => {
  const ctx = createTestContext({
    user: {
      id: "userid",
      email: "tester@testsson.com",
      imageUrl: null,
      emailVerified: false,
      googleProfileId: null,
    } satisfies User,
    session: {
      id: "session-id",
      fresh: true,
      userId: "userid",
      expiresAt: createDate(new TimeSpan(30, "d")),
    } satisfies Session,
  });

  const caller = createCaller(ctx);

  test("signout", async () => {
    const result = await caller.auth.signout();

    expect(result.ok).toBe(true);
  });
});
