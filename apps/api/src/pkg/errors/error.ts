import type { StatusCode } from "hono/utils/http-status";
import { z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

export const ErrorCode = z.enum([
  "BAD_REQUEST",
  "FORBIDDEN",
  "INTERNAL_SERVER_ERROR",
  "NOT_FOUND",
  "UNAUTHORIZED",
]);

export type ErrorCode = z.infer<typeof ErrorCode>;

export const SnuberError = z.object({
  error: z.object({
    code: ErrorCode.openapi({
      description: "Error code",
    }),
    message: z
      .string()
      .openapi({ description: "Human readable error message" }),
  }),
});

export type SnuberError = z.infer<typeof SnuberError>;

export class SnuberApiError extends HTTPException {
  public readonly code: ErrorCode;

  constructor(args: { code: ErrorCode; message: string }) {
    super(codeToStatus[args.code], { message: args.message });
    this.code = args.code;
  }
}

const codeToStatus = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
} satisfies Record<ErrorCode, StatusCode>;

export type ErrorStatus = (typeof codeToStatus)[keyof typeof codeToStatus];
