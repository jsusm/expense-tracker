import { relations } from "drizzle-orm";
import { int, integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
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
	dateTime: int("date_time", { mode: 'timestamp_ms' }).notNull(),
	description: text().default('').notNull(),
	category_id: integer("category_id").references(() => categories.id).notNull(),
	currency: text().notNull().default('VES'),
})

export const transactionsToTags = sqliteTable("transactions_to_tags", {
	transactionId: integer("transaction_id").notNull().references(() => transactions.id),
	tag: text("tag_id").notNull().references(() => tags.label)
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

export const categoriesRelations = relations(categories, ({ many }) => ({
	transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
	category: one(categories, {
		fields: [transactions.category_id],
		references: [categories.id],
	}),
}))
