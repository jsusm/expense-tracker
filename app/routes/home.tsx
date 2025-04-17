import type { Route } from "./+types/home";
import { TransactionList } from "~/components/TransactionList";
import { Link } from "react-router";
import { db } from "~/server/db/drizzle";
import { TransactionController } from "~/server/controllers/TransactionController";
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "~/components/ui/dialog";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import type { Transaction } from "~/types";
import { useMediaQuery } from '@uidotdev/usehooks'
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "~/components/ui/drawer";
import { cn } from "~/lib/utils";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  const result = await new TransactionController(db).read()
  return { transactions: result }
}

function TransactionDetails({ transaction, className }: { transaction?: Transaction, className?: string }) {
  return (
    <div className={cn("space-y-8 pb-4", className)}>
      <div className="flex justify-between items-center">
        <p className="font-medium text-lg">You spend</p>
        <p className="font-medium text-lg">{transaction?.amount}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="font-medium text-sm sm:text-base">At</p>
        <p className="font-medium text-sm sm:text-base">{transaction?.datetime}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="font-medium text-sm sm:text-base">Tags</p>
        <div className="flex gap-4">
          {transaction?.tags.map(t => (
            <Button size='sm' variant='outline'>{t}</Button>
          ))}
        </div>
      </div>
    </div>
  )

}


function TransactionDetailResponsive({ transaction, isOpen, setOpen }: { transaction?: Transaction, isOpen: boolean, setOpen: (v: boolean) => void }) {
  if (typeof window === 'undefined') {
    return null
  }
  const isDesktop = useMediaQuery("(min-width: 768px)")
  if (isDesktop) {

    return (
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transaction?.budget.label}
            </DialogTitle>
            <DialogDescription>
              {transaction?.description}
            </DialogDescription>
          </DialogHeader>
          <TransactionDetails transaction={transaction} />
          <DialogFooter>
            <Button variant='secondary' asChild>
              <Link to={`/transactions/${transaction?.id}/edit`}>
                Update
              </Link>
            </Button>
            <Button variant='destructive'>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

  }

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {transaction?.budget.label}
          </DrawerTitle>
          <DrawerDescription>
            {transaction?.description}
          </DrawerDescription>
        </DrawerHeader>
        <TransactionDetails transaction={transaction} className="px-4" />
        <DrawerFooter>
          <Button variant='secondary' asChild>
            <Link to={`/transactions/${transaction?.id}/edit`}>
              Update
            </Link>
          </Button>
          <Button variant='destructive'>Delete</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { transactions } = loaderData

  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | undefined>(undefined)
  const transaction = useMemo(() => transactions.find(t => t.id == selectedTransactionId), [transactions, selectedTransactionId])

  return (
    <div>
      <nav>
        <Link to="/transactions/create">Create transactions + </Link>
      </nav>
      <TransactionList transactions={transactions} onSelectTransaction={(id: number) => {
        setSelectedTransactionId(id)
        setTransactionDialogOpen(true)
      }} />
      <TransactionDetailResponsive isOpen={transactionDialogOpen} setOpen={setTransactionDialogOpen} transaction={transaction} />
    </div>
  )
}
