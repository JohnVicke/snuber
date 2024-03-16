import type { Config } from "drizzle-kit";

const { DATABASE_URL, DATABASE_AUTH_TOKEN } = process.env;

if (!DATABASE_URL || !DATABASE_AUTH_TOKEN) {
  throw new Error("Missing DATABASE_URL or DATABASE_AUTH_TOKEN");
}

export default {
  out: "./drizzle",
  schema: "./src/schema",
  driver: "turso",
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
