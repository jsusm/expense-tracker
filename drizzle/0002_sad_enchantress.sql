PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_transactions_to_tags` (
	`transaction_id` integer NOT NULL,
	`tag` text NOT NULL,
	PRIMARY KEY(`transaction_id`, `tag`),
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag`) REFERENCES `tags`(`label`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_transactions_to_tags`("transaction_id", "tag") SELECT "transaction_id", "tag" FROM `transactions_to_tags`;--> statement-breakpoint
DROP TABLE `transactions_to_tags`;--> statement-breakpoint
ALTER TABLE `__new_transactions_to_tags` RENAME TO `transactions_to_tags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;