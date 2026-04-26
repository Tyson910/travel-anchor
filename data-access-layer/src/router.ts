import { createRouter } from "better-call";

import {
	getAirportByIATACodeEndpoint,
	searchAirportEndpoint,
} from "#domains/airport/endpoints";
import { getAirportRoutesEndpoint } from "#domains/flight-route/endpoints";

export const router = createRouter(
	{
		getAirportByIATACodeEndpoint,
		searchAirportEndpoint,
		getAirportRoutesEndpoint,
	},
	{
		basePath: "/api",
	},
);
