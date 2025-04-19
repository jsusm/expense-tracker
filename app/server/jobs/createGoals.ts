import { db } from "../db/drizzle";
import "dotenv";
import { budgetGoals, budgets } from "../db/schema";
import { aliasedTable, and, eq } from "drizzle-orm";

async function createGoalsJob() {
	const currentMonth = new Date().getMonth() + 1;
	const currentYear = new Date().getFullYear();
	const lastGoalMonth = currentMonth === 1 ? 12 : currentMonth - 1;

	const lastGoal = aliasedTable(budgetGoals, "lastGoal");
	const _budgets = await db
		.select({
			budgetId: budgets.id,
			goalId: budgetGoals.id,
			lastGoalId: lastGoal.id,
			lastGoal: lastGoal.goal,
		})
		.from(budgets)
		.leftJoin(
			budgetGoals,
			and(
				eq(budgetGoals.month, currentMonth),
				eq(budgetGoals.year, currentYear),
				eq(budgets.id, budgetGoals.budgetId),
			),
		)
		.leftJoin(
			lastGoal,
			and(
				eq(lastGoal.month, lastGoalMonth),
				eq(lastGoal.year, currentYear),
				eq(budgets.id, lastGoal.budgetId),
			),
		);

	console.log({ _budgets });

	const inserts = [];

	for (const budget of _budgets) {
		if (budget.goalId === null) {
			inserts.push(
				db.insert(budgetGoals).values({
					budgetId: budget.budgetId,
					month: currentMonth,
					year: currentYear,
					goal: budget.lastGoal === null ? -1 : budget.lastGoal,
					defined: false,
				}),
			);
		}
	}

	console.log(
		`LOG: ${inserts.length} of ${_budgets.length} have no goal for month ${currentMonth}-${currentYear}`,
	);

	// await Promise.all(inserts);

	// console.log({ currentMonth, currentYear });
}

createGoalsJob();
