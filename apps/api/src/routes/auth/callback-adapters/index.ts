import type { Context } from "hono";

import type { HonoEnv } from "~/app";
import { AppleAdapter } from "./apple-adapter";
import { GoogleAdapter } from "./google-adapter";

export function getCallbackAdapter(provider: "google" | "apple") {
  return function (c: Context<HonoEnv>) {
    switch (provider) {
      case "google":
        return new GoogleAdapter(c);
      case "apple":
        return new AppleAdapter(c);
      default:
        throw new Error("Exhaust check failed");
    }
  };
}
