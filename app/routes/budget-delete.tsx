import { redirect } from "react-router";
import type { Route } from "./+types/budget-delete";
import { BudgetController } from "~/server/controllers/BudgetsController";
import { db } from "~/server/db/drizzle";

export async function action({ params }: Route.ActionArgs) {
	const budgetId = Number.parseInt(params.budgetId);
	if (Number.isNaN(budgetId)) {
		return new Response("Not Found", { status: 404 });
	}

	await new BudgetController(db).delete(budgetId);

	return redirect("/");
}
