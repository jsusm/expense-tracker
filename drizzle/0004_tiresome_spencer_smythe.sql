PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_budget` (
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`goal` integer NOT NULL,
	`budget_id` integer,
	`defined` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`month`, `year`, `budget_id`),
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_budget`("month", "year", "goal", "budget_id", "defined") SELECT "month", "year", "goal", "budget_id", "defined" FROM `budget`;--> statement-breakpoint
DROP TABLE `budget`;--> statement-breakpoint
ALTER TABLE `__new_budget` RENAME TO `budget`;--> statement-breakpoint
PRAGMA foreign_keys=ON;