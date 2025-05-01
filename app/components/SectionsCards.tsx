import type { DolarPriceController } from "~/server/controllers/DolarPriceController";
import { DolarInfoCard } from "./DolarInfoCard";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import type { TransactionController } from "~/server/controllers/TransactionController";
import { currencyFormatter } from "~/lib/utils";

export function SectionCards({
	dolarPrice,
	totalTransactions,
}: {
	dolarPrice: Awaited<
		ReturnType<typeof DolarPriceController.prototype.getDolarPrice>
	>;
	totalTransactions: Awaited<
		ReturnType<typeof TransactionController.prototype.totalTransactionsPerMonth>
	>;
}) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<Card>
				<CardHeader>
					<CardDescription>Total Expended this Month</CardDescription>
					<CardTitle className="text-2xl lg:text-3xl">
						{currencyFormatter.format(totalTransactions?.amount / 100)}
					</CardTitle>
				</CardHeader>
				<CardFooter>
					<p className="text-muted-foreground text-sm">
						In {totalTransactions.count} transactions
					</p>
				</CardFooter>
			</Card>
			<DolarInfoCard price={dolarPrice.paralelo} title="Parallel Dolar" />
			<DolarInfoCard price={dolarPrice.oficial} title="BDV Dolar" />
			<Card>
				<CardHeader>
					<CardDescription>BCV - Parallel Gap</CardDescription>
					<CardTitle className="text-2xl lg:text-3xl">
						{Math.abs(
							dolarPrice.paralelo.price - dolarPrice.oficial.price,
						).toFixed(2)}{" "}
						-{" "}
						{(
							(1 - dolarPrice.oficial.price / dolarPrice.paralelo.price) *
							100
						).toFixed(2)}{" "}
						%
					</CardTitle>
				</CardHeader>
				<CardFooter>
					<p className="text-muted-foreground text-sm">
						This metric is calculated as how much money you woud loose if you
						trade dolars from BCV to Parallel
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
