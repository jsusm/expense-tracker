import 'dotenv'
import { defineConfig } from 'drizzle-kit'


export default defineConfig({
  out: './drizzle',
  schema: './app/server/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
})


