import type { GitHub } from "arctic";
import type { Lucia } from "lucia";

import type { Database } from "~/db";
import type { SnuberEnv } from "~/env";

export interface ServiceContext {
  db: Database;
  auth: {
    lucia: Lucia;
    github: GitHub;
  };
}

export interface HonoEnv {
  Bindings: SnuberEnv;
  Variables: {
    services: ServiceContext;
  };
}
