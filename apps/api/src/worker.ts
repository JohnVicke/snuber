import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { z } from "zod";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import type { SnuberEnv } from "./env";
import { createContext } from "./trpc/context";
import { router } from "./trpc/routers";

export type Env = z.infer<typeof SnuberEnv>;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      const response = new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      });
      return response;
    }
    return fetchRequestHandler({
      endpoint: "/trpc/*",
      req: request,
      router,
      createContext: (options: FetchCreateContextFnOptions) =>
        createContext({ ...options, env, ctx }),
    });
  },
};
