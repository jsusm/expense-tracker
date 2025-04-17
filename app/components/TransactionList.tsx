import type { Transaction } from "~/controllers/transactions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Button } from "./ui/button"
import { Link } from "react-router"

export type TransactionListProps = {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead> Amount </TableHead>
            <TableHead> Date </TableHead>
            <TableHead> Category </TableHead>
            <TableHead> Description </TableHead>
            <TableHead> Tags </TableHead>
            <TableHead> Actions </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map(t => (
            <TableRow key={t.id}>
              <TableCell>{t.amount}</TableCell>
              <TableCell>{t.dateTime}</TableCell>
              <TableCell>{t.category.label}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>[{t.tags.join(", ")}]</TableCell>
              <TableCell>
                <Button variant="link" className="px-1" asChild>
                  <Link to={`/transactions/${t.id}/edit`}>
                    [update]
                  </Link>
                </Button>
                <Button variant="link" className="px-1">
                  <Link to={`/transactions/${t.id}/delete`}>
                    [delete]
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
