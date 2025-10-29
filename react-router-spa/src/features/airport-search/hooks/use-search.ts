import useSWR, { type SWRConfiguration } from "swr";

import { rpcClient } from "#src/lib/rpc-client.ts";

const airportEndpoint = (searchStr: string) =>
	rpcClient("/airports", {
		query: {
			search: searchStr,
		},
	});

type AirportSearchQueryErrorResult = Exclude<
	Awaited<ReturnType<typeof airportEndpoint>>["error"],
	null
>;

export type AirportSearchQueryResult = Exclude<
	Awaited<ReturnType<typeof airportEndpoint>>["data"],
	null
>;

export const useAirportSearchQuery = (
	searchQuery: string,
	opts?: SWRConfiguration<
		AirportSearchQueryResult,
		AirportSearchQueryErrorResult
	>,
) => {
	const fetcher = async () => {
		const { data, error } = await rpcClient("/airports", {
			query: {
				search: searchQuery,
			},
		});
		if (error) throw error;
		return data;
	};

	return useSWR<AirportSearchQueryResult, AirportSearchQueryErrorResult>(
		searchQuery || "N/a",
		fetcher,
		opts,
	);
};
