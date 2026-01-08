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

import type { SearchPageLoaderResponse } from "~/routes/search";

import { generateGreatCircleArc } from "@/features/maps/route-utils";

const customIcon = new DivIcon({
	className: "custom-marker",
	html: '<div class="size-3 rounded-full bg-muted-foreground border-2 border-white shadow-lg"></div>',
	iconSize: [16, 16],
	iconAnchor: [8, 8],
});

const highlightedIcon = new DivIcon({
	className: "highlighted-marker",
	html: '<div class="size-4 rounded-full bg-primary border-2 border-white shadow-lg"></div>',
	iconSize: [16, 16],
	iconAnchor: [8, 8],
});

interface Airport {
	iata_code: string;
	latitude: number;
	longitude: number;
	name: string;
	city_name: string | null;
}

interface AirportsMapProps {
	routes: SearchPageLoaderResponse;
}

function FitMapToBounds({ routes }: AirportsMapProps) {
	const map = useMap();

	if (routes.length === 0) return null;

	const bounds: [number, number][] = [];

	// Add all origin airports to bounds
	routes.forEach((route) => {
		route.origin_airport_options.forEach((origin) => {
			bounds.push([origin.latitude, origin.longitude]);
		});
		// Add all destination airports to bounds
		bounds.push([
			route.destination_airport.latitude,
			route.destination_airport.longitude,
		]);
	});

	if (bounds.length > 0) {
		map.fitBounds(bounds, { padding: [20, 20] });
	}

	return null;
}

export function AirportsMap({ routes }: AirportsMapProps) {
	// Extract unique origin airports
	const originAirportsMap = new Map<string, Airport>();

	routes.forEach((route) => {
		route.origin_airport_options.forEach((origin) => {
			if (!originAirportsMap.has(origin.iata_code)) {
				originAirportsMap.set(origin.iata_code, {
					iata_code: origin.iata_code,
					latitude: origin.latitude,
					longitude: origin.longitude,
					name: origin.name,
					city_name: origin.city_name,
				});
			}
		});
	});

	const originAirports = Array.from(originAirportsMap.values());

	return (
		<MapContainer
			boundsOptions={{
				padding: [20, 20],
			}}
			zoom={13}
			scrollWheelZoom={false}
			className=" size-full relative h-[600px] z-0"
		>
			<FitMapToBounds routes={routes} />
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{/* Render flight path lines */}
			{routes.map((route) => {
				return route.origin_airport_options.map((origin) => {
					const arcPositions: [number, number][] = generateGreatCircleArc(
						[origin.longitude, origin.latitude],
						[
							route.destination_airport.longitude,
							route.destination_airport.latitude,
						],
					).map(([lng, lat]) => [lat, lng]);

					return (
						<Polyline
							key={`${origin.iata_code}-${route.destination_airport.iata_code}`}
							positions={arcPositions}
							pathOptions={{
								weight: 1,
								className:
									"opacity-20 hover:opacity-100 stroke-muted-foreground",
							}}
						/>
					);
				});
			})}

			{/* Render destination airport markers */}
			{routes.map((route) => {
				const airport = route.destination_airport;
				return (
					<Marker
						key={airport.iata_code}
						position={[airport.latitude, airport.longitude]}
						icon={customIcon}
					>
						<Popup>{airport.name}</Popup>
					</Marker>
				);
			})}

			{/* Render origin airport markers */}
			{originAirports.map((airport) => {
				return (
					<Marker
						key={`origin-${airport.iata_code}`}
						position={[airport.latitude, airport.longitude]}
						icon={highlightedIcon}
					>
						<Popup>{airport.name}</Popup>
					</Marker>
				);
			})}
		</MapContainer>
	);
}
