import { cva } from "class-variance-authority";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const currencyFormatterVES = new Intl.NumberFormat("en", {
	currency: "VES",
	minimumFractionDigits: 2,
	style: "currency",
});

export const currencyFormatter = new Intl.NumberFormat("en", {
	currency: "USD",
	minimumFractionDigits: 2,
	style: "currency",
});

export function removeNumberFormat(number: string) {
	return number.replaceAll(/[^\d\.]/gi, "");
}

const budgetColors = [
	"bg-rose-400",
	"bg-lime-400",
	"bg-amber-300",
	"bg-emerald-300",
	"bg-cyan-400",
	"bg-indigo-300",
	// "bg-fuchsia-400",
];

export const getBudgetColor = (title: string) => {
	let codeColor = 0;
	for (let i = 0; i < title.length; i++) {
		codeColor += title.charCodeAt(i);
	}
	return budgetColors[codeColor % budgetColors.length];
};
