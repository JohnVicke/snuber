import { TRPCError } from "@trpc/server";
import { describe, expect, test } from "vitest";

import { AuthHarness, NonAuthHarness } from "~/pkg/test-util/harness";

describe("authRouter", () => {
  test("protected route should return unauthorized given no user", async () => {
    const { caller } = new NonAuthHarness().create();
    await expect(() => caller.auth.me()).rejects.toThrowError(
      new TRPCError({ code: "UNAUTHORIZED" }),
    );
  });
  test("signout", async () => {
    const { caller } = new AuthHarness().create();
    const result = await caller.auth.signout();
    expect(result.ok).toBe(true);
  });
});
