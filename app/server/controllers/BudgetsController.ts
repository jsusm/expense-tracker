import type { db as _db } from "../db/drizzle";
import { budgets } from "../db/schema";

export class BudgetController {
	constructor(public db: typeof _db) {
	}

	async getBudgets() {
		return await this.db.select().from(budgets)
	}
}
