<script setup lang="ts">
import {
  type UseAirportSearchQueryResult,
  useAirportSearchQuery,
} from "~/composables/use-queries";

const airportSearchStr = ref("");
const debouncedAirportSearchStr = debouncedRef(airportSearchStr);
const selectedAirports = useState<
  UseAirportSearchQueryResult["airports"][number][]
>("airports", () => []);

const selectedIatas = computed(() =>
  selectedAirports.value
    .filter((airport) => !!airport)
    .map(({ iata_code }) => iata_code)
);

const airportSearchQuery = useAirportSearchQuery(debouncedAirportSearchStr);
</script>

<template>
  <div>
    <template v-if="selectedAirports.length > 0">
      <div v-for="(airport, i) in selectedAirports" class="mt-3">
        <UFormField
          label="Add a new origin airport"
          :ui="{
            container: 'flex flex-row',
            labelWrapper: 'mb-3',
          }"
        >
          <UInputMenu
            v-model:search-term="airportSearchStr"
            v-model:model-value="selectedAirports[i]"
            :items="airportSearchQuery?.data?.value?.airports"
            ignore-filter
            class="w-full"
            label-key="name"
          >
            <template #item="{ item }">
              <div class="grid grid-cols-11 w-full items-center gap-x-3">
                <UBadge
                  :label="item.iata_code"
                  variant="subtle"
                  class="w-max col-span-1"
                />
                <div class="flex flex-col col-span-10">
                  <p class="font-semibold">
                    {{ item.name }}
                  </p>
                  <p>
                    {{ item.city_name }}, {{ item.state_name }}
                    {{ item.country_name }}
                  </p>
                </div>
              </div>
            </template>
          </UInputMenu>
          <UButton
            v-if="selectedAirports.length > 1"
            icon="lucide:x"
            variant="ghost"
            @click="
              () => {
                selectedAirports = [...selectedAirports].filter(
                  (val, idx) => idx != i
                );
              }
            "
          />
        </UFormField>
      </div>
    </template>
    <template v-else>
      <UFormField
        label="Add a new origin airport"
        :ui="{
          container: 'flex flex-row',
          labelWrapper: 'mb-3',
        }"
      >
        <UInputMenu
          v-model:search-term="airportSearchStr"
          v-model:model-value="selectedAirports[0]"
          :items="airportSearchQuery?.data?.value?.airports"
          ignore-filter
          class="w-full"
          label-key="name"
        >
          <template #item="{ item }">
            <div class="grid grid-cols-11 w-full items-center gap-x-3">
              <UBadge
                :label="item.iata_code"
                variant="subtle"
                class="w-max col-span-1"
              />
              <div class="flex flex-col col-span-10">
                <p class="font-semibold">
                  {{ item.name }}
                </p>
                <p>
                  {{ item.city_name }}, {{ item.state_name }}
                  {{ item.country_name }}
                </p>
              </div>
            </div>
          </template>
        </UInputMenu>
      </UFormField>
    </template>

    <UButton
      v-if="selectedIatas.length < 3 && selectedIatas.length > 0"
      type="button"
      icon="lucide:plus"
      variant="soft"
      label="Add New Airport"
      class="text-lg font-semibold mt-5"
      block
      @click="
        () => {
          // @ts-expect-error need an invalid item
          selectedAirports.push(null);
        }
      "
    />

    <UButton
      :disabled="selectedIatas.length == 0"
      label="Find our meeting spot"
      class="text-lg font-semibold mt-5"
      block
      :to="{
        path: '/search',
        query: {
          codes: selectedIatas,
          view: 'map',
        },
      }"
    />
  </div>
</template>
