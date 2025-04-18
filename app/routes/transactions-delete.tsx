import { redirect } from "react-router";
import { TransactionController } from "~/server/controllers/TransactionController";
import { db } from "~/server/db/drizzle";
import type { Route } from "./+types/transactions-delete";

export async function action({ params }: Route.ActionArgs) {
	const controller = new TransactionController(db);
	let transactionId: number;
	try {
		transactionId = Number.parseInt(params.transactionId);
	} catch (error) {
		throw new Response("Not Found", { status: 404 });
	}

	await controller.delete(transactionId);
	return redirect("/");
}
