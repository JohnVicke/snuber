import type { Context } from "hono";
import type { ZodError } from "zod";
import { generateErrorMessage } from "zod-error";

import type { SnuberError } from "./error";
import type { HonoEnv } from "~/app/env";
import { SnuberApiError } from "./error";

export function handleError(err: Error, c: Context<HonoEnv>): Response {
  if (err instanceof SnuberApiError) {
    return c.json<SnuberError>(
      { error: { code: err.code, message: err.message } },
      { status: err.status },
    );
  }
  console.error(err);
  return c.json<SnuberError>(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Something unexpected happend",
      },
    },
    { status: 500 },
  );
}

export function handleZodError<T>(
  result: { success: true; data: T } | { success: false; error: ZodError },
  c: Context<HonoEnv>,
) {
  if (!result.success) {
    return c.json<SnuberError>(
      {
        error: {
          code: "BAD_REQUEST",
          message: generateErrorMessage(result.error.issues, {
            maxErrors: 1,
            delimiter: {
              component: ": ",
            },
            path: {
              enabled: true,
              type: "objectNotation",
              label: "",
            },
            code: {
              enabled: true,
              label: "",
            },
            message: {
              enabled: true,
              label: "",
            },
          }),
        },
      },
      { status: 400 },
    );
  }
}

export function notFound(c: Context<HonoEnv>): Response {
  return c.json<SnuberError>(
    {
      error: {
        code: "NOT_FOUND",
        message: "Not found",
      },
    },
    { status: 404 },
  );
}
