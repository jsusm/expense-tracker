import { useMemo, useState } from "react";
import { Link } from "react-router";
import type { Transaction } from "~/types";
import { TransactionDetailResponsive } from "./TransactionDetails";
import { TransactionList } from "./TransactionList";
import { Button } from "./ui/button";

export function TransactionsPannel({
	transactions,
	className,
}: { transactions: Transaction[]; className?: string }) {
	const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
	const [selectedTransactionId, setSelectedTransactionId] = useState<
		number | undefined
	>(undefined);
	const transaction = useMemo(
		() => transactions.find((t) => t.id === selectedTransactionId),
		[transactions, selectedTransactionId],
	);

	return (
		<div className={className}>
			<div className="py-4 flex justify-between">
				<p className="text-lg font-medium">Transactions</p>
				<Button asChild>
					<Link to="/transactions/create">Create transactions + </Link>
				</Button>
			</div>
			<TransactionList
				transactions={transactions}
				onSelectTransaction={(id: number) => {
					setSelectedTransactionId(id);
					setTransactionDialogOpen(true);
				}}
			/>
			<TransactionDetailResponsive
				isOpen={transactionDialogOpen}
				setOpen={setTransactionDialogOpen}
				transaction={transaction}
			/>
		</div>
	);
}
