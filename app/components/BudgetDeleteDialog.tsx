import type { FormEvent, PropsWithChildren } from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogContent,
} from "./ui/alert-dialog";
import { Form, useFetcher } from "react-router";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { Button } from "./ui/button";

export function BudgetDeleteDialog({
	children,
	budgetId,
}: PropsWithChildren<{ budgetId: number }>) {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want do delete this budget
					</AlertDialogTitle>
					<AlertDialogDescription>
						All the transactions in this budget will be market as uncategorized
					</AlertDialogDescription>
				</AlertDialogHeader>
				<Form action={`/budgets/${budgetId}/delete`} method="post">
					<AlertDialogFooter>
						<AlertDialogCancel>Calcel</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button type="submit" variant="destructive">
								Delete
							</Button>
						</AlertDialogAction>
					</AlertDialogFooter>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
