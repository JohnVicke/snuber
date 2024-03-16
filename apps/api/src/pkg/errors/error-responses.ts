import { z } from "@hono/zod-openapi";

import type { ErrorCode, ErrorStatus } from "./error";

export const errorResponses = {
  401: {
    description: "Unauthorized",
    content: buildContent("UNAUTHORIZED"),
  },
  403: {
    description: "Forbidden",
    content: buildContent("FORBIDDEN"),
  },
  404: {
    description: "Not found",
    content: buildContent("NOT_FOUND"),
  },
  "400": {
    description: "Bad request",
    content: buildContent("BAD_REQUEST"),
  },
  "500": {
    description: "Internal server error",
    content: buildContent("INTERNAL_SERVER_ERROR"),
  },
} satisfies Record<
  ErrorStatus,
  { description: string; content: ReturnType<typeof buildContent> }
>;

function buildContent(code: ErrorCode) {
  const codeSchema = z.enum([code]);
  return {
    "application/json": {
      schema: z.object({
        error: z.object({
          code: codeSchema.openapi({
            description: "Error code",
          }),
          message: z
            .string()
            .openapi({ description: "Human readable error message" }),
        }),
      }),
    },
  };
}
