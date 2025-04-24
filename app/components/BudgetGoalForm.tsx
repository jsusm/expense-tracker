import { format, useNumberFormat } from "@react-input/number-format";
import { type FormEvent, type PropsWithChildren, useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { useFetcher } from "react-router";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function BudgetGoalForm({
	lastGoal,
	children,
	goalDefined,
	budgetId,
}: PropsWithChildren<{
	lastGoal?: number;
	goalDefined?: boolean;
	budgetId: string;
}>) {
	// if the goal is not defined it will open automaticaly
	const [isGoalFormOpen, setGoalFormOpen] = useState(!goalDefined);

	const options = {
		locales: "en",
		maximumFractionDigits: 2,
		format: "currency",
		currency: "USD",
	};

	const goalInputRef = useNumberFormat({ ...options, format: "currency" });

	function copyLastMonthGoal() {
		goalInputRef.current.value = format(lastGoal?.toString() ?? "", {
			...options,
			format: "currency",
		});
	}

	const fetcher = useFetcher();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		// TODO: implement optimistic ui

		await fetcher.submit(e.currentTarget.form, {
			method: "post",
			action: `/budgets/${budgetId}/goals/create`,
		});
		setGoalFormOpen(false);
	}

	return (
		<>
			<Dialog open={isGoalFormOpen} onOpenChange={setGoalFormOpen}>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Set a Goal for this month</DialogTitle>
						<DialogDescription>
							Goals help you to control and realize how much you spend
						</DialogDescription>
					</DialogHeader>
					<fetcher.Form
						className="space-y-4"
						method="post"
						action={`/budgets/${budgetId}/goals/create`}
						onSubmit={handleSubmit}
					>
						{lastGoal && !goalDefined && (
							<div className="flex flex-col justify-between gap-2">
								<p className="text-sm text-stone-400">
									The last month your goal was ${lastGoal}
								</p>
								<Button variant="secondary" onClick={copyLastMonthGoal}>
									Copy last Month Goal
								</Button>
							</div>
						)}
						<div className="space-y-2">
							<Label>New Goal</Label>
							<Input
								id="goal"
								name="goal"
								ref={goalInputRef}
								type="text"
								inputMode="numeric"
							/>
						</div>
						<DialogFooter className="justify-end">
							<Button type="submit">Create</Button>
						</DialogFooter>
					</fetcher.Form>
				</DialogContent>
			</Dialog>
		</>
	);
}
