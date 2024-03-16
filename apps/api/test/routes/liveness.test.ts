import { expect, test } from "vitest";

import type { LivenessResponse } from "~/routes/liveness";
import { RouteHarness } from "../utils/route-harness";

test("confirms services", async () => {
  const h = await RouteHarness.init();

  const res = await h.get<LivenessResponse>({
    url: "/v1/liveness",
  });

  expect(res).toMatchObject({
    status: 200,
    body: {
      status: "ok",
    },
  });
});
