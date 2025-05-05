import { addCero } from "~/lib/utils";

export type DolarPriceData = {
	change: number;
	color: string;
	image: string;
	last_update: string;
	percent: number;
	price: number;
	price_old: number;
	symbol: "▼" | "▲";
	title: string;
};

export type DolarHistoryEntryAPI = {
	last_update: string;
	price: number;
	price_high: number;
	price_low: number;
};

export type DolarHistoryPriceDataAPI = {
	history: DolarHistoryEntryAPI[];
};

export type DolarHistoryPriceData = {
	oficialPrice: number;
	parallelPrice: number;
	date: string;
};

export class DolarPriceController {
	token: string;
	constructor() {
		const api_token = process.env.DOLAR_PRICE_API_TOKEN;
		if (!api_token) {
			throw new Error("DOLAR_PRICE_API_TOKEN env variable is not defined.");
		}

		this.token = api_token;
	}

	private dolarPriceURL({
		page = "alcambio",
		monitor,
	}: { page?: "alcambio"; monitor: "enparalelovzla" | "bcv" }) {
		return `https://pydolarve.org/api/v2/dollar?page=${page}&monitor=${monitor}&format_date=default&rounded_price=true`;
	}

	private getFormatedDate(date: Date) {
		return `${addCero(date.getDate())}-${addCero(date.getMonth() + 1)}-${date.getFullYear()}`;
	}

	private dolarHistoryURL({
		page = "alcambio",
		monitor,
		start,
		end,
	}: {
		page?: "alcambio";
		monitor: "enparalelovzla" | "bcv";
		start: Date;
		end: Date;
	}) {
		// create date string

		return `https://pydolarve.org/api/v2/dollar/history?page=${page}&monitor=${monitor}&start_date=${this.getFormatedDate(start)}&end_date=${this.getFormatedDate(end)}&format_date=iso&rounded_price=true&order=asc`;
	}

	async getDolarPrice() {
		const paraleloRequest = fetch(
			this.dolarPriceURL({ monitor: "enparalelovzla" }),
			{
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			},
		);

		const oficialRequest = fetch(this.dolarPriceURL({ monitor: "bcv" }), {
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
		});

		// TODO: Manejar los errores
		const [paraleloResponse, oficialResponse] = await Promise.all([
			paraleloRequest,
			oficialRequest,
		]);

		const dataParalelo: DolarPriceData = await paraleloResponse.json();
		const dataOficial: DolarPriceData = await oficialResponse.json();

		return { paralelo: dataParalelo, oficial: dataOficial };
	}

	/** Get the history of changes of the dolar
	 * @param days how long the period from now
	 */
	async getDolarPriceHistory(days: number) {
		const end_date = new Date();
		const start_date = new Date();
		start_date.setDate(end_date.getDate() - days);

		const paraleloRequest = fetch(
			this.dolarHistoryURL({
				monitor: "enparalelovzla",
				start: start_date,
				end: end_date,
			}),
			{
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			},
		);
		const oficialRequest = fetch(
			this.dolarHistoryURL({
				monitor: "bcv",
				start: start_date,
				end: end_date,
			}),
			{
				headers: {
					Authorization: `Bearer ${this.token}`,
				},
			},
		);

		// TODO: Manejar errores
		const [paraleloResponse, oficialResponse] = await Promise.all([
			paraleloRequest,
			oficialRequest,
		]);

		const dataParalelo: DolarHistoryPriceDataAPI =
			await paraleloResponse.json();
		const dataOficial: DolarHistoryPriceDataAPI = await oficialResponse.json();

		// The records are ordered by date, that means the first entry
		// in dataParalelo have the same date as dataOficial first entry
		// but there are dates missing in both payloads but the missing dates
		// are not the same, so we need to complete the prices with the
		// previous price and merge the prices into an object
		const start = new Date(dataParalelo.history[0].last_update);
		const priceHistory: DolarHistoryPriceData[] = [
			{
				date: start.toISOString(),
				oficialPrice: dataOficial.history[0].price,
				parallelPrice: dataParalelo.history[0].price,
			},
		];
		let parallelIdx = 1;
		let oficialIdx = 1;
		while (true) {
			start.setDate(start.getDate() + 1);

			const parallelDate = dataParalelo.history[parallelIdx].last_update;
			let parallelPrice = dataParalelo.history[parallelIdx - 1].price;
			if (start.getDate() === new Date(parallelDate).getDate()) {
				parallelPrice = dataParalelo.history[oficialIdx].price;
				parallelIdx++;
			}
			const oficialDate = dataOficial.history[oficialIdx].last_update;
			let oficialPrice = dataOficial.history[oficialIdx - 1].price;
			if (start.getDate() === new Date(oficialDate).getDate()) {
				oficialPrice = dataOficial.history[oficialIdx].price;
				oficialIdx++;
			}

			priceHistory.push({
				oficialPrice: oficialPrice,
				parallelPrice: parallelPrice,
				date: start.toISOString().split("T")[0],
			});

			if (
				start.getDate() === end_date.getDate() &&
				start.getMonth() === end_date.getMonth()
			) {
				break;
			}
		}

		return { history: priceHistory };
	}
}
