import { BudgetPannel } from "~/components/BudgetPannel";
import { TransactionsPannel } from "~/components/TransactionsPannel";
import { BudgetController } from "~/server/controllers/BudgetsController";
import { TransactionController } from "~/server/controllers/TransactionController";
import { db } from "~/server/db/drizzle";
import type { Route } from "./+types/home";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export async function loader() {
	const result = await new TransactionController(db).read();
	const budgets = await new BudgetController(db).read();

	console.log(budgets);

	return { transactions: result, budgets };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { transactions, budgets } = loaderData;

	return (
		<div className="flex flex-col md:flex-row">
			<BudgetPannel budgets={budgets} className="md:w-lg" />
			<TransactionsPannel className="md:w-lg" transactions={transactions} />
		</div>
	);
}
