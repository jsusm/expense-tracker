import { getTransactions } from "~/controllers/transactions";
import type { Route } from "./+types/home";
import { TransactionList } from "~/components/TransactionList";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const transactions = await getTransactions()
  return { transactions }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { transactions } = loaderData
  return (
    <div>
      <TransactionList transactions={transactions} />
    </div>
  )
}
