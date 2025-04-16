import type { Category } from "~/controllers/transactions";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useNumberFormat } from "@react-input/number-format";
import { format, useMask } from "@react-input/mask";

export type TransactionFormFieldsProps = {
  categories: Category[],
  defaultValues?: {
    description: string,
    amount: string,
    dateTime: string,
    tags: string[],
    category: string,
  }
}

function addCero(n: number) {
  if (n <= 9 && n >= 0) {
    return `0${n}`
  }
  return n
}

const options = {
  mask: '____/__/__ h_:__',
  replacement: { '_': /\d/, 'h': /[0 2]/ }
}

export function TransactionFormFields({ categories, defaultValues }: TransactionFormFieldsProps) {
  const dateTimeInputRef = useMask(options)
  const now = defaultValues?.dateTime ? new Date(defaultValues.dateTime) : new Date()
  const defaultDateTime = `${now.getFullYear()}${addCero(now.getMonth())}${addCero(now.getDate())}${addCero(now.getHours())}${addCero(now.getMinutes())}`
  console.log(defaultDateTime);


  const defaultDateTimeValue = format(defaultDateTime, options)

  const AmountInputRef = useNumberFormat({
    locales: "en",
    maximumFractionDigits: 2
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
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>DateTime</Label>
        <Input
          ref={dateTimeInputRef}
          inputMode="numeric"
          name="dateTime"
          id="dateTime"
          type="text"
          defaultValue={defaultDateTimeValue}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Category</Label>
        <Select name="category-id" defaultValue={defaultValues?.category}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Uncategorized" defaultValue={defaultValues?.category} />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.label}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <div className="grid gap-0.5">
          <Label>Tags</Label>
          <p className="text-xs text-stone-500">Separate tags with commas ","</p>
        </div>
        <Input
          name="Tags"
          id="Tags"
          type="text"
          defaultValue={defaultValues?.tags.join(', ')}
        />
      </div>
    </>
  )

}
