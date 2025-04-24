import { Form, redirect, useActionData, useNavigate } from "react-router";
import { object } from "zod";
import type * as z from "zod";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	BudgetController,
	createBudgetPayload,
} from "~/server/controllers/BudgetsController";
import { db } from "~/server/db/drizzle";
import type { Route } from "./+types/budget-update";

const formSchema = createBudgetPayload;

export async function loader({ params }: Route.LoaderArgs) {
	const budgetId = Number.parseInt(params.budgetId);

	const budget = (await new BudgetController(db).findById(budgetId)).at(0);
	if (!budget) {
		throw new Response("Not Found", { status: 404 });
	}
	return { budget };
}

export async function action({ request, params }: Route.ActionArgs) {
	const formData = await request.formData();
	const entries = Object.fromEntries(formData);

	const parsedData = formSchema.safeParse(entries);
	if (!parsedData.success) {
		return { success: false, errors: parsedData.error.flatten() };
	}
	await new BudgetController(db).update(
		Number.parseInt(params.budgetId),
		parsedData.data,
	);

	return redirect(`/budgets/${params.budgetId}`);
}

export default function BudgetUpdate({ loaderData }: Route.ComponentProps) {
	const navigate = useNavigate();

	const budget = loaderData.budget;

	const actionData = useActionData<{
		errors: z.typeToFlattenedError<z.infer<typeof formSchema>>;
	}>();
	const errors = actionData?.errors.fieldErrors;

	return (
		<Form className="min-h-screen grid place-items-center" method="post">
			<Card className="max-w-sm w-full">
				<CardHeader>
					<CardTitle>Create Budget</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="label">Budget Name</Label>
							<Input
								type="text"
								name="label"
								id="label"
								defaultValue={budget.label}
								placeholder="Self Care, Family, Education, Investment"
							/>
							{errors?.label && (
								<p className="text-xs text-rose-400">{errors.label}</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Input
								type="text"
								name="description"
								id="description"
								defaultValue={budget.description ?? ""}
							/>
							{errors?.description && (
								<p className="text-xs text-rose-400">{errors.description}</p>
							)}
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex-col items-stretch sm:flex-row justify-end gap-4">
					<Button type="button" variant="outline" onClick={() => navigate(-1)}>
						Calcel
					</Button>
					<Button type="submit">Update</Button>
				</CardFooter>
			</Card>
		</Form>
	);
}
