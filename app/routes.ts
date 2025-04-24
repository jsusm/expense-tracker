import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("transactions/create", "routes/transactions-create.tsx"),
	route("transactions/:transactionId/edit", "routes/transactions-update.tsx"),
	route("transactions/:transactionId/delete", "routes/transactions-delete.tsx"),
	route("budgets/create", "routes/budgets-create.tsx"),
	route("budgets/:budgetId/update", "routes/budget-update.tsx"),
	route("budgets/:budgetId/delete", "routes/budget-delete.tsx"),
	route("budgets/:budgetId", "routes/budget.tsx"),
	route("budgets/:budgetId/goals/create", "routes/budget-goal-create.tsx"),
] satisfies RouteConfig;
