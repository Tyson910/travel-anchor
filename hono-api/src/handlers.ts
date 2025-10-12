import { OpenAPIHono } from "@hono/zod-openapi";

import {
	getAirportByIATA,
	getAirportRoutesByIATA,
	NoResultError,
	searchAirport,
} from "./dal/index.ts";
import { notFoundUtils } from "./error-handlers.ts";
import { logger } from "./logger.ts";
import {
	getAirportByIATARoute,
	getAirportRoutesRoute,
	getAirportsRoutesRoute,
	searchAirportsRoute,
} from "./open-api-routes.ts";

export const airport = new OpenAPIHono()
	.openapi(searchAirportsRoute, async (c) => {
		const { query } = c.req.valid("query");
		const airports = await searchAirport(query);
		return c.json({ airports }, 200);
	})
	.openapi(getAirportByIATARoute, async (c) => {
		const { IATA } = c.req.valid("param");
		try {
			const airport = await getAirportByIATA(IATA);
			return c.json({ airport }, 200);
		} catch (error) {
			logger.error(error);
			const isNoResultError = error instanceof NoResultError;

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
			const routes = await getAirportRoutesByIATA([IATA]);
			return c.json({ routes }, 200);
		} catch (_err) {
			return c.json({ message: "An unexpected error has occured" }, 500);
		}
	});

export const flightRoutes = new OpenAPIHono().openapi(
	getAirportsRoutesRoute,
	async (c) => {
		const { IATA } = c.req.valid("query");
		try {
			const routes = await getAirportRoutesByIATA(IATA);
			return c.json({ routes }, 200);
		} catch (_err) {
			return c.json({ message: "An unexpected error has occured" }, 500);
		}
	},
);
