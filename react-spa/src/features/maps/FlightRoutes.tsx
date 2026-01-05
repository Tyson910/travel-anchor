import { useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";

import {
	FullscreenControl,
	GeolocateControl,
	Map as MapLibre,
	Marker,
	NavigationControl,
} from "react-map-gl/maplibre";

import { Button } from "@/components/ui/base-button";

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

export function AirlineRouteMap({ origin_airport }: AirlineRouteMapProps) {
	const [isDarkMode, setIsDarkMode] = useState(false);
	return (
		<>
			<Button type="button" onClick={() => setIsDarkMode((prev) => !prev)}>
				Toggle Dark Mode
			</Button>
			<MapLibre
				initialViewState={{
					longitude: origin_airport.longitude,
					latitude: origin_airport.latitude,
					zoom: 12,
				}}
				style={{ width: "100%", height: "600px" }}
				mapStyle={
					isDarkMode
						? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
						: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
				}
			>
				<Marker
					longitude={origin_airport.longitude}
					latitude={origin_airport.latitude}
					anchor="bottom"
				/>
				<FullscreenControl />
				<GeolocateControl />
				<NavigationControl />
			</MapLibre>
		</>
	);
}
