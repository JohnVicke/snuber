import { createDrizzle, createLibSqlClient } from "@snuber/db";

import type { Database } from "~/db";

export abstract class Harness {
  public readonly db: Database;

  constructor() {
    const client = createLibSqlClient({
      connectionType: "local",
      url: "file:test.sqlite",
    });
    this.db = createDrizzle({ client });
  }
}
