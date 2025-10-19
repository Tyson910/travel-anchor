import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
	route("search", "routes/search.tsx"),
	route("/api/search", "api/search-endpoint.ts"),
] satisfies RouteConfig;
