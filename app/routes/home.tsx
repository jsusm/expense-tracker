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
import { DolarInfoCard } from "~/components/DolarInfoCard";

export function meta() {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export async function loader() {
	const result = await new TransactionController(db).read();
	const budgets = await new BudgetController(db).read();
	const dolarPrice = await new DolarPriceController().getDolarPrice();

	return { transactions: result, budgets, dolarPrice };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	const { transactions, budgets, dolarPrice } = loaderData;

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
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				<DolarInfoCard price={dolarPrice.paralelo} title="Parallel Dolar" />
				<DolarInfoCard price={dolarPrice.oficial} title="BDV Dolar" />
			</div>
			<div className="grid md:grid-cols-2 gap-8 w-full">
				<BudgetPannel budgets={budgets} />
				<TransactionsPannel transactions={transactions} />
			</div>
		</div>
	);
}
