import type { Route } from "./+types/home";
import { TransactionList } from "~/components/TransactionList";
import { Link } from "react-router";
import { db } from "~/server/db/drizzle";
import { TransactionController } from "~/server/controllers/TransactionController";
import { useMemo, useState } from "react";
import { TransactionDetailResponsive } from "~/components/TransactionDetails";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const result = await new TransactionController(db).read()
  return { transactions: result }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { transactions } = loaderData

  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | undefined>(undefined)
  const transaction = useMemo(() => transactions.find(t => t.id == selectedTransactionId), [transactions, selectedTransactionId])

  return (
    <div>
      <nav>
        <Link to="/transactions/create">Create transactions + </Link>
      </nav>
      <TransactionList transactions={transactions} onSelectTransaction={(id: number) => {
        setSelectedTransactionId(id)
        setTransactionDialogOpen(true)
      }} />
      <TransactionDetailResponsive isOpen={transactionDialogOpen} setOpen={setTransactionDialogOpen} transaction={transaction} />
    </div>
  )
}
