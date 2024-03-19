import { z } from "zod";

export const SnuberEnv = z.object({
  // Server
  VERSION: z.string().default("no version"),
  ENVIRONMENT: z
    .enum(["development", "production", "test", "staging"])
    .default("development"),
  // Turso DB
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string(),
  // Google OAuth credentials
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string().url(),
  // Apple OAuth credentials
  // APPLE_CLIENT_ID: z.string(),
  // APPLE_TEAM_ID: z.string(),
  // APPLE_KEY_ID: z.string(),
  // APPLE_CERTIFICATE: z.string(),
  // APPLE_REDIRECT_URI: z.string().url(),
});

export type SnuberEnv = z.infer<typeof SnuberEnv>;
