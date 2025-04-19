import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("transactions/create", "routes/transactions-create.tsx"),
	route("transactions/:transactionId/edit", "routes/transactions-update.tsx"),
	route("transactions/:transactionId/delete", "routes/transactions-delete.tsx"),
	route("budgets/create", "routes/budgets-create.tsx"),
] satisfies RouteConfig;
