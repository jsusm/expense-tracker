import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useMask, type MaskOptions, format } from "@react-input/mask"
import { useNumberFormat } from "@react-input/number-format"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { getCategories } from "~/controllers/transactions";
import type { Route } from "./+types/transactions-create";
import { Button } from "~/components/ui/button";

function addCero(n: number) {
  if (n <= 9 && n >= 0) {
    return `0${n}`
  }
  return n
}

const options = {
  mask: '____/__/__ h_:__',
  replacement: { '_': /\d/, 'h': /[0 1]/ }
}

export async function clientLoader() {
  const categories = await getCategories()
  return { categories }

}

export default function createTransactionForm({ loaderData }: Route.ComponentProps) {
  const { categories } = loaderData

  const dateTimeInputRef = useMask(options)
  const now = new Date()
  const defaultDateTime = `${now.getFullYear()}${addCero(now.getMonth())}${addCero(now.getDate())}${addCero(now.getHours())}${addCero(now.getMinutes())}`

  const defaultDateTimeValue = format(defaultDateTime, options)

  const AmountInputRef = useNumberFormat({
    locales: "en",
    maximumFractionDigits: 2
  })


  return (
    <div className="grid place-items-center min-h-dvh">
      <Card className="w-full max-w-sm rounded-none sm:rounded-xl bg-stone-800">
        <CardHeader>
          <CardTitle>Creating transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center flex-col gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label>Amount</Label>
              <Input
                inputMode="numeric"
                name="amount"
                id="amount"
                type="text"
                ref={AmountInputRef}
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
              <Select name="category-id">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Uncategorized" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id} >{c.label}</SelectItem>
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
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full items-stretch sm:flex-row items-center justify-end gap-4">
            <Button type="button" variant="outline">
              Calcel
            </Button>
            <Button type="submit">
              Create
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
