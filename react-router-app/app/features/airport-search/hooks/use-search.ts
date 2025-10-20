import type { App } from "@travel-anchor/hono-api";

import {
	type DetailedError,
	hc,
	type InferResponseType,
	parseResponse,
} from "hono/client";
import useSWR, { type SWRConfiguration } from "swr";

export const honoClient = () => {
	return hc<App>(`http://localhost:3000`);
};

const airportEndpoint = honoClient().v1.airport.$get;
export type AirportSearchQueryResult = InferResponseType<
	typeof airportEndpoint
>;

export const useAirportSearchQuery = (
	searchQuery: string,
	opts?: SWRConfiguration<AirportSearchQueryResult, DetailedError>,
) => {
	const fetcher = async (searchTerm: string) => {
		const result = await parseResponse(
			airportEndpoint({
				query: {
					query: searchTerm,
				},
			}),
		);
		return result;
	};

	return useSWR<AirportSearchQueryResult, DetailedError>(
		searchQuery,
		fetcher,
		opts,
	);
};
