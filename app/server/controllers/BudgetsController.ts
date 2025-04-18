import { eq, sql } from "drizzle-orm";
import type { db as _db } from "../db/drizzle";
import { budgets, transactions } from "../db/schema";

export class BudgetController {
	constructor(public db: typeof _db) {}

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
}
