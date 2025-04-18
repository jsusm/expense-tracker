import { TransactionController } from "~/server/controllers/TransactionController";
import type { Route } from "./+types/transactions-delete";
import { db } from "~/server/db/drizzle";
import { redirect } from "react-router";

export async function action({ params }: Route.ActionArgs) {
  const controller = new TransactionController(db)
  let transactionId
  try {
    transactionId = parseInt(params.transactionId)
  } catch (error) {
    throw new Response("Not Found", { status: 404 })
  }

  await controller.delete(transactionId)
  return redirect('/')
}
