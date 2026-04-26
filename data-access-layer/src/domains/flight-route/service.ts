import { logger } from "#logger";
import { getAirportRoutesByIATA } from "./repository.js";

export const flightRouteService = {
	async getAirportRoutesByIATA(IATA: string[]) {
		logger.debug("Getting flight routes for IATAs: %s", IATA);
		return await getAirportRoutesByIATA(IATA);
	},
};
