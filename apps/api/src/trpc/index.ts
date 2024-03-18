import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

export type { AppRouter } from "./root";
export type { RouterInputs, RouterOutputs };

export { registerTRPCHandler } from "./register-trpc-handler";
