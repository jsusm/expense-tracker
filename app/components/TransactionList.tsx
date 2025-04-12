import type { Transaction } from "~/controllers/transactions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map(t => (
            <TableRow key={t.id}>
              <TableCell>{t.amount}</TableCell>
              <TableCell>{t.dateTime}</TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>[{t.tags.join(", ")}]</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
