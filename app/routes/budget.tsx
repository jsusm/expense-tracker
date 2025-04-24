import { Link } from "react-router";
import { BudgetGoalForm } from "~/components/BudgetGoalForm";
import { BudgetPannel } from "~/components/BudgetPannel";
import { TransactionsPannel } from "~/components/TransactionsPannel";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { currencyFormatter } from "~/lib/utils";
import { BudgetController } from "~/server/controllers/BudgetsController";
import { TransactionController } from "~/server/controllers/TransactionController";
import { db } from "~/server/db/drizzle";
import type { Transaction } from "~/types";
import type { Route } from "./+types/budget";
import { BudgetDeleteDialog } from "~/components/BudgetDeleteDialog";

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
		<div className="grid sm:pt-8 pt-8 px-4 sm:px-8 gap-y-8">
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
			<div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
				<div>
					<p className="text-lg sm:text-2xl font-medium">{budget.label}</p>
					<p className="text-lg">
						Total Expended:{" "}
						{currencyFormatter.format(budget.budgetExpended / 100)}
						{budget.goal?.defined && (
							<span>
								/ {currencyFormatter.format((budget.goal.goal ?? 0) / 100)}
							</span>
						)}
					</p>
				</div>
				<div className="flex gap-4">
					<BudgetGoalForm
						lastGoal={budget.goal?.lastGoal}
						goalDefined={budget.goal?.defined}
						budgetId={budget.id.toString()}
					>
						<Button variant={budget.goal?.defined ? "secondary" : "default"}>
							{!budget.goal?.defined ? "Define a Goal" : "Change goal"}
						</Button>
					</BudgetGoalForm>
					<Button variant="secondary">
						<Link to={`/budgets/${budget.id}/update`}>Edit</Link>
					</Button>
					<BudgetDeleteDialog budgetId={budget.id}>
						<Button variant="destructive">Delete</Button>
					</BudgetDeleteDialog>
				</div>
			</div>
			<div className="grid md:grid-cols-2 max-w-5xl gap-8">
				<BudgetPannel budgets={otherBudgets} />
				<TransactionsPannel transactions={transactions} />
			</div>
		</div>
	);
}
