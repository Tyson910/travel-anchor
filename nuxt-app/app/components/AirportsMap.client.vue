<script setup lang="ts">
import type { LatLngExpression } from "leaflet";

import { type Airport, useAirportMap } from "~/composables/use-airport-map";

const props = withDefaults(
	defineProps<{
		airports: Airport[];
		initialZoom?: number;
		initialCenter?: LatLngExpression;
	}>(),
	{
		airports: () => [],
		initialZoom: 3,
		initialCenter: () => [39.8283, -98.5795] as LatLngExpression, // Center of US
	},
);

const mapContainer = useTemplateRef<HTMLDivElement | null>("map-container");

const { loading, error } = useAirportMap({
	mapContainer,
	airports: () => props.airports,
});
</script>

<template>
  <div class="route-map-container">
    <div ref="map-container" class="route-map"></div>

    <div v-if="loading" class="map-loading">
      <div class="loading-spinner">
        <UIcon name="lucide:arrow-right" class="animate-spin" />
        <span>Loading map...</span>
      </div>
    </div>

    <div v-if="error" class="map-error">
      <UAlert
        title="Map Error"
        :description="error"
        color="error"
        variant="solid"
      />
    </div>
  </div>
</template>

<style scoped>
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
