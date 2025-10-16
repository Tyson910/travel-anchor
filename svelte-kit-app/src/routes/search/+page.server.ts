import type { App } from "@travel-anchor/hono-api";
import type { PageServerLoad } from "./$types";

import { error } from "@sveltejs/kit";
import { DetailedError, hc, parseResponse } from "hono/client";

import { parseIataCodesParams } from "$lib/hooks/use-query-params.svelte";

export const load: PageServerLoad = async ({ url }) => {
	const IATA_CODES = parseIataCodesParams(url.searchParams);
	const endpoint = hc<App>(`http://localhost:3000`).v1["flight-route"].$get({
		query: { IATA: IATA_CODES },
	});

	try {
		const result = await parseResponse(endpoint);
		return {
			routes: result.routes,
			IATA_CODES,
		};
	} catch (err) {
		if (err instanceof DetailedError) {
			console.error(err);
			error(err.statusCode, err.message);
		}

		error(500, "An unexpected error has occured");
	}
};
