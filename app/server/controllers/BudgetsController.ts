import { aliasedTable, and, eq, sql } from "drizzle-orm";
import * as z from "zod";
import type { db as _db } from "../db/drizzle";
import { budgetGoals, budgets, transactions } from "../db/schema";

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
		const currentMonth = new Date().getMonth() + 1;
		const currentYear = new Date().getFullYear();

		return await this.db
			.select({
				id: budgets.id,
				label: budgets.label,
				budgetExpended: sql<number>`SUM(${transactions.amount})`,
				goal: {
					goal: budgetGoals.goal,
					defined: budgetGoals.defined,
				},
			})
			.from(budgets)
			.leftJoin(transactions, eq(budgets.id, transactions.budgetId))
			.leftJoin(
				budgetGoals,
				and(
					eq(budgetGoals.budgetId, budgets.id),
					eq(budgetGoals.month, currentMonth),
					eq(budgetGoals.year, currentYear),
				),
			)
			.limit(5)
			.groupBy(budgets.id);
	}

	async findById(id: number) {
		const currentMonth = new Date().getMonth() + 1;
		const currentYear = new Date().getFullYear();
		const lastGoalMonth = currentMonth === 1 ? 12 : currentMonth - 1;

		const lastGoal = aliasedTable(budgetGoals, "lastGoal");

		return await this.db
			.select({
				id: budgets.id,
				label: budgets.label,
				budgetExpended: sql<number>`SUM(${transactions.amount})`,
				description: budgets.description,
				goal: {
					goal: budgetGoals.goal,
					defined: budgetGoals.defined,
					lastGoal: lastGoal.goal,
				},
			})
			.from(budgets)
			.where(eq(budgets.id, id))
			.leftJoin(transactions, eq(budgets.id, transactions.budgetId))
			.leftJoin(
				budgetGoals,
				and(
					eq(budgetGoals.budgetId, budgets.id),
					eq(budgetGoals.month, currentMonth),
					eq(budgetGoals.year, currentYear),
				),
			)
			.leftJoin(
				lastGoal,
				and(
					eq(lastGoal.budgetId, budgets.id),
					eq(lastGoal.month, lastGoalMonth),
					eq(lastGoal.year, currentYear),
				),
			)
			.groupBy(budgets.id);
	}

	async create(payload: z.infer<typeof createBudgetPayload>) {
		return await this.db.insert(budgets).values(payload);
	}

	async update(id: number, payload: z.infer<typeof updateBudgetPayload>) {
		return await this.db.update(budgets).set(payload).where(eq(budgets.id, id));
	}

	async delete(id: number) {
		return await this.db.delete(budgets).where(eq(budgets.id, id));
	}
}
