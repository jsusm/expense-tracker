import { data } from "react-router";
import { removeNumberFormat } from "~/lib/utils";
import {
	BudgetGoalsController,
	createBudgetGoalSchema,
} from "~/server/controllers/BudgetGoalsController";
import { db } from "~/server/db/drizzle";
import type { Route } from "./+types/budget-goal-create";

export async function action({ params, request }: Route.ActionArgs) {
	let budgetId: number;
	try {
		budgetId = Number.parseInt(params.budgetId);
	} catch (error) {
		throw new Response("Not found", { status: 404 });
	}

	console.log("form goal");

	const formData = await request.formData();
	const fields = Object.fromEntries(formData);

	const parsedData = createBudgetGoalSchema.safeParse({
		goal: Number.parseFloat(removeNumberFormat(fields.goal as string)) * 100,
	});
	if (!parsedData.success) {
		// TODO: Add status code
		return data(
			{ success: false, errors: parsedData.error.flatten() },
			{ status: 400 },
		);
	}

	await new BudgetGoalsController(db).create(budgetId, parsedData.data);
}
