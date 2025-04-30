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

		// console.log({ dataOficial, dataParalelo });

		return { paralelo: dataParalelo, oficial: dataOficial };
	}
}
