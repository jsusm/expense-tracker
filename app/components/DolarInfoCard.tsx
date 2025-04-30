import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { DolarPriceData } from "~/server/controllers/DolarPriceController";
import { cn, currencyFormatterVES } from "~/lib/utils";
import { Badge } from "./ui/badge";

export function DolarInfoCard({
	price,
	title,
}: { price: DolarPriceData; title: string }) {
	const priceChangeSign = price.price < price.price_old ? -1 : 1;

	console.log({ priceChangeSign, title, price });

	const TrendingIcon = priceChangeSign === -1 ? TrendingDown : TrendingUp;

	return (
		<Card>
			<CardHeader className="relative">
				<CardDescription>{title}</CardDescription>
				<CardTitle className="text-2xl lg:text-3xl">
					{currencyFormatterVES.format(price.price)}
				</CardTitle>
				<div className="absolute right-4 top-0">
					<Badge variant="outline" className="flex gap-1 text-xs font-semibold">
						<TrendingIcon
							className={cn(
								"size-3",
								priceChangeSign === -1 ? "text-rose-400" : "text-lime-400",
							)}
						/>
						<span>{price.percent * priceChangeSign}%</span>
					</Badge>
				</div>
			</CardHeader>
			<CardFooter>
				<div className="text-mono text-muted-foreground text-sm flex flex-wrap gap-y-1 gap-x-2">
					<Badge variant={"outline"}>
						Change:{" "}
						{currencyFormatterVES.format(price.change * priceChangeSign)}
					</Badge>
					<Badge variant={"outline"}>
						Old price: {currencyFormatterVES.format(price.price_old)}
					</Badge>
					<Badge variant={"outline"}>Fecha: {price.last_update}</Badge>
				</div>
			</CardFooter>
		</Card>
	);
}
