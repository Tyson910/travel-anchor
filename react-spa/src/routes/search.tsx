import {
	Await,
	createFileRoute,
	type ErrorComponentProps,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Home, RefreshCw } from "lucide-react";
import { useId } from "react";
import * as z from "zod";

import { Label } from "@/components/ui/label";
import { AirportsMap } from "@/features/airport-search/components/AirportsMap";
import { DestinationListView } from "@/features/airport-search/components/DestinationListView";
import { FilterSelect } from "@/features/airport-search/components/Filters";
import { AirportSearchCombobox } from "@/features/airport-search/components/SearchBar";
import { SortSelect } from "@/features/airport-search/components/SortSelect";
import { ViewToggle } from "@/features/airport-search/components/ViewToggle";
import { oneOrManyIATAValidator } from "@/lib/validators";
import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertTitle,
} from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import {
	airportSearchFiltersSchema,
	applyFiltersToRoutes,
} from "~/features/airport-search/filter-utils";
import {
	sortOptionsValidator,
	sortRoutes,
} from "~/features/airport-search/sorting-utils";
import {
	getErrorDescription,
	getErrorMessage,
	getErrorTitle,
	getErrorType,
} from "~/lib/error-utils";
import { rpcClient } from "~/lib/rpc-client";

const searchSchema = z.object({
	codes: oneOrManyIATAValidator.optional().default([]),
	view: z.enum(["grid", "map"]).optional().default("map"),
	sort: sortOptionsValidator.optional().default("time-difference"),
	filters: z.array(airportSearchFiltersSchema).default([]),
});

export type SearchPageLoaderResponse = Awaited<
	(typeof Route)["types"]["loaderData"]["routes"]
>;

