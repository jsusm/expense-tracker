import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "~/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";
import type { TransactionAmountPerDay } from "~/server/controllers/TransactionController";
import type {
	DolarHistoryPriceData,
	DolarHistoryPriceDataAPI,
} from "~/server/controllers/DolarPriceController";

const chartConfig = {
	oficial: {
		label: "Oficial",
		color: "var(--chart-1)",
	},
	parallel: {
		label: "Parallel",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

export const DolarHistoryChart = ({
	data,
}: {
	data: DolarHistoryPriceData[];
}) => {
	const dateFormatter = new Intl.DateTimeFormat("en", {
		day: "2-digit",
		month: "short",
	});

	console.log({ data });

	return (
		<Card>
			<CardHeader>
				<CardTitle>Dolar Price History</CardTitle>
			</CardHeader>
			<CardContent className="relative">
				<ChartContainer
					config={chartConfig}
					className="max-h-[250px] md:w-full"
				>
					<LineChart
						accessibilityLayer
						data={data}
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

						<Line
							dataKey="oficialPrice"
							type="linear"
							stroke="var(--color-oficial)"
							strokeWidth={2}
							dot={false}
						/>
						<Line
							dataKey="parallelPrice"
							type="linear"
							strokeWidth={2}
							stroke="var(--color-parallel)"
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};
