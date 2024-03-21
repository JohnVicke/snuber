CREATE TABLE `emergency_request` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`accuracy` real,
	`status` text NOT NULL,
	`created_at` integer NOT NULL
);
