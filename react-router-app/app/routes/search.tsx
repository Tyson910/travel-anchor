import type { Route } from "./+types/search";

import { parseResponse } from "hono/client";

import {
	MutualDestinationsList,
	OriginCitiesDisplay,
} from "~/features/airport-search";
import { getIATACodesFromSearchParams } from "~/features/airport-search/hooks/use-airport-search-params";
import { honoClient } from "~/lib/hono-client";

export async function loader({ request }: Route.LoaderArgs) {
	const requestURLObject = new URL(request.url);
	const iataCodes = getIATACodesFromSearchParams(requestURLObject.searchParams);

	if (iataCodes.length < 2) {
		return { routes: [] };
	}
	const endpoint = honoClient().v1["flight-route"].$get({
		query: {
			IATA: iataCodes,
		},
	});
	return await parseResponse(endpoint);
}

export function meta() {
	return [
		{ title: "Mutual Flight Destinations - Travel Anchor" },
		{
			name: "description",
			content: "Find mutual direct-flight destinations for your group travel",
		},
	];
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						{loaderData.routes.length} Mutual Flight Destinations
					</h1>
					<OriginCitiesDisplay />
				</div>

				<MutualDestinationsList />
			</div>
		</div>
	);
}
