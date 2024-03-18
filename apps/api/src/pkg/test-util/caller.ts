import { appRouter } from "~/trpc/root";
import { t } from "~/trpc/trpc";

export const createCaller = t.createCallerFactory(appRouter);
