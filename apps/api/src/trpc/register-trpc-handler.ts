import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import type { App } from "~/app";
import { createSnuberTRPCContext } from "./context";
import { appRouter } from "./root";

export function registerTRPCHandler(app: App) {
  app.use("/trpc/*", (c) => {
    const res = fetchRequestHandler({
      endpoint: "/trpc",
      req: c.req.raw,
      router: appRouter,
      createContext: (_options) =>
        createSnuberTRPCContext({
          ctx: c,
        }),
    });
    return res;
  });
}
