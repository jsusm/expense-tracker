import { BudgetController } from "~/server/controllers/BudgetsController";
import type { Route } from "./+types/budget";
import { db } from "~/server/db/drizzle";
import { currencyFormatter } from "~/lib/utils";
import { TransactionController } from "~/server/controllers/TransactionController";
import { TransactionsPannel } from "~/components/TransactionsPannel";
import type { Transaction } from "~/types";
import { BudgetPannel } from "~/components/BudgetPannel";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Link } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
	const budgetId = Number.parseInt(params.budgetId);
	if (Number.isNaN(budgetId)) {
		throw new Response("Not Found", { status: 404 });
	}

	const budget = (await new BudgetController(db).findById(budgetId)).at(0);
	if (budget === undefined) {
		throw new Response("Not Found", { status: 404 });
	}

	const otherBudgets = await new BudgetController(db).read();

	const transactions: Transaction[] = (
		await new TransactionController(db).findByBudgetId(budgetId)
	).map((t) => ({ ...t, budget: { label: budget.label, id: budgetId } }));

	return { budget, transactions, otherBudgets };
}
export default function Budget({ loaderData }: Route.ComponentProps) {
	const { budget, transactions, otherBudgets } = loaderData;

	return (
		<div className="grid sm:pt-8 sm:px-8 gap-y-8">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/">Dashboard</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{budget.label}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="grid">
				<p className="text-lg sm:text-2xl font-medium">{budget.label}</p>
				<p className="text-lg">
					Total Expended:{" "}
					{currencyFormatter.format(budget.budgetExpended / 100)}
				</p>
			</div>
			<div className="grid grid-cols-2 max-w-5xl gap-8">
				<BudgetPannel budgets={otherBudgets} />
				<TransactionsPannel transactions={transactions} />
			</div>
		</div>
	);
}
