<script setup lang="ts">
import type { RadioGroupItem } from "@nuxt/ui";

import { useSearchQueryParams } from "~/composables/use-query-params";
import AirportSearch from "./AirportSearch.vue";

const viewItems = [
  {
    label: "Grid View",
    value: "grid",
    description: "View meeting points in a card grid layout",
    icon: "lucide:grid-2x2",
  },
  {
    label: "Map View",
    value: "map",
    description: "View meeting points on an interactive map",
    icon: "lucide:map-pinned",
  },
] as const satisfies RadioGroupItem[];

const { activeView, iataCodes, addAirport, removeAirport, setView } =
  useSearchQueryParams();
</script>

<template>
  <UDashboardSidebar
    resizable
    collapsible
    :default-size="20"
    :min-size="15"
    :max-size="30"
  >
    <template #header="{ collapsed }">
      <div class="flex items-center gap-2">
        <UIcon
          name="lucide:plane"
          class="size-5 text-primary-500 flex-shrink-0"
        />
        <h2 v-if="!collapsed" class="font-semibold text-sm">Flight Search</h2>
      </div>
    </template>

    <template #default="{ collapsed }">
      <!-- Selected Airports -->
      <div v-if="!collapsed" class="space-y-4">
        <div>
          <h3 class="text-sm font-medium text-toned mb-2">Selected Airports</h3>
          <div v-if="iataCodes.length > 0" class="flex flex-wrap gap-2">
            <UBadge
              v-for="iataCode in iataCodes"
              :key="iataCode"
              :label="iataCode"
              variant="solid"
              color="primary"
              trailing-icon="lucide:x"
              @click="removeAirport(iataCode)"
              class="cursor-pointer"
            />
          </div>
          <p v-else class="text-sm text-toned italic">No airports selected</p>
        </div>

        <!-- Add Airport Button -->
        <div>
          <UModal
            title="Search for an airport"
            :description="undefined"
            aria-describedby="undefined"
          >
            <UButton label="Add Airport" trailing-icon="lucide:plus" block />
            <template #content="{ close }">
              <div class="h-80">
                <AirportSearch
                  @airport-select="
                    (airport) => {
                      addAirport(airport.iata_code);
                      close();
                    }
                  "
                />
              </div>
            </template>
          </UModal>
        </div>

        <!-- View Toggle -->
        <div v-if="iataCodes.length > 0">
          <h3 class="text-sm font-medium text-toned mb-2">View Mode</h3>
          <URadioGroup
            orientation="vertical"
            color="primary"
            variant="table"
            :model-value="activeView"
            :items="viewItems"
            @update:model-value="
              (viewValue) => {
                setView(viewValue as 'map' | 'grid');
              }
            "
          />
        </div>

        <!-- Back to Homepage -->
        <div>
          <UButton
            label="← Back to Homepage"
            variant="ghost"
            to="/"
            block
            size="sm"
          />
        </div>
      </div>

      <!-- Collapsed State -->
      <div v-else class="flex flex-col items-center gap-4">
        <UModal
          title="Search for an airport"
          :description="undefined"
          aria-describedby="undefined"
        >
          <UButton icon="lucide:plus" size="sm" square variant="outline" />
          <template #content="{ close }">
            <div class="h-80">
              <AirportSearch
                @airport-select="
                  (airport) => {
                    addAirport(airport.iata_code);
                    close();
                  }
                "
              />
            </div>
          </template>
        </UModal>

        <div v-if="iataCodes.length > 0" class="text-center">
          <div class="text-xs text-toned mb-2">
            {{ iataCodes.length }} airports
          </div>
          <UFieldGroup orientation="vertical">
            <UButton
              :variant="activeView === 'grid' ? 'solid' : 'outline'"
              @click="setView('grid')"
              icon="lucide:grid-2x2"
              size="sm"
              square
            />
            <UButton
              :variant="activeView === 'map' ? 'solid' : 'outline'"
              @click="setView('map')"
              icon="lucide:map-pinned"
              size="sm"
              square
            />
          </UFieldGroup>
        </div>
      </div>
    </template>
  </UDashboardSidebar>
</template>
