import { useQuery } from "@tanstack/react-query";

import { rpcClient } from "~/lib/rpc-client";

const airportEndpoint = (searchStr: string) =>
	rpcClient("/airports", {
		query: {
			search: searchStr,
		},
	});

export type AirportSearchQueryResult = Exclude<
	Awaited<ReturnType<typeof airportEndpoint>>["data"],
	null
>;

export const useAirportSearchQuery = (searchQuery: string) => {
	const { data, ...rest } = useQuery({
		queryKey: ["airport-search", searchQuery],
		queryFn: async () => {
			const { data, error } = await rpcClient("/airports", {
				query: {
					search: searchQuery,
				},
			});
			if (error) throw error;
			return data;
		},
	});

	const airports = data?.airports ?? [];

	return {
		airports,
		...rest,
	};
};
