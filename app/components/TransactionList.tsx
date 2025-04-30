import { cn, currencyFormatter, getBudgetColor } from "~/lib/utils";
import type { Transaction } from "~/types";

export type TransactionListProps = {
	transactions: Transaction[];
	onSelectTransaction: (id: number) => void;
};

export function TransactionList({
	transactions,
	onSelectTransaction,
}: TransactionListProps) {
	return (
		<div className="">
			<ul className="flex flex-col sm:gap-4 gap-3">
				{!transactions.length && (
					<p className="sm:text-lg font-medium text-center">
						There's no Transactions
					</p>
				)}
				{transactions.map((t) => (
					<li key={t.id}>
						<button
							type="button"
							className="flex items-center gap-4 border border-stone-800 hover:border-stone-700 rounded-lg bg-stone-800 px-3 sm:px-4 py-2 sm:py-3 shadow group relative active:bg-stone-900 transition-colors w-full"
							onClick={() => onSelectTransaction(t.id)}
						>
							<div className="flex gap-1 group-hover:opacity-100 opacity-0 transition absolute right-0 -top-3">
								{t.tags
									.filter((t) => !!t)
									.map((tag) => (
										<span
											key={tag}
											className="px-1 py-0.5 text-xs text-stone-400 bg-stone-800 shadow rounded border border-stone-600 hover:bg-stone-700 transition cursor-pointer active:bg-stone-900"
										>
											{tag}
										</span>
									))}
							</div>
							<i
								className={cn(
									"size-4 rounded-full bg-amber-400 shadow-xs",
									getBudgetColor(t.budget.label),
								)}
							/>
							<div className="flex-1 flex justify-between items-center">
								<div className="grid gap-0.5 text-left">
									<p className="sm:text-lg font-medium text-stone-100 leading-6">
										{t.budget.label}
									</p>
									<p className="text-xs sm:text-sm text-stone-400">
										{t.description}
									</p>
								</div>
								<div className="text-right">
									<p className="sm:text-lg text-stone-100 font-medium leading-6">
										{currencyFormatter.format(t.amount / 100)}
									</p>
									<div className="flex gap-2 items-center">
										<p className="text-xs sm:text-sm text-stone-400">
											{t.datetime}
										</p>
									</div>
								</div>
							</div>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
