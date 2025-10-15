import type { LatLngExpression, Map as LeafletMap, Marker } from "leaflet";

import { divIcon, map as leafletMap, marker, tileLayer } from "leaflet";
import { onMount } from "svelte";

interface Airport {
	iata_code: string;
	latitude: number;
	longitude: number;
	name?: string;
	city_name?: string | null;
}

interface UseAirportParams {
	airports: Airport[];
	mapContainer: HTMLElement | null;
	initialZoom?: number;
	initialCenter?: LatLngExpression;
}

interface UseAirportMapReturn {
	readonly map: LeafletMap | null;
	readonly loading: boolean;
	readonly error: string | null;
}

export function useAirportMap(params: UseAirportParams): UseAirportMapReturn {
	let map = $state<LeafletMap | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let airportMarkers = $state<Marker[]>([]);

	function initializeMap() {
		const { mapContainer } = params;
		try {
			if (!mapContainer) {
				throw new Error("Map container not found");
			}

			// Initialize map
			const leafletMapInstance = leafletMap(mapContainer, {
				zoomControl: true,
				attributionControl: true,
				scrollWheelZoom: true,
				doubleClickZoom: true,
				dragging: true,
			});

			// Add tile layer
			tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(leafletMapInstance);

			// Set initial view
			leafletMapInstance.setView(
				params.initialCenter ?? ([39.8283, -98.5795] as LatLngExpression), // Center of US
				params.initialZoom ?? 3,
			);

			map = leafletMapInstance;
			loading = false;
			error = null;

			// Fit bounds if airports are available
			if (params.airports.length > 0) {
				fitBoundsToRoutes(leafletMapInstance);
			}
		} catch (err) {
			console.error("Error initializing map:", err);
			error = "Failed to initialize map";
			loading = false;
		}
	}

	function fitBoundsToRoutes(mapInstance: LeafletMap) {
		const airports = params.airports;
		if (airports.length === 0) return;

		try {
			const bounds: [number, number][] = [];

			// Add destination airports to bounds
			airports.forEach((airport) => {
				bounds.push([airport.latitude, airport.longitude]);
			});

			if (bounds.length > 0) {
				mapInstance.fitBounds(bounds, { padding: [20, 20] });
			}
		} catch (err) {
			console.error("Error fitting bounds:", err);
			error = "Failed to fit map to routes";
		}
	}

	// Watch for airport changes and update bounds
	$effect(() => {
		const currentAirports = params.airports;

		if (currentAirports.length > 0 && map) {
			fitBoundsToRoutes(map);
		}
	});

	// Watch for airport changes and update markers
	$effect(() => {
		const currentAirports = params.airports;

		if (!map) return;

		// Clear existing markers
		airportMarkers.forEach((marker) => {
			marker.remove();
		});

		const newMarkers = currentAirports.map((airport, index) => {
			return marker([airport.latitude, airport.longitude], {
				icon: createAirportIcon(airport, {
					isOrigin: true,
					color: getOriginColor(index),
				}),
			}).bindPopup(`<div>${airport.name}</div>`);
		});

		airportMarkers = newMarkers;

		// Add new markers to map
		newMarkers.forEach((marker) => {
			marker.addTo(map as LeafletMap);
		});
	});

	const cleanupFn = () => {
		if (map) {
			map.remove();
			map = null;
			airportMarkers.forEach((m) => {
				m.remove();
			});
			airportMarkers = [];
		}
	};

	onMount(() => {
		// Initialize map when component is mounted
		initializeMap();

		return cleanupFn;
	});

	return {
		map: $derived(map),
		loading: $derived(loading),
		error: $derived(error),
	};
}

function createAirportIcon(
	airport: Airport,
	options: { isOrigin: boolean; color?: string },
) {
	const backgroundColor = options.isOrigin ? options.color : "#6b7280";
	const borderColor = options.isOrigin ? options.color : "#4b5563";

	return divIcon({
		html: `
      <div style="
        background-color: ${backgroundColor};
        border: 2px solid ${borderColor};
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: all 0.2s ease;
      " 
      onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 8px rgba(0, 0, 0, 0.3)'"
      onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.2)'"
      >
        ${airport.iata_code}
      </div>
    `,
		iconSize: [32, 32],
		iconAnchor: [16, 16],
		className: "airport-marker",
	});
}

function getOriginColor(index: number): string {
	const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
	return colors[index % colors.length] ?? "#3b82f6";
}
