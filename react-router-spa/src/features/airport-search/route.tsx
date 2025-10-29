import type { LoaderFunctionArgs } from "react-router";

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
import { getIATACodesFromSearchParams } from "#features/airport-search/hooks/use-airport-search-params.ts";
import { rpcClient } from "#src/lib/rpc-client.ts";
import { AirportsMap } from "./components/AirportsMap.tsx";
import { DestinationListView } from "./components/DestinationListView.tsx";
import { AirportSearchCombobox } from "./components/SearchBar.tsx";
import { SortSelect } from "./components/SortSelect.tsx";
import { ViewToggle } from "./components/ViewToggle.tsx";
import { useAirportSearchParamsState } from "./hooks/use-airport-search-params.ts";
import { sortRoutes } from "./sorting-utils.ts";

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

export function SearchPage() {
	const loaderData = useLoaderData<typeof searchPageLoader>();
	const { activeView, activeSort, iataCodes } = useAirportSearchParamsState();

	return (
		<>
			<title>Mutual Flight Destinations - Travel Anchor</title>
			<meta
				name="description"
				content="Find mutual direct-flight destinations for your group travel"
			/>
			<meta
				property="og:image"
				content={`${import.meta.env.VITE_PUBLIC_API_URL}/og-image?IATA=${iataCodes.join("&IATA=")}`}
			/>
			<meta property="og:image:height" content="1200" />
			<meta property="og:image:width" content="630" />
			<meta
				property="og:image:alt"
				content="Mutual Flight Destinations for JFK, LAX, ORD"
			/>
			<meta property="og:image:type" content="image/png" />
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
					<div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-5 lg:gap-0">
						<AirportSearchCombobox />
						<div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
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
		</>
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
