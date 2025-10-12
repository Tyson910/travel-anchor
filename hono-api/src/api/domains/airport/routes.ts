import { OpenAPIHono } from "@hono/zod-openapi";

import { flightRouteService } from "#domains/flight-route/service.ts";
import { logger } from "#logger/logger.ts";
import { notFoundUtils } from "#utils/errors.ts";
import {
	getAirportByIATARoute,
	getAirportRoutesRoute,
	searchAirportsRoute,
} from "./schemas.ts";
import { airportService } from "./service.ts";

export const airportRoutes = new OpenAPIHono()
	.openapi(searchAirportsRoute, async (c) => {
		const { query } = c.req.valid("query");
		const airports = await airportService.searchAirports(query);
		return c.json({ airports }, 200);
	})
	.openapi(getAirportByIATARoute, async (c) => {
		const { IATA } = c.req.valid("param");
		try {
			const airport = await airportService.getAirportByIATA(IATA);
			return c.json({ airport }, 200);
		} catch (error) {
			logger.error(error);
			const isNoResultError =
				error instanceof Error && error.message.includes("not found");

			if (!isNoResultError) {
				throw error;
			}

			const { status, ...notFoundResponse } = notFoundUtils.resource(
				"Airport",
				IATA,
				c.req.path,
				c.req.method,
			);
			return c.json(notFoundResponse, status);
		}
	})
	.openapi(getAirportRoutesRoute, async (c) => {
		const { IATA } = c.req.valid("param");
		try {
			const routes = await flightRouteService.getAirportRoutesByIATA([IATA]);
			return c.json({ routes }, 200);
		} catch (_err) {
			return c.json({ message: "An unexpected error has occured" }, 500);
		}
	});
