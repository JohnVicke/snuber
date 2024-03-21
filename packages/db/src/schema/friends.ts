import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { users } from "./auth";

export const friends = sqliteTable("friends", {
  id: text("id").notNull().primaryKey(),
  inviter: text("name")
    .notNull()
    .references(() => users.id),
  invitee: text("id")
    .notNull()
    .references(() => users.id),
  status: text("status").notNull(),
  createdAt: integer("createdAt").notNull(),
});
