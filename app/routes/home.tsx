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

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export async function loader() {
	const transactionController = new TransactionController(db);
	const result = await transactionController.read();
	const budgets = await new BudgetController(db).read();
	const dolarPrice = await new DolarPriceController().getDolarPrice();
	const totalTransactionCurrentMonth =
		await transactionController.totalTransactionsPerMonth(
			new Date().getMonth() + 1,
		);

	return {
		transactions: result,
		budgets,
		dolarPrice,
		totalTransactionCurrentMonth,
	};
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { transactions, budgets, dolarPrice, totalTransactionCurrentMonth } =
		loaderData;

	return (
		<div className="grid pt-8 px-4 sm:px-8 gap-y-8">
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
			<div className="grid md:grid-cols-2 gap-8 w-full">
				<BudgetPannel budgets={budgets} />
				<TransactionsPannel transactions={transactions} />
			</div>
		</div>
	);
}
