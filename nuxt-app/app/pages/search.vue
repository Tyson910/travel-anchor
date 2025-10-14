<script setup lang="ts">
import { AirportCard, AirportsMap, SearchSideBar } from "#components";
import { useFlightRouteQuery } from "~/composables/use-queries";
import { useSearchQueryParams } from "~/composables/use-query-params";

useSeoMeta({
  title:
    "FlightAnchor Search - Multi-City Flight Routes | Meeting Point Finder",
  description:
    "Search and compare flight routes from multiple airports to find your perfect meeting destination. FlightAnchor simplifies group travel planning.",
});

const { activeView, iataCodes } = useSearchQueryParams();
const iataQuery = useFlightRouteQuery();
</script>

<template>
  <UDashboardGroup>
    <SearchSideBar />

    <!-- Main Content Panel -->
    <UDashboardPanel id="search">
      <template #header>
        <UDashboardNavbar>
          <template #left>
            <div class="flex items-center gap-4">
              <h1 class="text-lg font-semibold">
                {{ iataQuery.data.value?.routes?.length }} Meeting Points
                <span
                  v-if="iataCodes.length > 0"
                  class="text-toned font-normal"
                >
                  from {{ iataCodes.join(", ") }}
                </span>
              </h1>
            </div>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <UContainer>
          <div class="flex flex-col gap-y-5 py-10">
            <template
              v-if="
                iataQuery.data.value && iataQuery.data.value.routes.length > 0
              "
            >
              <div
                v-if="activeView === 'grid'"
                class="grid grid-cols-1 md:grid-cols-2 gap-10"
              >
                <AirportCard
                  v-for="route in iataQuery.data.value.routes"
                  :key="route.destination_airport.iata_code"
                  :route="route"
                />
              </div>
              <div
                v-else-if="activeView === 'map'"
                class="h-[400px] md:h-[600px]"
              >
                <ClientOnly>
                  <AirportsMap
                    :airports="
                      iataQuery.data.value.routes.map(
                        (route) => route.destination_airport
                      )
                    "
                  />
                  <template #fallback>
                    <USkeleton class="size-full" />
                  </template>
                </ClientOnly>
              </div>
            </template>
            <template v-else-if="iataQuery.status.value == 'pending'">
              <div class="text-center">
                <div class="flex justify-center mb-4">
                  <UIcon
                    name="lucide:plane"
                    class="w-12 h-12 text-primary-500 animate-pulse"
                  />
                </div>
                <h3 class="text-xl font-semibold mb-2">
                  Finding your perfect meeting spots...
                </h3>
                <p class="text-muted-foreground">
                  Searching for destinations with direct flights from all your
                  selected airports
                </p>
              </div>
            </template>
            <template v-else>
              <div class="text-center py-12">
                <UIcon
                  name="lucide:search-x"
                  class="w-16 h-16 text-muted-foreground mb-4"
                />
                <h3 class="text-2xl font-semibold mb-2">
                  No common destinations found
                </h3>
                <p class="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any destinations with direct flights from all
                  your selected airports. Try adding more airports or checking
                  different combinations.
                </p>
                <UButton
                  label="Try Popular Combinations"
                  variant="outline"
                  @click="navigateTo('/')"
                />
              </div>
            </template>
          </div>
        </UContainer>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
