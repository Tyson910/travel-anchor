import type { searchPageLoader } from "./loader.ts";

import React from "react";
import { Await, useLoaderData } from "react-router";

import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertTitle,
} from "#components/ui/alert.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#components/ui/card.tsx";
import { Separator } from "#components/ui/separator.tsx";
import { Skeleton } from "#components/ui/skeleton.tsx";
import { AirportsMap } from "./components/AirportsMap";
import { DestinationListView } from "./components/DestinationListView";
import { AirportSearchCombobox } from "./components/SearchBar";
import { SortSelect } from "./components/SortSelect";
import { ViewToggle } from "./components/ViewToggle";
import { useAirportSearchParamsState } from "./hooks/use-airport-search-params";
import { sortRoutes } from "./sorting-utils";

export function SearchPage() {
	const loaderData = useLoaderData<typeof searchPageLoader>();
	const { activeView, activeSort } = useAirportSearchParamsState();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="pb-4 mb-4 border-b">
				<h1 className="text-3xl font-bold font-sans tracking-tight text-foreground mb-2">
					<React.Suspense fallback={<div>Finding mutual routes...</div>}>
						<Await resolve={loaderData.routes} errorElement={<> </>}>
							{(routes) => {
								return <>Found {routes.length} mutual flight destinations</>;
							}}
						</Await>
					</React.Suspense>
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
	);
}

function LoadingSkeleton() {
	const { activeView, iataCodes } = useAirportSearchParamsState();
	if (activeView === "map") {
		return (
			<div className="space-y-4">
				<Skeleton className="h-(--airport-map-height) w-full rounded-lg" />
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
	return (
		<Alert variant="destructive" appearance="outline">
			<AlertContent>
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>Failed to load flight routes</AlertDescription>
			</AlertContent>
		</Alert>
	);
}
