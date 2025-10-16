<script lang="ts">
	import 'leaflet/dist/leaflet.css';

	import type { LatLngExpression } from 'leaflet';

	import { type Airport, UseAirportMap } from '$lib/hooks/use-airport-map.svelte';
	import * as Alert from '$lib/components/ui/alert';

	interface Props {
		airports: Airport[];
		initialZoom?: number;
		initialCenter?: LatLngExpression;
	}

	const props: Props = $props();

	let airportMap = new UseAirportMap({
		airports: props.airports,
		initialZoom: props.initialZoom,
		initialCenter: props.initialCenter
	});
</script>

<div class="route-map-container">
	<div bind:this={airportMap.mapContainer} class="route-map"></div>

	{#if airportMap.loading}
		<div class="map-loading">
			<div class="loading-spinner">
				<!-- <UIcon name="i-heroicons-arrow-path" class="animate-spin" /> -->
				<span>Loading map...</span>
			</div>
		</div>
	{:else if airportMap.error}
		<div class="map-error">
			<Alert.Root variant="destructive">
				<Alert.Title>Map Error</Alert.Title>
				<Alert.Description>
					{airportMap.error}
				</Alert.Description>
			</Alert.Root>
		</div>
	{/if}
</div>

<style>
	.route-map-container {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 400px;
	}

	.route-map {
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.map-loading {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.8);
		z-index: 2;
	}

	.loading-spinner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		color: #6b7280;
	}

	.map-error {
		position: absolute;
		top: 1rem;
		left: 1rem;
		right: 1rem;
		z-index: 2;
	}

	:deep(.leaflet-container) {
		font-family: inherit;
		font-size: 0.875rem;
	}

	:deep(.leaflet-control-zoom) {
		border: none;
		border-radius: 0.375rem;
		overflow: hidden;
	}

	:deep(.leaflet-control-zoom a) {
		background: white;
		border: 1px solid #e5e7eb;
		color: #374151;
		font-weight: 600;
	}

	:deep(.leaflet-control-zoom a:hover) {
		background: #f9fafb;
		color: #111827;
	}
</style>
