import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const foo = sqliteTable("foo", {
  id: text("id").notNull().primaryKey(),
  name: text("name").unique().notNull(),
});
