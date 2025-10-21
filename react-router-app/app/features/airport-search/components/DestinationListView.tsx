import type { SearchPageLoaderResponse } from "~/routes/search";

import { ArrowRightIcon, PlaneIcon } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "~/components/ui/empty";
import { Separator } from "~/components/ui/separator";

type Route = SearchPageLoaderResponse[number];

export function DestinationListView({ routes }: { routes: Route[] }) {
	if (routes.length == 0) {
		return (
			<Empty className="border">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<PlaneIcon />
					</EmptyMedia>
					<EmptyTitle>No mutual destinations found</EmptyTitle>
					<EmptyDescription>
						Try adjusting your search criteria to find airports with shared
						flight routes.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{routes.map((route) => (
				<DestinationCard
					key={route.destination_airport.iata_code}
					route={route}
				/>
			))}
		</div>
	);
}

function DestinationCard({ route }: { route: Route }) {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div>
						<div className="font-semibold tracking-tight">
							{route.destination_airport.name}
						</div>
						<CardDescription className="text-sm">
							{route.destination_airport.city_name}{" "}
							{route.destination_airport.state_name}{" "}
							{route.destination_airport.country_name}
						</CardDescription>
					</div>
				</CardTitle>
			</CardHeader>

			<Separator />
			<CardContent className="space-y-4 mt-4">
				<div className="space-y-1">
					<OriginAirportsList
						destination={route.destination_airport}
						origins={route.origin_airport_options}
					/>
				</div>
			</CardContent>
		</Card>
	);
}

function OriginAirportsList({
	origins,
	destination,
}: {
	destination: Route["destination_airport"];
	origins: Route["origin_airport_options"];
}) {
	if (!origins || origins.length === 0) {
		return (
			<div className="text-sm text-muted-foreground">No origins available</div>
		);
	}

	return (
		<div className="space-y-2">
			{origins.map((origin, index) => (
				<div key={`${origin.iata_code}-${index}`}>
					<div className="flex gap-x-3 items-center w-full">
						<span className="font-medium">{destination.iata_code}</span>
						<ArrowRightIcon className="size-3" />
						<span className="font-medium">{origin.iata_code}</span>
					</div>
					<OriginDisplay origin={origin} />
					{index < origins.length - 1 && <Separator className="my-4" />}
				</div>
			))}
		</div>
	);
}

function convertKMtoMiles(distance_km: number) {
	const distanceInMiles = Math.round(distance_km * 0.62137);

	return new Intl.NumberFormat(undefined, {
		style: "decimal",
	}).format(distanceInMiles);
}

function getRouteDurationStr(duration_min: number) {
	// Calculate the number of full hours.
	const hours = Math.floor(duration_min / 60);
	// Calculate the remaining minutes using the modulo operator.
	const minutes = duration_min % 60;

	// Build the parts of the output string based on the calculated values.
	const hourString = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
	const minuteString =
		minutes > 0 ? `${minutes} min${minutes > 1 ? "s" : ""}` : "";

	// Combine the parts, adding a space if both hours and minutes are present.
	let result = "";
	if (hourString && minuteString) {
		result = `${hourString} ${minuteString}`;
	} else {
		// If only one part exists, use that. If neither, return "0 min".
		result = hourString || minuteString || "0 min";
	}

	return result;
}

function OriginDisplay({
	origin,
}: {
	origin: Route["origin_airport_options"][number];
}) {
	return (
		<div className="space-y-2 text-sm">
			<div className="flex flex-row gap-x-2">
				<span className="text-muted-foreground">Duration:</span>
				<span>
					{origin.duration_min
						? getRouteDurationStr(origin.duration_min)
						: "N/A"}
				</span>
			</div>

			{origin.distance_km && (
				<div className="flex flex-row gap-x-2">
					<span className="text-muted-foreground">Distance:</span>
					<span>{convertKMtoMiles(origin.distance_km)} miles</span>
				</div>
			)}

			{origin.airline_options && origin.airline_options.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-4 not-last:mb-2">
					{origin.airline_options.map((airline) => (
						<Badge key={airline.iata_code} variant="outline" size="sm">
							{airline.name}
						</Badge>
					))}
				</div>
			)}
		</div>
	);
}
