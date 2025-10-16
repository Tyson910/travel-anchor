import type { LatLngExpression, Map as LeafletMap, Marker } from "leaflet";

import { divIcon, map as leafletMap, marker, tileLayer } from "leaflet";
import { onMount, tick } from "svelte";

export interface Airport {
	iata_code: string;
	latitude: number;
	longitude: number;
	name?: string;
	city_name?: string | null;
}

interface UseAirportParams {
	airports: Airport[];
	initialZoom?: number;
	initialCenter?: LatLngExpression;
}

export class UseAirportMap {
	map = $state<LeafletMap | null>(null);
	loading = $state(true);
	error = $state<string | null>(null);
	airportMarkers: Marker[] = $derived.by(() => {
		if (!this.map) return [];

		const newMarkers = this.airports.map((airport, index) => {
			return marker([airport.latitude, airport.longitude], {
				icon: this.createAirportIcon(airport, {
					isOrigin: true,
					color: this.getOriginColor(index),
				}),
			}).bindPopup(`<div>${airport.name}</div>`);
		});

		return newMarkers;
	});
	mapContainer: HTMLDivElement | null = $state(null);

	airports: Airport[] = $state([]);
	initialZoom = $state(3);
	initialCenter = $state([39.8283, -98.5795] as LatLngExpression); // Center of US;

	constructor(params: UseAirportParams) {
		this.airports = params.airports;
		if (params.initialCenter) this.initialCenter = params.initialCenter;
		if (params.initialZoom) this.initialZoom = params.initialZoom;
		// Watch for airport changes and update bounds
		$effect(() => {
			if (this.airports.length > 0 && this.map) {
				this.fitBoundsToRoutes(this.map);
			}
		});

		// Watch for airport changes and update markers
		$effect.pre(() => {
			if (!this.map) return;

			// Clear existing markers
			this.airportMarkers.forEach((marker) => {
				marker.remove();
			});

			tick().then(() => {
				this.airportMarkers.forEach((marker) => {
					marker.addTo(this.map as LeafletMap);
				});
			});
		});

		onMount(() => {
			// Initialize map when component is mounted
			this.initializeMap();

			return this.cleanupFn;
		});
	}

	initializeMap() {
		try {
			if (!this.mapContainer) {
				throw new Error("Map container not found");
			}

			// Initialize map
			const leafletMapInstance = leafletMap(this.mapContainer, {
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
			leafletMapInstance.setView(this.initialCenter, this.initialZoom);

			this.map = leafletMapInstance;
			this.loading = false;
			this.error = null;

			// Fit bounds if airports are available
			if (this.airports.length > 0) {
				this.fitBoundsToRoutes(leafletMapInstance);
			}
		} catch (err) {
			console.error("Error initializing map:", err);
			this.error = "Failed to initialize map";
			this.loading = false;
		}
	}

	cleanupFn() {
		if (this.map) {
			this.map.remove();
			this.map = null;
			this.airportMarkers.forEach((m) => {
				m.remove();
			});
			this.airportMarkers = [];
		}
	}

	fitBoundsToRoutes(mapInstance: LeafletMap) {
		const airports = this.airports;
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
			this.error = "Failed to fit map to routes";
		}
	}

	createAirportIcon(
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

	getOriginColor(index: number): string {
		const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
		return colors[index % colors.length] ?? "#3b82f6";
	}
}
