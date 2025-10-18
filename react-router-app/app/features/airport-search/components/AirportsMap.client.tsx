// import type { LatLngExpression, Map as LeafletMap } from "leaflet";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "../custom-leaftlet.css";

import { useEffect } from "react";

interface Airport {
	iata_code: string;
	latitude: number;
	longitude: number;
	name?: string;
	city_name?: string | null;
}

interface AirportsMapProps {
	airports: Airport[];
}

export function AirportsMap({ airports }: AirportsMapProps) {
	useEffect(() => {
		fitBoundsToRoutes(airports);
	}, [airports]);
	return (
		<MapContainer
			center={[51.505, -0.09]}
			zoom={13}
			scrollWheelZoom={false}
			className=" size-full relative min-h-[400px]"
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker position={[51.505, -0.09]}>
				<Popup>
					A pretty CSS3 popup. <br /> Easily customizable.
				</Popup>
			</Marker>
		</MapContainer>
	);
}

function fitBoundsToRoutes(airports: Airport[]) {
	if (airports.length === 0) return;

	const map = useMap();
	const bounds: [number, number][] = [];

	airports.forEach((airport) => {
		bounds.push([airport.latitude, airport.longitude]);
	});

	if (bounds.length > 0) {
		map.fitBounds(bounds, { padding: [20, 20] });
	}
}
