import { useMediaQuery as _useMediaQuery } from "usehooks-ts";
const isServer = typeof window === "undefined";

// TODO: Remove this hook
export function useMediaQuery(query: string, defaultValue: boolean) {
	if (isServer) {
		return defaultValue;
	}
	return _useMediaQuery(query);
}
