import type { EmergencyRequest } from "@snuber/schemas";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { AuthHarness } from "~/pkg/test-util/harness";

beforeEach(() => void vi.useFakeTimers());
afterEach(() => void vi.useRealTimers());

describe("emergencyRouter", () => {
  test("sending a requst creates a pending emergency", async () => {
    const date = new Date(2000, 1, 1, 13);
    vi.setSystemTime(date);
    const { ctx, caller } = new AuthHarness().create({
      generateId: () => "id",
    });
    const result = await caller.emergency.send({
      latitude: 0,
      longitude: 0,
    });

    expect(result).toStrictEqual({
      userId: ctx.user.id,
      latitude: 0,
      longitude: 0,
      id: "id",
      status: "pending",
      accuracy: null,
      createdAt: date.getTime(),
    } satisfies EmergencyRequest);
  });
});
