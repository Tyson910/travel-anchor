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
							<Popup>{airport.name}</Popup>
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
