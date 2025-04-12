import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("transactions/create", "routes/transactions-create.tsx"),
] satisfies RouteConfig;
