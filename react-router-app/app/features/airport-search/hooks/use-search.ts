import {
	type DetailedError,
	type InferResponseType,
	parseResponse,
} from "hono/client";
import useSWR, { type SWRConfiguration } from "swr";

import { honoClient } from "~/lib/hono-client";

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
