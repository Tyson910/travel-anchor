import { OpenAPIHono } from "@hono/zod-openapi";
import { flightRouteService } from "@travel-anchor/data-access-layer";

import { getAirportsRoutesRoute } from "./schemas.ts";

export const flightRouteRoutes = new OpenAPIHono().openapi(
	getAirportsRoutesRoute,
	async (c) => {
		const { IATA } = c.req.valid("query");
		try {
			const routes = await flightRouteService.getAirportRoutesByIATA(IATA);
			return c.json({ routes }, 200);
		} catch (_err) {
			return c.json({ message: "An unexpected error has occured" }, 500);
		}
	},
);
