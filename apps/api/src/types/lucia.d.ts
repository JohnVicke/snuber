import { Lucia } from "lucia";

declare module "lucia" {
  interface Register {
    Lucia: import("~/pkg/auth/lucia").AuthContext["lucia"];
    DatabaseUserAttributes: import("~/pkg/auth/lucia").DatabaseUser;
  }
}
