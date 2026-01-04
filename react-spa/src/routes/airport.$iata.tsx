import {
	createFileRoute,
	type ErrorComponentProps,
	Link,
	PathParamError,
	useNavigate,
} from "@tanstack/react-router";
import {
	ArrowLeft,
	Clock,
	Home,
	Mountain,
	Plane,
	RefreshCw,
} from "lucide-react";

import { ClipPunkView } from "@/features/weather/components/ClipPunkCard";
import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertTitle,
} from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "~/components/ui/empty";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { AirportsMap } from "~/features/airport-search/components/AirportsMap";
import { WeatherCard } from "~/features/weather/components/WeatherCard";
import { fetchWeatherStation } from "~/features/weather/weather-client";
import {
	getErrorDescription,
	getErrorMessage,
	getErrorTitle,
	getErrorType,
} from "~/lib/error-utils";
import { rpcClient } from "~/lib/rpc-client";
import { IATAValidator } from "~/lib/validators";

export type AirportDetailPageLoaderResponse =
	(typeof Route)["types"]["loaderData"];

export const Route = createFileRoute("/airport/$iata")({
	staleTime: 5000,
	component: AirportHubPage,
	loader: async (ctx) => {
		const { iata } = ctx.params;

		const validatedIATAResult = IATAValidator.safeParse(iata);

		if (!validatedIATAResult.success) {
			throw new PathParamError("Invalid IATA code");
		}

		const airportResponse = await rpcClient("/airport/:IATA", {
			params: {
				IATA: validatedIATAResult.data,
			},
		});

		if (airportResponse.error) {
			throw new Error("Unable to load airport", {
				cause: airportResponse.error,
			});
		}

		const weatherStationData = await fetchWeatherStation({
			latitude: airportResponse.data.airport.latitude,
			longitude: airportResponse.data.airport.longitude,
		});

		return {
			airport: airportResponse.data.airport,
			weatherStation: weatherStationData?.stationProperties ?? null,
			gridCoordinates: weatherStationData?.gridCoordinates ?? null,
		};
	},
	pendingComponent: LoadingSkeleton,
	errorComponent: ErrorElement,
});

function AirportHubPage() {
	const { airport, weatherStation } = Route.useLoaderData();

	const locationParts = [
		airport.city_name,
		airport.state_name,
		airport.country_name,
	].filter((val) => val != null);

	const locationString =
		locationParts.length > 0 ? locationParts.join(", ") : "Unavailable";

	return (
		<div className="bg-primary/2">
			<div className="container mx-auto px-4 py-8">
				<title>
					{airport.name} | {airport.iata_code} | Travel Anchor
				</title>
				<meta
					name="description"
					content={`Airport information for ${airport.name} (${airport.iata_code}) in ${locationString}`}
				/>

				{/* Back Navigation */}
				<nav className="mb-6">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="size-4" />
						Back to Search
					</Link>
				</nav>

				{/* Hero Header */}
				<header className="space-y-3 mb-8">
					<Badge variant="iata" size="technical">
						{airport.iata_code}
					</Badge>
					<h1 className="text-3xl font-bold font-sans tracking-tight text-foreground">
						{airport.name}
					</h1>
					<p className="text-lg text-muted-foreground">{locationString}</p>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						{airport.timezone && (
							<span className="inline-flex items-center gap-1.5">
								<Clock className="size-3" />
								{airport.timezone}
							</span>
						)}
						{airport.elevation_ft !== null && (
							<span className="inline-flex items-center gap-1.5">
								<Mountain className="size-3" />
								{airport.elevation_ft.toLocaleString()} ft
							</span>
						)}
						{!airport.timezone && airport.elevation_ft === null && (
							<span>Unavailable</span>
						)}
					</div>
				</header>

				<Separator className="my-6" />

				{/* Map Section */}
				<section className="mb-8">
					<h2 className="text-xl font-medium tracking-tight mb-4">Location</h2>
					<Card variant="blueprint" size="sm" className="overflow-hidden p-0">
						<AirportsMap airports={[airport]} />
					</Card>
				</section>

				<Separator className="my-6" />

				{/* Future Sections */}
				<section>
					<h2 className="text-xl font-medium tracking-tight mb-4">
						Coming Soon
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card variant="technical" className="border-dashed">
							<WeatherCard
								stationId={weatherStation?.stationIdentifier ?? ""}
							/>
						</Card>

						<Card variant="technical" className="border-dashed">
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<Plane />
									</EmptyMedia>
									<EmptyTitle>Outbound Flights</EmptyTitle>
									<EmptyDescription>
										Direct flight destinations from this airport.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</Card>
					</div>
				</section>
			</div>
		</div>
	);
}

function LoadingSkeleton() {
	return (
		<div className="bg-primary/2">
			<div className="container mx-auto px-4 py-8">
				{/* Back Navigation Skeleton */}
				<nav className="mb-6">
					<Skeleton variant="grid" className="h-5 w-32" />
				</nav>

				{/* Hero Header Skeleton */}
				<header className="space-y-3 mb-8">
					<Skeleton variant="grid" className="h-6 w-16" />
					<Skeleton variant="grid" className="h-9 w-80" />
					<Skeleton variant="grid" className="h-6 w-48" />
					<div className="flex items-center gap-4">
						<Skeleton variant="grid" className="h-4 w-32" />
						<Skeleton variant="grid" className="h-4 w-24" />
					</div>
				</header>

				<Separator className="my-6" />

				{/* Map Section Skeleton */}
				<section className="mb-8">
					<Skeleton variant="grid" className="h-6 w-24 mb-4" />
					<Skeleton variant="grid" className="h-[600px] w-full rounded-sm" />
				</section>

				<Separator className="my-6" />

				{/* Future Sections Skeleton */}
				<section>
					<Skeleton variant="grid" className="h-6 w-32 mb-4" />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Skeleton variant="grid" className="h-48 w-full rounded-xs" />
						<Skeleton variant="grid" className="h-48 w-full rounded-xs" />
					</div>
				</section>
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
