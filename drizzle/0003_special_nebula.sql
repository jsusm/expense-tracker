CREATE TABLE `budget` (
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`goal` integer NOT NULL,
	`budget_id` integer,
	`defined` integer DEFAULT false NOT NULL,
	PRIMARY KEY(`month`, `year`, `budget_id`),
	FOREIGN KEY (`budget_id`) REFERENCES `budgets`(`id`) ON UPDATE no action ON DELETE no action
);
