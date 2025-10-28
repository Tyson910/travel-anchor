import { Await, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { oneOrManyIATAValidator } from "@/lib/validators";
import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertTitle,
} from "~/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { sortOptionsValidator } from "~/features/airport-search/sorting-utils";
import { rpcClient } from "~/lib/rpc-client";

const searchSchema = z.object({
	codes: oneOrManyIATAValidator.optional().default([]),
	view: z.enum(["grid", "map"]).optional().default("map"),
	sort: sortOptionsValidator.optional().default("time-difference"),
});

export type SearchPageLoaderResponse = Array<{
	destination_airport: {
		name: string;
	};
	origin_airport_options?: Array<{
		duration_min?: number | null;
		distance_km?: number | null;
	}>;
}>;

export const Route = createFileRoute("/search")({
	validateSearch: (search) => {
		return searchSchema.parse(search);
	},
	loaderDeps: ({ search }) => ({ iataCodes: search.codes }),
	component: SearchPage,
	loader: (ctx) => {
		const { iataCodes } = ctx.deps;
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
	},
	pendingComponent: Skeleton,
	errorComponent: ErrorElement,
});

function SearchPage() {
	const { routes } = Route.useLoaderData();
	const searchParams = Route.useSearch();

	if (Array.isArray(routes)) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="pb-4 mb-4 border-b">
					<h1 className="text-3xl font-bold font-sans tracking-tight text-foreground mb-2">
						Select at least 2 airports to find mutual destinations
					</h1>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="pb-4 mb-4 border-b">
				<h1 className="text-3xl font-bold font-sans tracking-tight text-foreground mb-2">
					<Await
						promise={routes}
						fallback={<div>Finding mutual routes...</div>}
					>
						{(routes) => {
							return <>Found {routes.length} mutual flight destinations</>;
						}}
					</Await>
				</h1>
				<div className="flex flex-row justify-between items-end">
					{/* <AirportSearchCombobox /> */}
					<div className="flex flex-row items-end gap-4">
						{searchParams.view}
						{/* {activeView == "grid" ? <SortSelect /> : null} */}

						{/* <ViewToggle /> */}
					</div>
				</div>
			</div>

			<Await promise={routes} fallback={<LoadingSkeleton />}>
				{(routes) => {
					return null;
					// const sortedRoutes = sortRoutes(routes, activeSort);

					// if (activeView == "grid") {
					// 	return <DestinationListView routes={sortedRoutes} />;
					// }

					// return (
					// 	<AirportsMap
					// 		airports={sortedRoutes.map(
					// 			({ destination_airport }) => destination_airport,
					// 		)}
					// 	/>
					// );
				}}
			</Await>
		</div>
	);
}

function LoadingSkeleton() {
	const { view, codes: iataCodes } = Route.useSearch();

	if (view === "map") {
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
