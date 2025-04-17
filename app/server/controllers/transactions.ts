import { eq, inArray, sql } from "drizzle-orm";
import type { db as _db } from "../db/drizzle";
import { categories, tags, transactions, transactionsToTags } from "../db/schema";
import * as z from 'zod'
import { datetime } from "drizzle-orm/mysql-core";

export const createTransactionPayload = z.object({
	categoryId: z.number().int(),
	tags: z.array(z.string()),
	amount: z.number().int(),
	description: z.string().default(''),
	datetime: z.string().datetime({ offset: true }),
})

export class TransactionController {
	constructor(public db: typeof _db) {
	}

	async create(transaction: z.infer<typeof createTransactionPayload>) {
		// check if tags exists
		const existingTags = await this.db.select().from(tags).where(inArray(tags.label, transaction.tags))
		const existingTagsLabels = existingTags.map(t => t.label)
		const nonExistingTags = transaction.tags.filter(t => !existingTagsLabels.includes(t))
		// insert non existing tags
		const inserts = []
		for (const tagLabel of nonExistingTags) {
			inserts.push(this.db.insert(tags).values({
				label: tagLabel,
			}))
		}

		await Promise.all(inserts)
		// create transaction
		const dateTime = new Date(transaction.datetime)
		const [result] = await this.db.insert(transactions).values({
			amount: transaction.amount,
			category_id: transaction.categoryId,
			dateTime: dateTime,
			description: transaction.description,
		}).returning({ insertedId: transactions.id })

		// create transactions-tags relation
		const tagsRelations = transaction.tags.map<typeof transactionsToTags.$inferInsert>(t => ({ tag: t, transactionId: result.insertedId }))
		await this.db.insert(transactionsToTags).values(tagsRelations)

		return { transactionId: result.insertedId }
	}

	async read() {
		return (await this.db.select({
			id: transactions.id,
			amount: transactions.amount,
			dateTime: sql<string>`datetime(${transactions.dateTime}, 'unixepoch', '-04:00')`,
			description: transactions.description,
			category: {
				label: categories.label,
				id: categories.id,
			},
			tags: sql<string>`GROUP_CONCAT(${transactionsToTags.tag}, ',')`
		})
			.from(transactions)
			.leftJoin(categories, eq(transactions.category_id, categories.id))
			.leftJoin(transactionsToTags, eq(transactions.id, transactionsToTags.transactionId))
			.groupBy(transactions.id)
			.orderBy(transactions.dateTime)
			.limit(2)).map(t => ({ ...t, tags: t.tags.split(',') }))
	}
}
