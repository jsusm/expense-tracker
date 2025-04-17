
// export async function loader({ params }: Route.LoaderArgs) {
//   const transaction = await getTransactionById(params.transactionId)
//   if (!transaction) {
//     throw new Response("Not Found", { status: 404 })
//   }

//   const categories = await getCategories()
//   return { categories, transaction }
// }

// export async function action({ request }: Route.ActionArgs) {
//   const formData = await request.formData()
//   const entries = Object.fromEntries(formData)
//   console.log(entries)
//   return redirect('/')
// }

// export default function createTransactionForm({ loaderData }: Route.ComponentProps) {
//   const { categories, transaction } = loaderData
//   const navigate = useNavigate()

//   return (
//     <Form className="grid place-items-center min-h-dvh" method="post">
//       <Card className="w-full max-w-sm rounded-none sm:rounded-xl bg-stone-800">
//         <CardHeader>
//           <CardTitle>Creating transaction</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center flex-col gap-4">
//             <TransactionFormFields categories={categories} defaultValues={{
//               amount: transaction.amount.toString(),
//               category: transaction.category,
//               dateTime: transaction.dateTime,
//               description: transaction.description,
//               tags: transaction.tags,
//             }} />
//           </div>
//         </CardContent>
//         <CardFooter>
//           <div className="flex flex-col w-full items-stretch sm:flex-row justify-end gap-4">
//             <Button type="button" variant="outline" onClick={() => navigate(-1)}>
//               Calcel
//             </Button>
//             <Button type="submit">
//               Create
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </Form>
//   )
// }
