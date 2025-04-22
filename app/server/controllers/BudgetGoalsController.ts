import type { db as _db } from "../db/drizzle";
import * as z from "zod";
import { budgetGoals } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const createBudgetGoalSchema = z.object({
	goal: z.coerce.number().int().positive().gt(0),
});

export class BudgetGoalsController {
	constructor(public db: typeof _db) { }

	async create(
		budgetId: number,
		payload: z.infer<typeof createBudgetGoalSchema>,
	) {
		const currentMonth = new Date().getMonth() + 1;
		const currentYear = new Date().getFullYear();

		let query = await this.db
			.update(budgetGoals)
			.set({ goal: payload.goal, defined: true })
			.where(
				and(
					eq(budgetGoals.month, currentMonth),
					eq(budgetGoals.year, currentYear),
					eq(budgetGoals.budgetId, budgetId),
				),
			);

		if (query.rowsAffected === 0) {
			query = await this.db.insert(budgetGoals).values({
				goal: payload.goal,
				defined: true,
				month: currentMonth,
				year: currentYear,
				budgetId: budgetId,
			});
		}
		return query;
	}
}
