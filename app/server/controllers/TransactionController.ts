import { asc, desc, eq, gte, inArray, and, sql } from "drizzle-orm";
import { datetime } from "drizzle-orm/mysql-core";
import * as z from "zod";
import type { db as _db } from "../db/drizzle";
import { budgets, tags, transactions, transactionsToTags } from "../db/schema";
import { addCero } from "~/lib/utils";

export const createTransactionPayload = z.object({
	amount: z.number().int(),
	datetime: z.string().datetime({ offset: true }),
	description: z.string().default(""),
	budgetId: z.number().int(),
	tags: z.array(z.string()),
});

export const updateTransactionPayload = createTransactionPayload.partial();

type TransactionAmountPerDay = {
	amount: number;
	date: string;
};

export class TransactionController {
	constructor(public db: typeof _db) {}

	async create(transaction: z.infer<typeof createTransactionPayload>) {
		// check if tags exists
		const existingTags = await this.db
			.select()
			.from(tags)
			.where(inArray(tags.label, transaction.tags));

		const existingTagsLabels = existingTags.map((t) => t.label);
		const nonExistingTags = transaction.tags.filter(
			(t) => !existingTagsLabels.includes(t),
		);
		// insert non existing tags
		const inserts = [];
		for (const tagLabel of nonExistingTags) {
			if (tagLabel !== "") {
				inserts.push(
					this.db.insert(tags).values({
						label: tagLabel,
					}),
				);
			}
		}

		await Promise.all(inserts);
		// create transaction
		const datetime = new Date(transaction.datetime);
		const [result] = await this.db
			.insert(transactions)
			.values({
				amount: transaction.amount,
				budgetId: transaction.budgetId,
				datetime: datetime,
				description: transaction.description,
			})
			.returning({ insertedId: transactions.id });

		// create transactions-tags relation
		const tagsRelations = transaction.tags
			.filter((t) => t !== "")
			.map<typeof transactionsToTags.$inferInsert>((t) => ({
				tag: t,
				transactionId: result.insertedId,
			}));

		if (tagsRelations.length > 0) {
			await this.db.insert(transactionsToTags).values(tagsRelations);
		}

		return { transactionId: result.insertedId };
	}

	private selectTransaction() {
		return this.db
			.select({
				id: transactions.id,
				amount: transactions.amount,
				datetime: sql<string>`datetime(${transactions.datetime}, 'unixepoch', '-04:00')`,
				description: transactions.description,
				budget: {
					label: budgets.label,
					id: budgets.id,
				},
				tags: sql<string>`IFNULL(GROUP_CONCAT(${transactionsToTags.tag}, ','), '')`,
			})
			.from(transactions)
			.innerJoin(budgets, eq(transactions.budgetId, budgets.id))
			.leftJoin(
				transactionsToTags,
				eq(transactions.id, transactionsToTags.transactionId),
			)
			.groupBy(transactions.id);
	}

	async read() {
		const result = await this.selectTransaction()
			.orderBy(desc(transactions.datetime))
			.limit(100);

		return result.map((t) => ({ ...t, tags: t.tags.split(",") }));
	}

	async findById(id: number) {
		return (await this.selectTransaction().where(eq(transactions.id, id)))
			.map((t) => ({ ...t, tags: t.tags.split(",") }))
			.at(0);
	}

	async update(id: number, payload: z.infer<typeof updateTransactionPayload>) {
		return await this.db
			.update(transactions)
			.set({
				...payload,
				datetime: payload.datetime ? new Date(payload.datetime) : undefined,
			})
			.where(eq(transactions.id, id));
	}

	async delete(id: number) {
		return await this.db.delete(transactions).where(eq(transactions.id, id));
	}

	async findByBudgetId(budgetId: number) {
		return (
			await this.db
				.select({
					id: transactions.id,
					amount: transactions.amount,
					datetime: sql<string>`datetime(${transactions.datetime}, 'unixepoch', '-04:00')`,
					description: transactions.description,
					tags: sql<string>`IFNULL(GROUP_CONCAT(${transactionsToTags.tag}, ','), '')`,
				})
				.from(transactions)
				.where(eq(transactions.budgetId, budgetId))
				.leftJoin(
					transactionsToTags,
					eq(transactions.id, transactionsToTags.transactionId),
				)
				.groupBy(transactions.id)
		).map((t) => ({ ...t, tags: t.tags.split(",") }));
	}

	async totalTransactionsPerMonth(month: number) {
		// TODO: Add support for the year
		const r = (
			await this.db
				.select({
					amount: sql<number>`SUM(${transactions.amount})`,
					count: sql<number>`COUNT(*)`,
				})
				.from(transactions)
				.where(
					and(
						sql`${transactions.datetime} >= unixepoch('2025-04-01 00:00')`,
						sql`${transactions.datetime} < unixepoch('2025-04-01 00:00', '+1 month')`,
					),
				)
		)[0];

		console.log({ r, month, month2: addCero(month) });
		return r;
	}

	async getBalancePerDay() {
		const r = await this.db.run(sql`
WITH RECURSIVE dates(n) AS (
    SELECT 0
    UNION ALL
    SELECT n + 1 FROM dates WHERE n < 10
)
SELECT
  DATE('now', '-'||n||' day') as date,
  IFNULL(SUM(${transactions.amount}),0) as expended
FROM dates
  LEFT JOIN ${transactions} ON DATE(${transactions.datetime}, 'unixepoch') == date
  GROUP BY date
ORDER BY date DESC;
`);

		return r.rows as unknown[] as TransactionAmountPerDay[];
	}
}
