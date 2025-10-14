<script setup lang="ts">
interface PopularCombination {
  codes: string[];
  title: string;
  description: string;
  icon: string;
}

const popularCombinations = [
  {
    codes: ["JFK", "LAX"],
    title: "NYC + LAX",
    description: "East meets West Coast",
    icon: "lucide:plane",
  },
  {
    codes: ["ORD", "MIA"],
    title: "Chicago + Miami",
    description: "Midwest to Sunshine",
    icon: "lucide:map-pin",
  },
  {
    codes: ["SFO", "SEA"],
    title: "SF + Seattle",
    description: "West Coast Connection",
    icon: "lucide:compass",
  },
  {
    codes: ["BOS", "DCA"],
    title: "Boston + DC",
    description: "Northeast Corridor",
    icon: "lucide:building",
  },
  {
    codes: ["DEN", "DFW"],
    title: "Denver + Dallas",
    description: "Mountain to Texas",
    icon: "lucide:mountain",
  },
  {
    codes: ["ATL", "ORD"],
    title: "Atlanta + Chicago",
    description: "Major Hubs",
    icon: "lucide:anchor",
  },
] as const satisfies PopularCombination[];
</script>

<template>
  <UContainer>
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold mb-4">Popular Combinations</h2>
      <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Click any combination to instantly search for meeting points
      </p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      <UCard
        v-for="combination in popularCombinations"
        :key="combination.codes.join('-')"
        class="hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 border-2 hover:border-primary-200 dark:hover:border-primary-800"
      >
        <NuxtLink
          class="p-6 lg:p-8 text-center"
          :to="{
            path: '/search',
            query: {
              codes: combination.codes,
              view: 'map',
            },
          }"
        >
          <div class="flex justify-center mb-4">
            <UIcon
              :name="combination.icon"
              class="w-10 h-10 text-primary-500 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <h3 class="text-xl font-semibold mb-2">{{ combination.title }}</h3>
          <p class="text-muted-foreground">{{ combination.description }}</p>
        </NuxtLink>
      </UCard>
    </div>
  </UContainer>
</template>
