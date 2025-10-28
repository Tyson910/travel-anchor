import { OpenAPIHono } from "@hono/zod-openapi";
import { Resvg } from "@resvg/resvg-js";
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

			const opts = {
				fitTo: {
					mode: "width",
					value: 1200,
				},
			} as const;

			const resvg = new Resvg(svg, opts);
			const pngData = resvg.render();
			const pngBuffer = pngData.asPng() as unknown as ArrayBuffer;

			c.header("Cross-Origin-Resource-Policy", "cross-origin");

			return c.body(pngBuffer, 200, {
				"Content-Type": "image/png",
			});
		} catch (_err) {
			return c.json({ message: "An unexpected error has occured" }, 500);
		}
	},
);
