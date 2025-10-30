import { Icon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";

// Create a custom icon once
const customIcon = new Icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	iconRetinaUrl:
		"https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
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
