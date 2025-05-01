import "dotenv";
import { TransactionController } from "../controllers/TransactionController";
import { db } from "../db/drizzle";

const controller = new TransactionController(db);

console.log(await controller.getBalancePerDay());
