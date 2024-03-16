import type { AppType } from "@snuber/api";
import { hc } from "hono/client";

export const api = hc<AppType>("http://localhost:8787");
