export type Budget = {
	label: string;
	id: number;
};

export type BudgetView = {
	label: string;
	id: number;
	budgetExpended: number;
	goal: {
		goal: number;
		defined: boolean;
	} | null;
};

export type Transaction = {
	id: number;
	amount: number;
	datetime: string;
	budget: Budget;
	tags: string[];
	description: string;
};

export type Tag = {
	label: string;
};

export interface DolarPriceApiResponse {
	datetime: {
		date: string;
		time: string;
	};
	monitors: {
		bcv: MonitorInfo;
		enparalelovzla: MonitorInfo;
		[key: string]: MonitorInfo | undefined; // Allows for other potential monitors
	};
}

export interface MonitorInfo {
	change: number;
	color: string;
	image: string;
	last_update: string;
	percent: number;
	price: number;
	price_old: number;
	symbol: string;
	title: string;
}
