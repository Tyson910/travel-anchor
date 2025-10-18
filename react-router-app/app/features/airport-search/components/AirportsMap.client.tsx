// import type { LatLngExpression, Map as LeafletMap } from "leaflet";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface Airport {
	iata_code: string;
	latitude: number;
	longitude: number;
	name: string;
	city_name: string | null;
}

interface AirportsMapProps {
	airports: Airport[];
}

function FitMapToBounds({ airports }: AirportsMapProps) {
	fitBoundsToRoutes(airports);
	return null;
}

export function AirportsMap({ airports }: AirportsMapProps) {
	return (
		<MapContainer
			boundsOptions={{
				padding: [20, 20],
			}}
			zoom={13}
			scrollWheelZoom={false}
			className=" size-full relative h-[600px] z-0"
		>
			<FitMapToBounds airports={airports} />
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{airports.map((airport) => {
				return (
					<Marker
						key={airport.iata_code}
						position={[airport.latitude, airport.longitude]}
					>
						<Popup>{airport.name}</Popup>
					</Marker>
				);
			})}
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
