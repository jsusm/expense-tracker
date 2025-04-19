import { useMediaQuery } from "@uidotdev/usehooks";
import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";
import { Separator } from "~/components/ui/separator";
import { cn, currencyFormatter } from "~/lib/utils";
import type { Transaction } from "~/types";

function TransactionDetails({
	transaction,
	className,
}: { transaction?: Transaction; className?: string }) {
	return (
		<div className={cn("space-y-8 pb-4", className)}>
			<div className="flex justify-between items-center">
				<p className="font-medium text-lg">You spend</p>
				<p className="font-medium text-lg">
					{currencyFormatter.format(transaction?.amount / 100)}
				</p>
			</div>
			<div className="flex justify-between items-center">
				<p className="font-medium text-sm sm:text-base">At</p>
				<p className="font-medium text-sm sm:text-base">
					{transaction?.datetime}
				</p>
			</div>
			<div className="flex justify-between items-center">
				<p className="font-medium text-sm sm:text-base">Tags</p>
				<div className="flex gap-4">
					{transaction?.tags.map((t) => (
						<Button key={t} size="sm" variant="outline">
							{t}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}

export function TransactionDetailResponsive({
	transaction,
	isOpen,
	setOpen,
}: {
	transaction?: Transaction;
	isOpen: boolean;
	setOpen: (v: boolean) => void;
}) {
	if (typeof window === "undefined") {
		return null;
	}
	const isDesktop = useMediaQuery("(min-width: 768px)");
	if (isDesktop) {
		return (
			<Dialog open={isOpen} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{transaction?.budget.label}</DialogTitle>
						<DialogDescription>{transaction?.description}</DialogDescription>
					</DialogHeader>
					<TransactionDetails transaction={transaction} />
					<DialogFooter>
						<Button variant="secondary" asChild>
							<Link to={`/transactions/${transaction?.id}/edit`}>Update</Link>
						</Button>
						<Form
							action={`/transactions/${transaction?.id}/delete`}
							method="POST"
							onSubmit={() => setOpen(false)}
						>
							<Button variant="destructive">Delete</Button>
						</Form>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={isOpen} onOpenChange={setOpen}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{transaction?.budget.label}</DrawerTitle>
					<DrawerDescription>{transaction?.description}</DrawerDescription>
				</DrawerHeader>
				<TransactionDetails transaction={transaction} className="px-4" />
				<DrawerFooter>
					<Button variant="secondary" asChild>
						<Link to={`/transactions/${transaction?.id}/edit`}>Update</Link>
					</Button>
					<Form
						action={`/transactions/${transaction?.id}/delete`}
						method="POST"
						className="w-full flex flex-col"
						onSubmit={() => setOpen(false)}
					>
						<Button variant="destructive">Delete</Button>
					</Form>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
