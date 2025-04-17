import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useNumberFormat } from "@react-input/number-format";
import { format, useMask } from "@react-input/mask";
import type { Budget } from "~/types";

export type TransactionFormFieldsProps = {
  budgets: Budget[],
  defaultValues?: {
    description: string,
    amount: string,
    dateTime: string,
    tags: string[],
    budget: Budget,
  },
  errors?: {
    description?: string[],
    amount?: string[],
    datetime?: string[],
    tags?: string[],
    budget?: string[],
  }
}

function addCero(n: number) {
  if (n <= 9 && n >= 0) {
    return `0${n}`
  }
  return n
}

const options = {
  mask: '____-__-__ __:__',
  replacement: { '_': /\d/ }
}

export function TransactionFormFields({ budgets, defaultValues, errors }: TransactionFormFieldsProps) {
  const dateTimeInputRef = useMask(options)
  const now = defaultValues?.dateTime ? new Date(defaultValues.dateTime) : new Date()
  const defaultDateTime = `${now.getFullYear()}${addCero(now.getMonth() + 1)}${addCero(now.getDate())}${addCero(now.getHours())}${addCero(now.getMinutes())}`


  const defaultDateTimeValue = format(defaultDateTime, options)

  const AmountInputRef = useNumberFormat({
    locales: "en",
    maximumFractionDigits: 2,
    format: "currency",
    currency: "USD"
  })
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Amount</Label>
        <Input
          inputMode="numeric"
          name="amount"
          id="amount"
          type="text"
          ref={AmountInputRef}
          defaultValue={defaultValues?.amount}
        />
        {(errors && errors.amount) && (
          <p className="text-xs text-rose-400">{errors.amount[0]}</p>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>DateTime</Label>
        <Input
          ref={dateTimeInputRef}
          inputMode="numeric"
          name="datetime"
          id="datetime"
          type="text"
          defaultValue={defaultDateTimeValue}
        />
        {(errors && errors.datetime) && (
          <p className="text-xs text-rose-400">{errors.datetime[0]}</p>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Budget</Label>
        <Select name="budgetId" defaultValue={defaultValues?.budget.id.toString()}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Uncategorized" />
          </SelectTrigger>
          <SelectContent>
            {budgets.map(b => (
              <SelectItem key={b.id} value={b.id.toString()}>{b.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(errors && errors.budget) && (
          <p className="text-xs text-rose-400">{errors.budget[0]}</p>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Description</Label>
        <Input
          name="description"
          id="description"
          type="text"
          placeholder="A big burger, scort, shoes ..."
          defaultValue={defaultValues?.description}
        />
        {(errors && errors.description) && (
          <p className="text-xs text-rose-400">{errors.description[0]}</p>
        )}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <div className="grid gap-0.5">
          <Label>Tags</Label>
          <p className="text-xs text-stone-500">Separate tags with commas ","</p>
        </div>
        <Input
          name="tags"
          id="Tags"
          type="text"
          defaultValue={defaultValues?.tags.join(', ')}
        />
        {(errors && errors.tags) && (
          <p className="text-xs text-rose-400">{errors.tags[0]}</p>
        )}
      </div>
    </>
  )

}
