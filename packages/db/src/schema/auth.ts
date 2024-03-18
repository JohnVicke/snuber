import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  email: text("email").unique().notNull(),
  imageUrl: text("image_url"),
  googleProfileId: text("google_profile_id").references(
    () => googleProfiles.id,
  ),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
});

export const googleProfiles = sqliteTable("google_profile", {
  id: text("id").notNull().primaryKey(),
  picture: text("picture"),
  givenName: text("given_name").notNull(),
  familyName: text("family_name").notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export const userRelations = relations(users, ({ one }) => ({
  googleProfile: one(googleProfiles, {
    references: [googleProfiles.id],
    fields: [users.googleProfileId],
  }),
}));

export const googleProfileRelations = relations(googleProfiles, ({ one }) => ({
  user: one(users, {
    fields: [googleProfiles.id],
    references: [users.googleProfileId],
  }),
}));
