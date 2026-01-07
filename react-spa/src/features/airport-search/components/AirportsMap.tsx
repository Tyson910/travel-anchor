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

const customIcon = new DivIcon({
	className: "custom-marker",
	html: '<div style="width: 16px; height: 16px; border-radius: 50%; background-color: var(--color-primary); border: 2px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);" />',
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
						icon={customIcon}
					>
						<Popup>{airport.name}</Popup>
					</Marker>
				);
			})}
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
