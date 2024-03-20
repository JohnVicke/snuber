import type { inferProcedureInput } from "@trpc/server";
import { describe, expect, test } from "vitest";

import type { AppRouter } from "~/exported";
import { createCaller } from "~/pkg/test-util/caller";
import { createTestContext } from "~/pkg/test-util/test-context";

describe("fooRouter", () => {
  const ctx = createTestContext({
    user: null,
    session: null,
  });

  const caller = createCaller(ctx);

  test("add foo", async () => {
    const input: inferProcedureInput<AppRouter["foo"]["add"]> = {
      name: "world",
    };
    const result = await caller.foo.add(input);

    expect(result.id).toBeTypeOf("string");
    expect(result.name).toBe("world");

    const foo = await caller.foo.byId({ id: result.id });
    expect(foo).toMatchObject({
      id: result.id,
      name: "world",
    });
  });
});
