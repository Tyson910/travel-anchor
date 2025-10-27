import { createRouter } from "better-call";

import {
	getAirportByIATACodeEndpoint,
	searchAirportEndpoint,
} from "#domains/airport/endpoints.ts";
import { getAirportRoutesEndpoint } from "#domains/flight-route/endpoints.ts";

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
