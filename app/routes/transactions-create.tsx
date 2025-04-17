import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
// import { getCategories } from "~/controllers/transactions";
import type { Route } from "./+types/transactions-create";
import { Button } from "~/components/ui/button";
import { TransactionFormFields } from "~/components/forms/transaction";
import { Form, redirect, useNavigate, data } from "react-router";
import { createTransactionPayload, TransactionController } from "~/server/controllers/transactions";
import { db } from "~/server/db/drizzle";
import type { Category } from "~/controllers/transactions";

export async function clientLoader() {
  const categories: Category[] = []
  return { categories }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const entries = Object.fromEntries(formData)

  const parsedData = createTransactionPayload.safeParse({
    amount: parseInt(entries.amount as string) * 100,
    dateTime: new Date(entries.dateTime as string).toISOString(),
    description: entries.description,
    tags: (entries.tags as string).split(',').map(s => s.trim())
  })

  if (!parsedData.success) {
    console.log(parsedData.error.format())
    throw Response.json({ errors: parsedData.error.format() }, { status: 400 })
  }

  console.log(parsedData.data)

  const controller = new TransactionController(db)

  controller.create(parsedData.data)

  return redirect('/')
}

export default function createTransactionForm({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData
  const navigate = useNavigate()

  return (
    <Form className="grid place-items-center min-h-dvh" method="post">
      <Card className="w-full max-w-sm rounded-none sm:rounded-xl bg-stone-800">
        <CardHeader>
          <CardTitle>Creating transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center flex-col gap-4">
            <TransactionFormFields categories={categories} defaultValues={{
              amount: "100",
              category: "Transportation",
              description: "pepelandia",
              tags: ["pepe", "landia"],
              dateTime: "2025/02/28 12:30"
            }} />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full items-stretch sm:flex-row items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Calcel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Form>
  )
}
