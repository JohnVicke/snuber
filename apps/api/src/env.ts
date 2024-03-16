import { z } from "zod";

export const SnuberEnv = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

export type SnuberEnv = z.infer<typeof SnuberEnv>;
