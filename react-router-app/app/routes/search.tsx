import type { Route } from "./+types/search";

import { flightRouteService } from "@travel-anchor/data-access-layer";

import { OriginCitiesFilter } from "~/features/airport-search";
import { AirportsMap } from "~/features/airport-search/components/AirportsMap.client";
import { DestinationListView } from "~/features/airport-search/components/DestinationListView.tsx";
import { getIATACodesFromSearchParams } from "~/features/airport-search/hooks/use-airport-search-params";
import { isBrowser } from "~/lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
	const requestURLObject = new URL(request.url);
	const iataCodes = getIATACodesFromSearchParams(requestURLObject.searchParams);

	if (iataCodes.length < 2) {
		return { routes: [] };
	}

	const routes = await flightRouteService.getAirportRoutesByIATA(iataCodes);

	return {
		routes,
	};
}

export type SearchPageLoaderResponse = Awaited<ReturnType<typeof loader>>;

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
					<OriginCitiesFilter />
				</div>

				{isBrowser && (
					<AirportsMap
						airports={loaderData.routes.map(
							({ destination_airport }) => destination_airport,
						)}
					/>
				)}
				<DestinationListView routes={loaderData.routes} />
			</div>
		</div>
	);
}
