import type { Airport } from "./types.ts";

import { NoResultError } from "kysely";

import { logger } from "#logger";
import { getAirportByIATA, searchAirport } from "./repository.ts";

export const airportService = {
	async searchAirports(query: string) {
		logger.debug("Searching airports with query: %s", query);
		return await searchAirport(query);
	},

	async getAirportByIATA(IATA: string): Promise<Airport> {
		logger.debug("Getting airport by IATA: %s", IATA);
		try {
			const airport = await getAirportByIATA(IATA);
			return airport;
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new Error(`Airport with IATA ${IATA} not found`);
			}
			throw error;
		}
	},
};
