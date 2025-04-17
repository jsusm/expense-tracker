CREATE TABLE `budgets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`description` text DEFAULT '',
	`color` text,
	`icon` text
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`label` text PRIMARY KEY NOT NULL,
	`description` text DEFAULT '',
	`color` text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`amount` integer NOT NULL,
	`date_time` integer NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`budget_id` integer NOT NULL,
	`currency` text DEFAULT 'VES' NOT NULL,
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions_to_tags` (
	`transaction_id` integer NOT NULL,
	`tag` text NOT NULL,
	PRIMARY KEY(`transaction_id`, `tag`),
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag`) REFERENCES `tags`(`label`) ON UPDATE no action ON DELETE no action
);
