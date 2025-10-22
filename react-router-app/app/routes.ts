import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
	route("search", "routes/search.tsx"),
	route("/", "routes/index.tsx"),
] satisfies RouteConfig;
