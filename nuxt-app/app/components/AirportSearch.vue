<script setup lang="ts">
import type { CommandPaletteItem } from "@nuxt/ui";

import { refDebounced } from "@vueuse/core";

import {
	type UseAirportSearchQueryResult,
	useAirportSearchQuery,
} from "~/composables/use-queries";

const searchTerm = ref("");
const searchTermDebounced = refDebounced(searchTerm, 200);

const emit = defineEmits<{
	airportSelect: [airport: UseAirportSearchQueryResult["airports"][number]];
}>();
const airportSearchQuery = useAirportSearchQuery(searchTermDebounced);

const airportItems = computed(() => {
	if (!airportSearchQuery.data.value?.airports) {
		return [];
	}

	return airportSearchQuery.data.value.airports.map(
		(airport) =>
			({
				id: airport.iata_code,
				prefix: airport.iata_code,
				label: airport.name,
				ignoreFilter: true,
				suffix: airport.city_name ?? undefined,
				onSelect: () => {
					emit("airportSelect", airport);
				},
			}) satisfies CommandPaletteItem,
	);
});
</script>

<template>
  <UCommandPalette
    v-model:search-term="searchTerm"
    :groups="[
      {
        id: 'airport',
        label: searchTerm ? `Airports matching '${searchTerm}'...` : 'Airports',
        items: airportItems,
      },
    ]"
    class="size-full"
  />
</template>
