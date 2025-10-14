import type { LatLngExpression, Map as LeafletMap, Marker } from "leaflet";

import { divIcon, map as leafletMap, marker, tileLayer } from "leaflet";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

export interface Airport {
	iata_code: string;
	latitude: number;
	longitude: number;
	name?: string;
	city_name?: string | null;
}

export interface UseAirportParams {
	airports: MaybeRefOrGetter<Airport[]>;
	mapContainer: Ref<HTMLDivElement | null>;
	initialZoom?: MaybeRefOrGetter<number>;
	initialCenter?: MaybeRefOrGetter<LatLngExpression>;
}

interface UseAirportMapReturn {
	map: Ref<LeafletMap | null>;
	loading: ComputedRef<boolean>;
	error: ComputedRef<string | null>;
}

export function useAirportMap(params: UseAirportParams): UseAirportMapReturn {
	const map = ref<LeafletMap | null>(null);
	const loading = ref(true);
	const error = ref<string | null>(null);

	const airportMarkers = ref<Marker[]>([]);

	function initializeMap() {
		const { mapContainer } = params;
		try {
			if (!mapContainer.value) {
				console.log(mapContainer);
				throw new Error("Map container not found");
			}

			// Initialize map
			map.value = leafletMap(mapContainer.value, {
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
			}).addTo(map.value as LeafletMap);

			// Set initial view
			map.value.setView(
				toValue(
					params.initialCenter ?? ([39.8283, -98.5795] as LatLngExpression),
				), // Center of US),
				toValue(params.initialZoom ?? 3),
			);

			loading.value = false;
			error.value = null;

			// Fit bounds if routes are available
			if (toValue(params.airports).length > 0) {
				fitBoundsToRoutes();
			}
		} catch (err) {
			console.error("Error initializing map:", err);
			error.value = "Failed to initialize map";
			loading.value = false;
		}
	}

	function fitBoundsToRoutes() {
		const airports = toValue(params.airports);
		if (!map.value || airports.length === 0) return;

		try {
			const bounds: [number, number][] = [];

			// Add destination airports to bounds
			airports.forEach((airport) => {
				bounds.push([airport.latitude, airport.longitude]);
			});

			if (bounds.length > 0) {
				map.value.fitBounds(bounds, { padding: [20, 20] });
			}
		} catch (err) {
			console.error("Error fitting bounds:", err);
			error.value = "Failed to fit map to routes";
		}
	}

	// Watch for route changes and update bounds
	watch(
		() => params.airports,
		(newAirports) => {
			if (toValue(newAirports).length > 0 && map.value) {
				nextTick(() => {
					fitBoundsToRoutes();
				});
			}
		},
		{ deep: true },
	);

	watchEffect(() => {
		if (!map.value) return;
		const airports = toValue(params.airports);
		airportMarkers.value.forEach((m) => {
			m.remove();
		});

		airportMarkers.value = airports.map((airport, index) => {
			return marker([airport.latitude, airport.longitude], {
				icon: createAirportIcon(airport, {
					isOrigin: true,
					color: getOriginColor(index),
				}),
			}).bindPopup(`<div>
        ${airport.name}
        </div>`);
		});

		airportMarkers.value.forEach((m) => {
			m.addTo(map.value as LeafletMap);
		});
	});

	onMounted(async () => {
		await nextTick();
		// Initialize map when component is mounted
		initializeMap();
	});

	const cleanupFn = () => {
		if (map.value) {
			map.value.remove();
			map.value = null;
			airportMarkers.value.forEach((m) => {
				m.remove();
			});
			airportMarkers.value = [];
		}
	};

	onUnmounted(cleanupFn);

	return {
		map: map as Ref<LeafletMap | null>,
		loading: computed(() => loading.value),
		error: computed(() => error.value),
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
