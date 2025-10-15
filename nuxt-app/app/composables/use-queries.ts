import { type UseQueryReturnType, useQuery } from "@tanstack/vue-query";
import { type MaybeRefOrGetter, toValue } from "vue";

import { useHonoClient } from "~/composables/use-hono-client";
import { useSearchQueryParams } from "~/composables/use-query-params";

type GetTanstackQueryReturnType<
	// biome-ignore lint/suspicious/noExplicitAny: generic args...life
	T extends (...args: any[]) => UseQueryReturnType<unknown, unknown>,
> = Exclude<ReturnType<T>["data"]["value"], undefined>;

export const useAirportSearchQuery = (
	airportSearchStr: MaybeRefOrGetter<string>,
) =>
	useQuery({
		queryKey: ["airport-search", airportSearchStr],
		queryFn: async () => {
			const endpoint = useHonoClient().v1.airport.$get;

			const response = await endpoint({
				query: { query: toValue(airportSearchStr) },
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			return await response.json();
		},
	});

export type UseAirportSearchQueryResult = GetTanstackQueryReturnType<
	typeof useAirportSearchQuery
>;

export const useFlightRouteQuery = () => {
	const { iataCodes } = useSearchQueryParams();
	return useAsyncData(
		"flight-route-options",
		() =>
			useHonoClient()
				.v1["flight-route"].$get({
					query: { IATA: iataCodes.value },
				})
				.then((res) => {
					if (!res.ok) throw new Error(res.statusText);
					else return res.json();
				}),
		{
			watch: [iataCodes.value],
		},
	);
};

export type UseFlightRouteQueryResult = Exclude<
	ReturnType<typeof useFlightRouteQuery>["data"]["value"],
	undefined
>;

export const useAirportDetailsQuery = (airportIATA: MaybeRefOrGetter<string>) =>
	useQuery({
		queryKey: ["airport-details", airportIATA],
		queryFn: async () => {
			const endpoint = useHonoClient().v1.airport[":IATA"].$get;

			const response = await endpoint({
				param: { IATA: toValue(airportIATA) },
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			return await response.json();
		},
	});

export type UseAirportDetailsQueryResult = GetTanstackQueryReturnType<
	typeof useAirportDetailsQuery
>;
