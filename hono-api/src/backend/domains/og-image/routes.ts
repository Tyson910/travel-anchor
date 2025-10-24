import { OpenAPIHono } from "@hono/zod-openapi";
import { flightRouteService } from "@travel-anchor/data-access-layer";

import { getOgImageRoute } from "./schema.ts";
import { generateDynamicOGImage } from "./utils";

export const openImageRoutes = new OpenAPIHono().openapi(
	getOgImageRoute,
	async (c) => {
		const { IATA } = c.req.valid("query");
		try {
			const routes = await flightRouteService.getAirportRoutesByIATA(IATA);

			const svg = generateDynamicOGImage(IATA, routes.length);
			return c.body(svg, 200, {
				"Content-Type": "image/svg+xml",
			});
			// return c.json({ routes }, 200);
		} catch (_err) {
			return c.json({ message: "An unexpected error has occured" }, 500);
		}
	},
);
