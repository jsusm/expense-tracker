import type { Route } from "./+types/home";
import { TransactionList } from "~/components/TransactionList";
import { Link } from "react-router";
import { db } from "~/server/db/drizzle";
import { TransactionController } from "~/server/controllers/TransactionController";
import { useMemo, useState } from "react";
import { TransactionDetailResponsive } from "~/components/TransactionDetails";
import { Button } from "~/components/ui/button";
import { budgets } from "~/server/db/schema";
import { BudgetController } from "~/server/controllers/BudgetsController";
import { currencyFormatter } from "~/lib/utils";
import { Progress } from "~/components/ui/progress";
import { TransactionsPannel } from "~/components/TransactionsPannel";
import { BudgetPannel } from "~/components/BudgetPannel";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const result = await new TransactionController(db).read()
  const budgets = await new BudgetController(db).read()

  console.log(budgets)

  return { transactions: result, budgets }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { transactions, budgets } = loaderData

  return (
    <div className="flex flex-col md:flex-row">
      <BudgetPannel budgets={budgets} className="md:w-lg" />
      <TransactionsPannel className="md:w-lg" transactions={transactions} />
    </div>
  )
}
