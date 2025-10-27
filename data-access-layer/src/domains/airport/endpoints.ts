import { createEndpoint } from "better-call";
import { z } from "zod";

import { IATAValidator } from "#shared/schemas.ts";
import { getAirportByIATA, searchAirport } from "./repository.ts";

export const searchAirportEndpoint = createEndpoint(
	"/airports",
	{
		method: "GET",
		query: z.object({ search: z.string() }),
	},
	async (ctx) => {
		const results = await searchAirport(ctx.query.search);
		return {
			airports: results,
		};
	},
);

export const getAirportByIATACodeEndpoint = createEndpoint(
	"/airport/:IATA",
	{
		method: "GET",
	},
	async (ctx) => {
		const paramsValidationResult = IATAValidator.safeParse(ctx.params.IATA);

		if (!paramsValidationResult.success) {
			throw ctx.error(400, {
				message: paramsValidationResult.error.message,
				issues: paramsValidationResult.error.issues,
			});
		}

		const airport = await getAirportByIATA(paramsValidationResult.data);
		return {
			airport,
		};
	},
);
