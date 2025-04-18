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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { BudgetController } from "~/server/controllers/BudgetsController";
import {
	TransactionController,
	createTransactionPayload,
} from "~/server/controllers/TransactionController";
import { db } from "~/server/db/drizzle";
import type { Budget } from "~/types";
import type { Route } from "./+types/transactions-update";

export async function loader({ params }: Route.LoaderArgs) {
	let transactionId: number;
	try {
		transactionId = Number.parseInt(params.transactionId);
	} catch (error) {
		throw new Response("Not found", { status: 404 });
	}

	const budgets = await new BudgetController(db).getBudgets();
	const transaction = await new TransactionController(db).findById(
		transactionId,
	);
	console.log(transaction);

	if (!transaction) {
		throw new Response("Not found", { status: 404 });
	}

	return { budgets, transaction };
}

const formSchema = z.object({
	amount: z
		.string()
		.transform((v) => v.replaceAll(",", ""))
		.pipe(z.coerce.number()),
	datetime: z.string().regex(/\d{4}-\d\d-\d\d \d\d:\d\d/),
	tags: z.string(),
	description: z.string(),
	budgetId: z.coerce.number(),
});

export async function action({ request, params }: Route.ActionArgs) {
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
	const transactionId = Number.parseInt(params.transactionId);

	await controller.update(transactionId, {
		...parsedData.data,

		// Convert to cents
		amount: parsedData.data.amount * 100,

		// Parse Tags
		tags: parsedData.data.tags.split(",").map((t) => t.trim()),
	});

	return redirect("/");
}

export default function updateTransactionForm({
	loaderData,
}: Route.ComponentProps) {
	const { budgets, transaction } = loaderData;
	const navigate = useNavigate();
	const actionData = useActionData<{
		success: false;
		errors?: z.typeToFlattenedError<z.infer<typeof formSchema>>;
	}>();

	return (
		<Form className="grid place-items-center min-h-dvh" method="post">
			<Card className="w-full max-w-sm rounded-none sm:rounded-xl bg-stone-800">
				<CardHeader>
					<CardTitle>Update transaction</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center flex-col gap-4">
						<TransactionFormFields
							budgets={budgets}
							errors={actionData?.errors?.fieldErrors}
							defaultValues={{ ...transaction }}
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
						<Button type="submit">Update</Button>
					</div>
				</CardFooter>
			</Card>
		</Form>
	);
}
