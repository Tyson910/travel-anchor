import "maplibre-gl/dist/maplibre-gl.css";

import { DivIcon } from "leaflet";
import {
	MapContainer,
	Marker,
	Polyline,
	Popup,
	TileLayer,
	useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/base-button";
import { formatDuration } from "@/lib/formatters";
import { generateGreatCircleArc } from "./route-utils";

type Airport = {
	iata_code: string;
	latitude: number;
	longitude: number;
	name: string;
	city_name: string | null;
	country_code: string;
};

type DestinationAirport = Airport & {
	distance_km: number | null;
	duration_min: number | null;
	airline_options: Array<{
		iata_code: string;
		name: string;
		is_oneworld: boolean;
		is_skyteam: boolean;
		is_staralliance: boolean;
		url: string | null;
		is_lowcost: boolean;
	}>;
};

interface AirlineRouteMapProps {
	origin_airport: Airport;
	destination_airports: DestinationAirport[];
}

const customIcon = new DivIcon({
	className: "custom-marker",
	html: '<div class="size-3 rounded-full bg-muted-foreground border-2 border-white shadow-lg"></div>',
	iconSize: [16, 16],
	iconAnchor: [8, 8],
});

const highlightedIcon = new DivIcon({
	className: "highlighted-marker ",
	html: '<div class="size-4 rounded-full bg-primary border-2 border-white shadow-lg"></div>',
	iconSize: [16, 16],
	iconAnchor: [8, 8],
});

interface AirportsMapProps {
	airports: Airport[];
}

function FitMapToBounds({ airports }: AirportsMapProps) {
	fitBoundsToRoutes(airports);
	return null;
}

export function AirlineRouteMap({
	origin_airport,
	destination_airports,
}: AirlineRouteMapProps) {
	return (
		<MapContainer
			boundsOptions={{
				padding: [20, 20],
			}}
			zoom={13}
			scrollWheelZoom={false}
			className=" size-full relative h-[600px] z-0"
		>
			<FitMapToBounds airports={destination_airports} />
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{destination_airports.map((airport) => {
				const arcPositions: [number, number][] = generateGreatCircleArc(
					[origin_airport.longitude, origin_airport.latitude],
					[airport.longitude, airport.latitude],
				).map(([lng, lat]) => [lat, lng]);

				return (
					<>
						<Polyline
							className=" opa"
							positions={arcPositions}
							pathOptions={{
								weight: 2,
								className:
									"opacity-20 hover:opacity-100 stroke-muted-foreground",
							}}
						/>
						<Marker
							key={airport.iata_code}
							position={[airport.latitude, airport.longitude]}
							icon={customIcon}
						>
							<Popup>
								<RouteDetailsDialog route={airport} />
							</Popup>
						</Marker>
					</>
				);
			})}

			<Marker
				key={origin_airport.iata_code}
				position={[origin_airport.latitude, origin_airport.longitude]}
				icon={highlightedIcon}
			>
				<Popup>{origin_airport.name}</Popup>
			</Marker>
		</MapContainer>
	);
}

interface RouteDetailsDialogProps {
	route: DestinationAirport | null;
}

function RouteDetailsDialog({ route }: RouteDetailsDialogProps) {
	const [showAllAirlines, setShowAllAirlines] = useState(false);

	if (!route) return null;

	// Show first 5 airlines by default, or all if "Show more" is clicked
	const visibleAirlines = showAllAirlines
		? route.airline_options
		: route.airline_options.slice(0, 5);
	const hasMoreAirlines = route.airline_options.length > 5;

	return (
		<div className="w-full">
			<div className="mb-4 sm:mb-6">
				<div className="font-bold mb-6 text-lg sm:text-xl leading-tight">
					{route.name}
				</div>
				<div>
					<div className="flex items-center gap-2 mt-1">
						<Badge variant="iata" size="sm" className="text-xs sm:text-sm">
							{route.iata_code}
						</Badge>
						{route.city_name && (
							<span className="text-sm sm:text-base text-muted-foreground">
								{route.city_name}, {route.country_code}
							</span>
						)}
					</div>
				</div>
			</div>

			<div className="space-y-4 sm:space-y-5">
				{/* Distance & Duration */}
				{(route.distance_km || route.duration_min) && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
						{route.distance_km && (
							<div className="p-3 bg-muted/30 rounded-md">
								<div className="text-xs sm:text-sm text-muted-foreground mb-1">
									Distance
								</div>
								<div className="text-xl sm:text-lg font-semibold">
									{route.distance_km.toLocaleString()} km
								</div>
							</div>
						)}
						{route.duration_min && (
							<div className="p-3 bg-muted/30 rounded-md">
								<div className="text-xs sm:text-sm text-muted-foreground mb-1">
									Duration
								</div>
								<div className="text-xl sm:text-lg font-semibold">
									{formatDuration(route.duration_min)}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Airlines */}
				{route.airline_options.length > 0 && (
					<div>
						<h4 className="font-semibold mb-3 text-base sm:text-sm">
							Airlines ({route.airline_options.length})
						</h4>
						<div className="space-y-3">
							{visibleAirlines.map((airline) => (
								<div
									key={airline.iata_code}
									className="
											flex flex-row items-center justify-between 
											p-3 sm:p-2 font-medium text-base sm:text-s
											border rounded-lg sm:rounded-md
											space-y-2 sm:space-y-0
											bg-card
										"
								>
									{airline.name}
								</div>
							))}

							{/* Show More/Less Button */}
							{hasMoreAirlines && (
								<Button
									type="button"
									variant="outline"
									onClick={() => setShowAllAirlines(!showAllAirlines)}
									className="w-full"
								>
									{showAllAirlines
										? "Show Less"
										: `Show ${route.airline_options.length - 5} More Airlines`}
								</Button>
							)}
						</div>
					</div>
				)}

				{/* Offline/Network Error Message */}
				{route.airline_options.length === 0 && (
					<div className="p-4 bg-muted/30 rounded-md text-center">
						<p className="text-sm text-muted-foreground">
							No airline information available for this route.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

function fitBoundsToRoutes(airports: Airport[]) {
	const map = useMap();

	if (airports.length === 0) return;

	const bounds: [number, number][] = [];

	airports.forEach((airport) => {
		bounds.push([airport.latitude, airport.longitude]);
	});

	if (bounds.length > 0) {
		map.fitBounds(bounds, { padding: [20, 20] });
	}
}
