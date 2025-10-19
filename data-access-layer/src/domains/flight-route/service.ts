import { logger } from "../../shared/utils/logger.ts";
import { getAirportRoutesByIATA } from "./repository.ts";

export const flightRouteService = {
	async getAirportRoutesByIATA(IATA: string[]) {
		logger.debug("Getting flight routes for IATAs: %s", IATA);
		return await getAirportRoutesByIATA(IATA);
	},
};
