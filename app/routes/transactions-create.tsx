import { Form, data, redirect, useActionData, useNavigate } from "react-router";
import * as z from "zod";
import { TransactionFormFields } from "~/components/forms/transaction";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { BudgetController } from "~/server/controllers/BudgetsController";
import { TransactionController } from "~/server/controllers/TransactionController";
import { db } from "~/server/db/drizzle";
import type { Route } from "./+types/transactions-create";

export async function loader() {
	const budgets = await new BudgetController(db).getBudgets();
	return { budgets };
}

const formSchema = z.object({
	amount: z.coerce.number().gt(0),
	datetime: z.string().regex(/\d{4}-\d\d-\d\d \d\d:\d\d/),
	tags: z.string(),
	description: z.string(),
	budgetId: z.coerce.number(),
});

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const entries = Object.fromEntries(formData);

	const parsedData = formSchema.safeParse({
		...entries,
		amount: (entries.amount as string).replaceAll("$", "").replaceAll(",", ""),
	});

	// Handle error
	if (!parsedData.success) {
		return { success: false, errors: parsedData.error.flatten() };
	}
	const controller = new TransactionController(db);
	await controller.create({
		...parsedData.data,

		// Convert to cents
		amount: parsedData.data.amount * 100,

		// Parse Tags
		tags: parsedData.data.tags.split(",").map((t) => t.trim()),
	});

	return redirect("/");
}

export default function createTransactionForm({
	loaderData,
}: Route.ComponentProps) {
	const { budgets } = loaderData;
	const navigate = useNavigate();
	const actionData = useActionData<{
		success: false;
		errors?: z.typeToFlattenedError<z.infer<typeof formSchema>>;
	}>();

	return (
		<Form className="grid place-items-center min-h-dvh" method="post">
			<Card className="w-full max-w-sm rounded-none sm:rounded-xl bg-stone-800">
				<CardHeader>
					<CardTitle>Creating transaction</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center flex-col gap-4">
						<TransactionFormFields
							budgets={budgets}
							errors={actionData?.errors?.fieldErrors}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<div className="flex flex-col w-full items-stretch sm:flex-row justify-end gap-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => navigate(-1)}
						>
							Calcel
						</Button>
						<Button type="submit">Create</Button>
					</div>
				</CardFooter>
			</Card>
		</Form>
	);
}
