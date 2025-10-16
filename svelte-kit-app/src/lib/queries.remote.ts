import type { App } from "@travel-anchor/hono-api";

import { DetailedError, hc, parseResponse } from "hono/client";
import * as z from "zod";

import { query } from "$app/server";

const useHonoClient = () => {
	return hc<App>(`http://localhost:3000`);
};

const airportIATAValidator = z.string().length(3).toUpperCase();

export const useAirportSearchQuery = query(z.string(), async (searchQuery) => {
	const endpoint = useHonoClient().v1.airport.$get({
		query: {
			query: searchQuery,
		},
	});

	const result = await parseResponse(endpoint);

	return result;
});

export type UseAirportSearchQuery = Awaited<
	ReturnType<typeof useAirportSearchQuery>
>;

export const useAirportDetailsQuery = query(
	airportIATAValidator,
	async (airportIATA) => {
		const endpoint = useHonoClient().v1.airport[":IATA"].$get({
			param: {
				IATA: airportIATA,
			},
		});

		const result = await parseResponse(endpoint).catch((e: DetailedError) => e);

		if (result instanceof DetailedError) {
			throw DetailedError;
		} else if (result instanceof Error) {
			throw result;
		}

		return result;
	},
);

export const useFlightRouteQuery = query(
	z.array(airportIATAValidator).min(1),
	async (iataCodes) => {
		const endpoint = useHonoClient().v1["flight-route"].$get({
			query: { IATA: iataCodes },
		});

		const result = await parseResponse(endpoint).catch((e: DetailedError) => e);

		if (result instanceof DetailedError) {
			throw DetailedError;
		} else if (result instanceof Error) {
			throw result;
		}

		return result;
	},
);

export type UseFlightRouteQueryResult = Awaited<
	ReturnType<typeof useFlightRouteQuery>
>;
