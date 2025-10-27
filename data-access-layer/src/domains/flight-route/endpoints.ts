import { createEndpoint } from "better-call";
import { z } from "zod";

import { oneOrManyIATAValidator } from "#shared/schemas.ts";
import { logger } from "#shared/utils/logger.ts";
import { getAirportRoutesByIATA } from "./repository";

export const getAirportRoutesEndpoint = createEndpoint(
	"/flight-route",
	{
		method: "GET",
		query: z.object({
			IATA: oneOrManyIATAValidator,
		}),
	},
	async (ctx) => {
		const { IATA } = ctx.query;
		logger.debug("Getting flight routes for IATAs: %s", IATA);
		const results = await getAirportRoutesByIATA(IATA);
		return {
			routes: results,
		};
	},
);
