import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  email: text("email").unique().notNull(),
  imageUrl: text("image_url"),
  githubProfileId: integer("github_profile_id").references(
    () => githubProfiles.id,
  ),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
});

export const githubProfiles = sqliteTable("github_profile", {
  id: integer("id").notNull().primaryKey(),
  avatarUrl: text("avatar_url"),
  username: text("username").notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export const userRelations = relations(users, ({ one }) => ({
  githubProfile: one(githubProfiles, {
    references: [githubProfiles.id],
    fields: [users.githubProfileId],
  }),
}));

export const githubProfileRelations = relations(githubProfiles, ({ one }) => ({
  user: one(users, {
    fields: [githubProfiles.id],
    references: [users.githubProfileId],
  }),
}));
