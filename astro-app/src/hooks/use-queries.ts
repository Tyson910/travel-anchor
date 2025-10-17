import type { App } from "@travel-anchor/hono-api";

import { hc, parseResponse } from "hono/client";
import useSWR from "swr";

const useHonoClient = () => {
	return hc<App>(`http://localhost:3000`);
};

export const useAirportSearchQuery = async (searchQuery: string) => {
	const fetcher = async () => {
		const endpoint = useHonoClient().v1.airport.$get({
			query: {
				query: searchQuery,
			},
		});

		const result = await parseResponse(endpoint);
		return result;
	};

	return useSWR("airport-search", fetcher);
};

export type UseAirportSearchQuery = Awaited<
	ReturnType<typeof useAirportSearchQuery>
>;

export const useFlightRoutesQuery = (iataCode: string) => {
	const fetcher = async () => {
		const client = useHonoClient();
		const result = await parseResponse(
			client.v1["flight-route"].$get({
				query: {
					IATA: iataCode,
				},
			}),
		);
		return result;
	};

	return useSWR(
		iataCode ? `flight-routes-${iataCode}` : null,
		iataCode ? fetcher : null,
	);
};

export type UseFlightRoutesQuery = Awaited<
	ReturnType<typeof useFlightRoutesQuery>
>;