export const Route = createFileRoute("/search")({
	staleTime: 5000,
	// Do not cache this route's data after it's unloaded
	// gcTime: 0,
	// Only reload the route when the user navigates to it or when deps change
	shouldReload: false,
	validateSearch: zodValidator(searchSchema),
	loaderDeps: ({ search }) => ({ iataCodes: search.codes }),
	component: SearchPage,
	loader: (ctx) => {
		const { iataCodes } = ctx.deps;
		if (iataCodes.length == 0) {
			throw redirect({
				to: "/",
				search: {
					codes: iataCodes,
				},
			});
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
	const navigate = useNavigate({ from: "/search" });
	const inputId = useId();

	const activeView = searchParams.view;

	return (
		<div className="bg-primary/2">
			<div className="container mx-auto px-4 py-8">
				<title>Mutual Flight Destinations - Travel Anchor</title>
				<meta
					name="description"
					content="Find mutual direct-flight destinations for your group travel"
				/>
				<meta
					property="og:title"
					content="Mutual Flight Destinations - Travel Anchor"
				/>
				<meta
					property="og:description"
					content="Find mutual direct-flight destinations for your group travel"
				/>
				<meta
					property="og:image"
					content={`http://localhost:3000/og-image?IATA=${searchParams.codes.join("&IATA=")}`}
				/>
				<meta property="og:image:height" content="1200" />
				<meta property="og:image:width" content="630" />
				<meta
					property="og:image:alt"
					content="Mutual Flight Destinations for JFK, LAX, ORD"
				/>
				<meta property="og:image:type" content="image/png" />
				<div className="pb-4 mb-4 border-b">
					<h1 className="text-3xl font-bold font-sans tracking-tight text-foreground mb-2">
						<Await
							promise={routes}
							fallback={<div>Finding mutual routes...</div>}
						>
							{(routes) => {
								const filteredRoutes = applyFiltersToRoutes(
									routes,
									searchParams.filters,
								);
								return (
									<>Found {filteredRoutes.length} mutual flight destinations</>
								);
							}}
						</Await>
					</h1>

					<div className="flex flex-row justify-between items-end">
						<div className="w-lg">
							<Label htmlFor={inputId} className="mb-3">
								Airports:
							</Label>
							<AirportSearchCombobox
								id={inputId}
								iataCodes={searchParams.codes}
								onValueChange={(values) => {
									const dedupedIATACodes = [...new Set(values)];
									navigate({
										search: (prev) => ({
											...prev,
											codes: dedupedIATACodes,
										}),
									});
								}}
							/>
						</div>

						<div className="flex flex-row items-end gap-4">
							{activeView == "grid" ? (
								<SortSelect
									activeSort={searchParams.sort}
									setSort={(value) => {
										navigate({
											search: (prev) => ({
												...prev,
												sort: value,
											}),
										});
									}}
								/>
							) : null}

							<ViewToggle
								activeView={activeView}
								setView={(value) => {
									navigate({
										search: (prev) => ({
											...prev,
											view: value,
										}),
									});
								}}
							/>
						</div>
					</div>

					<Await
						promise={routes}
						fallback={<Skeleton className="mt-5 h-40 w-full rounded-lg" />}
					>
						{(routes) => (
							<div className="mt-5">
								<FilterRow routes={routes} />
							</div>
						)}
					</Await>
				</div>

				<Await promise={routes} fallback={<LoadingSkeleton />}>
					{(routes) => {
						const filteredRoutes = applyFiltersToRoutes(
							routes,
							searchParams.filters,
						);

						if (activeView == "grid") {
							const sortedRoutes = sortRoutes(
								filteredRoutes,
								searchParams.sort,
							);
							return <DestinationListView routes={sortedRoutes} />;
						}

						return (
							<AirportsMap
								airports={filteredRoutes.map(
									({ destination_airport }) => destination_airport,
								)}
							/>
						);
					}}
				</Await>
			</div>
		</div>
	);
}

function FilterRow({ routes }: { routes: SearchPageLoaderResponse }) {
	const { filters } = Route.useSearch();
	const navigate = useNavigate({ from: "/search" });

	return (
		<Card className="flex flex-col">
			<div className="flex flex-row justify-between">
				<p className="text-xl font-medium">Active Filters</p>
				<FilterSelect
					routes={routes}
					onFilterSubmit={(val) => {
						navigate({
							search: (prev) => ({
								...prev,
								filters: prev.filters ? [...prev.filters, val] : [val],
							}),
						});
					}}
				/>
			</div>
			<div className="flex flex-row flex-wrap gap-4 mt-4">
				{filters.map((filter) => (
					<FilterSelect
						key={filter.id}
						routes={routes}
						defaultValues={filter}
						onFilterRemove={(val) =>
							navigate({
								search: ({ filters, ...rest }) => {
									const updatedFilters = filters.filter(
										(filter) => filter.id !== val.id,
									);
									return {
										...rest,
										filters: updatedFilters,
									};
								},
							})
						}
						onFilterSubmit={(val) =>
							navigate({
								search: ({ filters, ...rest }) => {
									const updatedFilters = filters.map((filter) => {
										if (filter.id == val.id) {
											return val;
										}
										return filter;
									});
									return {
										...rest,
										filters: updatedFilters,
									};
								},
							})
						}
					/>
				))}
			</div>
		</Card>
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

function ErrorElement({ error, info, reset }: ErrorComponentProps) {
	const navigate = useNavigate();
	const isDevelopment = import.meta.env.DEV;

	const errorMessage = getErrorMessage(error);
	const errorType = getErrorType(error);

	return (
		<div className="container mx-auto px-4 py-8">
			<Alert variant="destructive" appearance="light" size="lg">
				<AlertContent className="w-full text-center">
					<AlertTitle>{getErrorTitle(errorType)}</AlertTitle>
					<AlertDescription>
						{getErrorDescription(errorType, errorMessage)}
					</AlertDescription>

					<div className="w-max mx-auto flex flex-wrap gap-3 mt-4">
						<Button
							variant="outline"
							size="sm"
							onClick={reset}
							className="flex items-center gap-2"
						>
							<RefreshCw className="size-4" />
							Try Again
						</Button>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => navigate({ to: "/" })}
							className="flex items-center gap-2"
						>
							<Home className="size-4" />
							Back to Home
						</Button>
					</div>

					{isDevelopment && (
						<div className="mt-4 p-3 bg-muted rounded-md">
							<details className="text-xs">
								<summary className="cursor-pointer font-mono font-semibold mb-2">
									Debug Information
								</summary>
								<div className="space-y-2 font-mono">
									<div>
										<strong>Error Type:</strong> {errorType}
									</div>
									<div>
										<strong>Error Message:</strong> {errorMessage}
									</div>
									{error instanceof Error && (
										<div>
											<strong>Stack Trace:</strong>
											<pre className="whitespace-pre-wrap mt-1 text-xs opacity-70">
												{error.stack}
											</pre>
										</div>
									)}
									{info && (
										<div>
											<strong>Component Info:</strong>
											<pre className="whitespace-pre-wrap mt-1 text-xs opacity-70">
												{JSON.stringify(info, null, 2)}
											</pre>
										</div>
									)}
								</div>
							</details>
						</div>
					)}
				</AlertContent>
			</Alert>
		</div>
	);
}
