import { asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { db as _db } from "../db/drizzle";
import { budgets, tags, transactions, transactionsToTags } from "../db/schema";
import * as z from 'zod'
import { datetime } from "drizzle-orm/mysql-core";

export const createTransactionPayload = z.object({
	amount: z.number().int(),
	datetime: z.string().datetime({ offset: true }),
	description: z.string().default(''),
	budgetId: z.number().int(),
	tags: z.array(z.string()),
})

export const updateTransactionPayload = createTransactionPayload.partial()

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
		const datetime = new Date(transaction.datetime)
		const [result] = await this.db.insert(transactions).values({
			amount: transaction.amount,
			budgetId: transaction.budgetId,
			datetime: datetime,
			description: transaction.description,
		}).returning({ insertedId: transactions.id })

		// create transactions-tags relation
		const tagsRelations = transaction.tags.map<typeof transactionsToTags.$inferInsert>(t => ({ tag: t, transactionId: result.insertedId }))
		await this.db.insert(transactionsToTags).values(tagsRelations)

		return { transactionId: result.insertedId }
	}

	private selectTransaction() {
		return this.db.select({
			id: transactions.id,
			amount: transactions.amount,
			datetime: sql<string>`datetime(${transactions.datetime}, 'unixepoch', '-04:00')`,
			description: transactions.description,
			budget: {
				label: budgets.label,
				id: budgets.id,
			},
			tags: sql<string>`GROUP_CONCAT(${transactionsToTags.tag}, ',')`
		})
			.from(transactions)
			.innerJoin(budgets, eq(transactions.budgetId, budgets.id))
			.leftJoin(transactionsToTags, eq(transactions.id, transactionsToTags.transactionId))
			.groupBy(transactions.id)
	}

	async read() {
		return (
			await this.selectTransaction()
				.orderBy(desc(transactions.datetime))
				.limit(100)
		)
			.map(t => ({ ...t, tags: t.tags.split(',') }))
	}

	async findById(id: number) {
		return (await this.selectTransaction().where(eq(transactions.id, id))).map(t => ({ ...t, tags: t.tags.split(',') })).at(0)
	}

	async update(id: number, payload: z.infer<typeof updateTransactionPayload>) {
		return await this.db
			.update(transactions)
			.set({
				...payload,
				datetime: payload.datetime ? new Date(payload.datetime) : undefined
			})
			.where(eq(transactions.id, id))
	}
}
