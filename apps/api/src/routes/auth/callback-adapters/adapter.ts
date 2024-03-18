import type { Database } from "@snuber/db";
import type { Tokens } from "arctic";
import type { Context } from "hono";
import type { User } from "lucia";

import type { HonoEnv } from "~/app";

export abstract class CallbackAdapter {
  protected readonly c: Context<HonoEnv>;
  protected readonly url: URL;
  protected readonly db: Database;

  constructor(c: Context<HonoEnv>) {
    this.c = c;
    this.url = new URL(c.req.raw.url);
    this.db = c.get("services").db;
  }

  public abstract validateRequest(): Promise<Tokens>;

  public abstract getUser(tokens: Tokens): Promise<User>;
}
