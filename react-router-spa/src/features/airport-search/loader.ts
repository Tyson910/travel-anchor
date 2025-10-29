import type { LoaderFunctionArgs } from "react-router";

import { getIATACodesFromSearchParams } from "#features/airport-search/hooks/use-airport-search-params.ts";
import { rpcClient } from "#src/lib/rpc-client.ts";

export async function searchPageLoader({
	request,
}: LoaderFunctionArgs<unknown>) {
	const requestURLObject = new URL(request.url);
	const iataCodes = getIATACodesFromSearchParams(requestURLObject.searchParams);

	if (iataCodes.length < 2) {
		return { routes: [] };
	}

	const routes = rpcClient("/flight-route", {
		query: {
			IATA: iataCodes,
		},
		customFetchImpl: (req, init) => {
			if (req instanceof URL) {
				// workaround for weird better-fetch bug that prevents array query params
				req.searchParams.delete("IATA");
				iataCodes.forEach((code) => {
					req.searchParams.append("IATA", code);
				});
			}
			return fetch(req, init);
		},
	}).then(({ data, error }) => {
		if (error) {
			console.log(error);
			throw error;
		}
		return data.routes;
	});

	return {
		routes,
	};
}

export type SearchPageLoaderResponse = Awaited<
	Exclude<Awaited<ReturnType<typeof searchPageLoader>>["routes"], never[]>
>;
