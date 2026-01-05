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

interface Airport {
	iata_code: string;
	latitude: number;
	longitude: number;
	name: string;
	city_name: string | null;
}

interface AirlineRouteMapProps {
	origin_airport: Airport;
	destination_airports: Airport[];
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
