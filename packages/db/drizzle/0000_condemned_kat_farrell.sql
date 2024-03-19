CREATE TABLE IF NOT EXISTS `google_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`picture` text,
	`given_name` text NOT NULL,
	`family_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS`session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS`user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`image_url` text,
	`google_profile_id` text,
	`email_verified` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`google_profile_id`) REFERENCES `google_profile`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `foo` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `foo_name_unique` ON `foo` (`name`);
