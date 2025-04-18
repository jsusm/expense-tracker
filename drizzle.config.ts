import "dotenv";
import { defineConfig } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	throw Error("DATABASE_URL env variable is not defined");
}

export default defineConfig({
	out: "./drizzle",
	schema: "./app/server/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: DATABASE_URL,
	},
});
