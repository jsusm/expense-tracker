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
