import { useMemo, useState } from "react";
import { Link } from "react-router";
import { BudgetPannel } from "~/components/BudgetPannel";
import { TransactionDetailResponsive } from "~/components/TransactionDetails";
import { TransactionList } from "~/components/TransactionList";
import { TransactionsPannel } from "~/components/TransactionsPannel";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { currencyFormatter } from "~/lib/utils";
import { BudgetController } from "~/server/controllers/BudgetsController";
import { TransactionController } from "~/server/controllers/TransactionController";
import { db } from "~/server/db/drizzle";
import { budgets } from "~/server/db/schema";
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
