import { useMemo, useState } from "react";
import { Link } from "react-router";
import type { Transaction } from "~/types";
import { TransactionDetailResponsive } from "./TransactionDetails";
import { TransactionList } from "./TransactionList";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
		<Card className={className}>
			<CardHeader className="flex justify-between items-center">
				<CardTitle>Transactions</CardTitle>
				<Button asChild variant="secondary">
					<Link to="/transactions/create">Create transactions + </Link>
				</Button>
			</CardHeader>
			<CardContent>
				<TransactionList
					transactions={transactions}
					onSelectTransaction={(id: number) => {
						setSelectedTransactionId(id);
						setTransactionDialogOpen(true);
					}}
				/>
			</CardContent>
			<TransactionDetailResponsive
				isOpen={transactionDialogOpen}
				setOpen={setTransactionDialogOpen}
				transaction={transaction}
			/>
		</Card>
	);
}
