import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import type { App } from "~/app";
import { createTRPCContext } from "./context";
import { router } from "./routers";

export function registerTRPCHandler(app: App) {
  app.use("/trpc/*", (c) => {
    const res = fetchRequestHandler({
      endpoint: "/v1/trpc",
      req: c.req.raw,
      router,
      createContext: (options) =>
        createTRPCContext({ ...options, services: c.get("services") }),
    });
    return res;
  });
}
