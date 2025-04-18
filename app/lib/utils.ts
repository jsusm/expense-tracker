import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const currencyFormatter = new Intl.NumberFormat("en", {
	currency: "USD",
	minimumFractionDigits: 2,
	style: "currency",
});
