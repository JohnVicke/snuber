import type { Apple, AppleTokens } from "arctic";
import type { Context } from "hono";
import type { User } from "lucia";

import type { HonoEnv } from "~/app";
import { CallbackAdapter } from "./adapter";

export class AppleAdapter extends CallbackAdapter {
  private apple: Apple;

  constructor(c: Context<HonoEnv>) {
    super(c);
    this.apple = c.get("services").auth.providers.apple;
  }
  public async validateRequest() {
    return this.apple.validateAuthorizationCode("code");
  }

  public async getUser(_tokens: AppleTokens) {
    return Promise.resolve({} as User);
  }
}
