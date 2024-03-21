import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const emergencyRequest = sqliteTable("emergency_request", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  accuracy: real("accuracy"),
  status: text("statu").notNull(),
  createAt: integer("expires_at").notNull(),
});
