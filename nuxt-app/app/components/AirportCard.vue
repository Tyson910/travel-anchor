<script setup lang="ts">
import { useFlightRouteQuery } from "~/composables/use-queries";

const { data } = await useFlightRouteQuery();

const routes = computed(() => {
  if (!data.value) return [];
  return data.value.routes;
});

function convertKMtoMiles(distance_km: number) {
  const distanceInMiles = Math.round(distance_km * 0.62137);

  return new Intl.NumberFormat(undefined, {
    style: "decimal",
  }).format(distanceInMiles);
}

function getRouteDurationStr(duration_min: number) {
  // Calculate the number of full hours.
  const hours = Math.floor(duration_min / 60);
  // Calculate the remaining minutes using the modulo operator.
  const minutes = duration_min % 60;

  // Build the parts of the output string based on the calculated values.
  const hourString = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""}` : "";
  const minuteString =
    minutes > 0 ? `${minutes} min${minutes > 1 ? "s" : ""}` : "";

  // Combine the parts, adding a space if both hours and minutes are present.
  let result = "";
  if (hourString && minuteString) {
    result = `${hourString} ${minuteString}`;
  } else {
    // If only one part exists, use that. If neither, return "0 min".
    result = hourString || minuteString || "0 min";
  }

  return result;
}
</script>

<template>
  <div>
    <template v-if="routes">
      <UCard v-for="route in routes" class="border-accented shadow-sm">
        <template #header>
          <div class="flex flex-row gap-x-3 items-center">
            <UBadge
              :label="route.destination_airport.iata_code"
              variant="solid"
              color="primary"
            />
            <p class="font-semibold">
              {{ route.destination_airport.city_name }},
              {{ route.destination_airport.state_name }}
              {{
                route.destination_airport.country_name ||
                route.destination_airport.country_code
              }}
            </p>
          </div>
        </template>

        <div class="flex flex-col gap-y-3">
          <OriginAirportDisplay
            v-for="originAirport in route.origin_airport_options"
            :key="originAirport.route_id"
            :airport="originAirport"
          />

          <div
            v-for="originAirport in route.origin_airport_options"
            :key="originAirport.route_id"
          >
            <div class="flex flex-col gap-x-4">
              <p class="font-semibold">
                From {{ originAirport.city_name }} ({{
                  originAirport.iata_code
                }})
              </p>
              <p class="flex flex-row items-center text-toned">
                <template v-if="originAirport.distance_km">
                  {{ convertKMtoMiles(originAirport.distance_km) }} miles
                  <UIcon name="lucide:dot" class="size-5" />
                </template>
                <template v-if="originAirport.duration_min">
                  {{ getRouteDurationStr(originAirport.duration_min) }}
                </template>
              </p>
            </div>
            <!-- <p
        v-for="airline in data.airport.airline_options"
        :key="airline.iata_code"
      >
        {{ airline.name }}
      </p> -->
          </div>
        </div>
      </UCard>
    </template>
  </div>
</template>
