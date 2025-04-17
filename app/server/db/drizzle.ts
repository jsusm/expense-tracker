import { drizzle } from 'drizzle-orm/libsql'

const dbURL = process.env.DATABASE_URL
if (typeof dbURL !== 'string') {
	throw Error("DATABASE_URL env variable is not defined.")
}

export const db = drizzle(dbURL)
