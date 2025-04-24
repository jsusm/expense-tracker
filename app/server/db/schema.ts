import { relations } from "drizzle-orm";
import {
	int,
	integer,
	primaryKey,
	sqliteTable,
	text,
} from "drizzle-orm/sqlite-core";

export const budgets = sqliteTable("budgets", {
	id: integer().primaryKey({ autoIncrement: true }),
	label: text().notNull(),
	description: text().default(""),
	color: text(),
	icon: text(),
});

export const budgetGoals = sqliteTable(
	"budget",
	{
		month: integer().notNull(),
		year: integer().notNull(),
		goal: integer().notNull(),
		budgetId: integer("budget_id").references(() => budgets.id, {
			onDelete: "cascade",
		}),
		defined: integer({ mode: "boolean" }).default(false).notNull(),
	},
	(t) => [primaryKey({ columns: [t.month, t.year, t.budgetId] })],
);

export const tags = sqliteTable("tags", {
	label: text().notNull().primaryKey(),
	description: text().default(""),
	color: text().default(""),
});

export const transactions = sqliteTable("transactions", {
	id: integer().primaryKey({ autoIncrement: true }),
	amount: int().notNull(),
	datetime: int("date_time", { mode: "timestamp" }).notNull(),
	description: text().default("").notNull(),
	budgetId: integer("budget_id").references(() => budgets.id, {
		onDelete: "set null",
	}),
	currency: text().notNull().default("VES"),
});

/*
 * Table Relations
 */

export const transactionsToTags = sqliteTable(
	"transactions_to_tags",
	{
		transactionId: integer("transaction_id")
			.notNull()
			.references(() => transactions.id, { onDelete: "cascade" }),
		tag: text("tag")
			.notNull()
			.references(() => tags.label, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.transactionId, t.tag] })],
);

export const transactionsToTagsRelations = relations(
	transactionsToTags,
	({ one }) => ({
		transaction: one(transactions, {
			fields: [transactionsToTags.transactionId],
			references: [transactions.id],
		}),
		tag: one(tags, {
			fields: [transactionsToTags.tag],
			references: [tags.label],
		}),
	}),
);

export const categoriesRelations = relations(budgets, ({ many }) => ({
	transactions: many(transactions),
	goals: many(budgetGoals),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
	budget: one(budgets, {
		fields: [transactions.budgetId],
		references: [budgets.id],
	}),
}));

export const budgetGoalsRelations = relations(budgetGoals, ({ one }) => ({
	budget: one(budgets, {
		fields: [budgetGoals.budgetId],
		references: [budgets.id],
	}),
}));
