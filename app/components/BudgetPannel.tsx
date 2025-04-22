import { Link } from "react-router";
import { currencyFormatter } from "~/lib/utils";
import type { BudgetView } from "~/types";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export function BudgetPannel({
	budgets,
	className,
	title = "Budgets",
}: { budgets: BudgetView[]; className?: string; title?: string }) {
	return (
		<div className={className}>
			<div className="py-4 flex justify-between">
				<p className="text-lg font-medium">{title}</p>
				<Button asChild>
					<Link to="/budgets/create">Create Budget + </Link>
				</Button>
			</div>
			<div className="">
				<ul className="flex flex-col sm:gap-4 gap-3">
					{budgets.map((b) => (
						<li key={b.id}>
							<Link
								to={`/budgets/${b.id}`}
								className="flex items-center gap-4 border border-stone-800 hover:border-stone-700 rounded-lg bg-stone-800 px-3 sm:px-4 py-2 sm:py-3 shadow group relative active:bg-stone-900 transition-colors w-full"
							>
								<i className="size-4 rounded-full bg-amber-400 shadow-xs" />
								<div className="w-full grid gap-2">
									<div className="flex-1 flex justify-between items-center">
										<p className="sm:text-lg font-medium text-stone-100 leading-6">
											{b.label}
										</p>
										<p className="sm:text-lg text-stone-100 font-medium leading-6">
											{currencyFormatter.format(b.budgetExpended / 100)}
										</p>
									</div>
									{b.goal?.defined && (
										<div className="w-full">
											<Progress
												value={(b.budgetExpended * 100) / b.goal.goal}
											/>
										</div>
									)}
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
