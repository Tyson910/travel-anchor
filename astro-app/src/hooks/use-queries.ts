import type { App } from "@travel-anchor/hono-api";

import { hc, type InferRequestType, parseResponse } from "hono/client";
import useSWR from "swr";

const useHonoClient = () => {
	return hc<App>(`http://localhost:3000`);
};

type HonoClient = ReturnType<typeof useHonoClient>;

export const useAirportSearchQuery = async (searchQuery: string) => {
	const fetcher =
		(arg: InferRequestType<HonoClient["v1"]["airport"]["$get"]>) =>
		async () => {
			const $get = useHonoClient().v1.airport.$get;
			const result = await parseResponse($get(arg));
			return result;
		};

	return useSWR(
		"airport-search",
		fetcher({
			query: {
				query: searchQuery,
			},
		}),
	);
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
