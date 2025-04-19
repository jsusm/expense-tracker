import { eq, sql } from "drizzle-orm";
import type { db as _db } from "../db/drizzle";
import { budgets, transactions } from "../db/schema";
import * as z from "zod";

export const createBudgetPayload = z.object({
	label: z.string(),
	description: z.string().optional(),
});

export const updateBudgetPayload = createBudgetPayload.partial();

export class BudgetController {
	constructor(public db: typeof _db) { }

	async getBudgets() {
		return await this.db.select().from(budgets);
	}

	async read() {
		return await this.db
			.select({
				id: budgets.id,
				label: budgets.label,
				budgetExpended: sql<number>`SUM(${transactions.amount})`,
			})
			.from(budgets)
			.leftJoin(transactions, eq(budgets.id, transactions.budgetId))
			.groupBy(budgets.id);
	}

	async create(payload: z.infer<typeof createBudgetPayload>) {
		return await this.db.insert(budgets).values(payload);
	}

	async update(id: number, payload: z.infer<typeof updateBudgetPayload>) {
		return await this.db.update(budgets).set(payload).where(eq(budgets.id, id));
	}
}
