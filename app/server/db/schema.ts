import { relations } from "drizzle-orm";
import { int, integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

export const budgets = sqliteTable("budgets", {
	id: integer().primaryKey({ autoIncrement: true }),
	label: text().notNull(),
	description: text().default(''),
	color: text(),
	icon: text(),
})

export const tags = sqliteTable("tags", {
	label: text().notNull().primaryKey(),
	description: text().default(''),
	color: text().default(''),
})

export const transactions = sqliteTable("transactions", {
	id: integer().primaryKey({ autoIncrement: true }),
	amount: int().notNull(),
	datetime: int("date_time", { mode: 'timestamp' }).notNull(),
	description: text().default('').notNull(),
	budgetId: integer("budget_id").references(() => budgets.id).notNull(),
	currency: text().notNull().default('VES'),
})

export const transactionsToTags = sqliteTable("transactions_to_tags", {
	transactionId: integer("transaction_id").notNull().references(() => transactions.id),
	tag: text("tag").notNull().references(() => tags.label)
}, t => [
	primaryKey({ columns: [t.transactionId, t.tag] })
])

export const transactionsToTagsRelations = relations(transactionsToTags, ({ one }) => ({
	transaction: one(transactions, {
		fields: [transactionsToTags.transactionId],
		references: [transactions.id],
	}),
	tag: one(tags, {
		fields: [transactionsToTags.tag],
		references: [tags.label],
	}),
}))

export const categoriesRelations = relations(budgets, ({ many }) => ({
	transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
	budget: one(budgets, {
		fields: [transactions.budgetId],
		references: [budgets.id],
	}),
}))
