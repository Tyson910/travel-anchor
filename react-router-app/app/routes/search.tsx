import type { Route } from "./+types/search";

import { flightRouteService } from "@travel-anchor/data-access-layer";
import React from "react";
import { Await } from "react-router";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
	DestinationListView,
	getIATACodesFromSearchParams,
	useAirportSearchParamsState,
	ViewToggle,
} from "~/features/airport-search";
import { AirportsMap } from "~/features/airport-search/components/AirportsMap.client";
import { AirportSearchCombobox } from "~/features/airport-search/components/SearchBar";
import { SortSelect } from "~/features/airport-search/components/SortSelect";
import { sortRoutes } from "~/features/airport-search/sorting-utils";
import { isBrowser } from "~/lib/utils";

export async function loader({ request }: Route.LoaderArgs) {
	const requestURLObject = new URL(request.url);
	const iataCodes = getIATACodesFromSearchParams(requestURLObject.searchParams);

	if (iataCodes.length < 2) {
		return { routes: [] };
	}

	const routes = new Promise<
		Awaited<ReturnType<typeof flightRouteService.getAirportRoutesByIATA>>
	>((res) => res(flightRouteService.getAirportRoutesByIATA(iataCodes)));

	return {
		routes,
	};
}

export type SearchPageLoaderResponse = Awaited<
	ReturnType<typeof flightRouteService.getAirportRoutesByIATA>
>;

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
	const { activeView, activeSort } = useAirportSearchParamsState();

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				<div className="pb-4 mb-4 border-b">
					<h1 className="text-3xl font-bold font-sans tracking-tight text-foreground mb-2">
						{/* {loaderData.routes.length} */}
						Mutual Flight Destinations
					</h1>
					<div className="flex flex-row justify-between items-end">
						<AirportSearchCombobox />
						<div className="flex flex-row items-end gap-4">
							{activeView == "grid" ? <SortSelect /> : null}

							<ViewToggle />
						</div>
					</div>
				</div>
				<React.Suspense fallback={<LoadingSkeleton />}>
					<Await resolve={loaderData.routes} errorElement={<ErrorElement />}>
						{(routes) => {
							const sortedRoutes = sortRoutes(routes, activeSort);

							if (activeView == "grid") {
								return <DestinationListView routes={sortedRoutes} />;
							}
							if (!isBrowser) {
								return null;
							}
							return (
								<AirportsMap
									airports={sortedRoutes.map(
										({ destination_airport }) => destination_airport,
									)}
								/>
							);
						}}
					</Await>
				</React.Suspense>
			</div>
		</div>
	);
}

function LoadingSkeleton() {
	const { activeView, iataCodes } = useAirportSearchParamsState();
	if (activeView === "map") {
		return (
			<div className="space-y-4">
				<div className="text-center text-muted-foreground">
					Loading map destinations...
				</div>
				<Skeleton className="h-96 w-full rounded-lg" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{Array.from({ length: 4 }).map((_, idx) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: no other option
					<Card key={idx} className="w-full">
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								<div className="space-y-2 w-full">
									<Skeleton variant="grid" className="h-6 w-1/2" />
									<Skeleton variant="grid" className="h-4 w-1/4" />
								</div>
							</CardTitle>
						</CardHeader>
						<Separator />
						<CardContent className="space-y-4 mt-4">
							<div className="space-y-2">
								{iataCodes.map((code, index) => (
									<div key={code}>
										<Skeleton variant="grid" className="h-28 w-full" />
										{index < iataCodes.length - 1 && (
											<Separator className="my-3" />
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

function ErrorElement() {
	return <div>Error loading routes</div>;
}
