import { BudgetPannel } from "~/components/BudgetPannel";
import { TransactionsPannel } from "~/components/TransactionsPannel";
import { BudgetController } from "~/server/controllers/BudgetsController";
import { TransactionController } from "~/server/controllers/TransactionController";
import { db } from "~/server/db/drizzle";
import type { Route } from "./+types/home";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import { DolarPriceController } from "~/server/controllers/DolarPriceController";
import { SectionCards } from "~/components/SectionsCards";
import { ExpensesChart } from "~/components/ExpensesChart";
import { DolarHistoryChart } from "~/components/DolarHistoryChart";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export async function loader() {
	const transactionController = new TransactionController(db);
	const dolarPriceController = new DolarPriceController();
	const result = await transactionController.read();
	const budgets = await new BudgetController(db).read();
	const dolarPrice = await dolarPriceController.getDolarPrice();
	const dolarHistory = await dolarPriceController.getDolarPriceHistory(90);
	const totalTransactionCurrentMonth =
		await transactionController.totalTransactionsPerMonth(
			new Date().getMonth() + 1,
		);

	const chartData = await transactionController.getBalancePerDay();

	return {
		transactions: result,
		budgets,
		dolarPrice,
		totalTransactionCurrentMonth,
		chartData,
		dolarHistory,
	};
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const {
		transactions,
		budgets,
		dolarPrice,
		totalTransactionCurrentMonth,
		chartData,
		dolarHistory,
	} = loaderData;

	console.log(dolarHistory);

	return (
		<div className="grid pt-8 px-4 sm:px-8 gap-y-4">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<BreadcrumbPage> Dashboard</BreadcrumbPage>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<SectionCards
				dolarPrice={dolarPrice}
				totalTransactions={totalTransactionCurrentMonth}
			/>
			<div className="grid md:grid-cols-2 gap-4 w-full">
				<div className="flex flex-col gap-4">
					<BudgetPannel budgets={budgets} />
					<ExpensesChart data={chartData} />
					<DolarHistoryChart data={dolarHistory.history} />
				</div>
				<TransactionsPannel transactions={transactions} />
			</div>
		</div>
	);
}
