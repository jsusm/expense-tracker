PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions_to_tags` (
	`transaction_id` integer NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`transaction_id`, `tag_id`),
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`label`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions_to_tags`("transaction_id", "tag_id") SELECT "transaction_id", "tag_id" FROM `transactions_to_tags`;--> statement-breakpoint
DROP TABLE `transactions_to_tags`;--> statement-breakpoint
ALTER TABLE `__new_transactions_to_tags` RENAME TO `transactions_to_tags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`label` text PRIMARY KEY NOT NULL,
	`description` text DEFAULT '',
	`color` text DEFAULT ''
);
--> statement-breakpoint
INSERT INTO `__new_tags`("label", "description", "color") SELECT "label", "description", "color" FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;