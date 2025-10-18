import {
	type DetailedError,
	type InferResponseType,
	parseResponse,
} from "hono/client";
import useSWR from "swr";

import { honoClient } from "~/lib/hono-client";

const airportEndpoint = honoClient().v1.airport.$get;
export type AirportSearchQueryResult = InferResponseType<
	typeof airportEndpoint
>;

export const useAirportSearchQuery = (searchQuery: string) => {
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

	return useSWR<AirportSearchQueryResult, DetailedError>(searchQuery, fetcher);
};

// export const useFlightRoutesQuery = (iataCode: string) => {
// 	const fetcher = async () => {
// 		const client = honoClient();
// 		const result = await parseResponse(
// 			client.v1["flight-route"].$get({
// 				query: {
// 					IATA: iataCode,
// 				},
// 			}),
// 		);
// 		return result;
// 	};

// 	return useSWR(
// 		iataCode ? `flight-routes-${iataCode}` : null,
// 		iataCode ? fetcher : null,
// 	);
// };

// export type UseFlightRoutesQuery = Awaited<
// 	ReturnType<typeof useFlightRoutesQuery>
// >;
