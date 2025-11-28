CREATE TABLE `book` (
	`id` text PRIMARY KEY NOT NULL,
	`summary` text NOT NULL,
	`author` text,
	`totalPages` integer NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
