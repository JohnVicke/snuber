import { router } from "~/trpc/routers";
import { t } from "~/trpc/trpc";

export const createCaller = t.createCallerFactory(router);
