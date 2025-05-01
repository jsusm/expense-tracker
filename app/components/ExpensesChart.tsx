import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "~/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import type { TransactionAmountPerDay } from "~/server/controllers/TransactionController";

const chartConfig = {
	expended: {
		label: "Expended",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export const ExpensesChart = ({
	data,
}: { data: TransactionAmountPerDay[] }) => {
	const dateFormatter = new Intl.DateTimeFormat("en", {
		day: "2-digit",
		month: "short",
	});
	const chartData = data.map((v) => ({ ...v, expended: v.expended / 100 }));
	return (
		<Card>
			<CardHeader>
				<CardTitle>Expenses Per Day</CardTitle>
			</CardHeader>
			<CardContent className="relative">
				<ChartContainer
					config={chartConfig}
					className="max-h-[300px] md:w-full"
				>
					<AreaChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 16,
							right: 16,
						}}
					>
						<XAxis
							dataKey="date"
							tickLine={false}
							tickMargin={8}
							tickFormatter={(v) => dateFormatter.format(new Date(v))}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<CartesianGrid vertical={false} />
						<defs>
							<linearGradient id="fillExpended" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="var(--color-expended)"
									stopOpacity={0.8}
								/>
								<stop
									offset="95%"
									stopColor="var(--color-expended)"
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>

						<Area
							dataKey="expended"
							type="monotone"
							fill="url(#fillExpended)"
							fillOpacity={0.4}
							stroke="var(--color-expended)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
