<script setup lang="ts">
import { HomepageSearch, PopularCombinations } from "#components";
useSeoMeta({
  title:
    "FlightAnchor - Find Your Perfect Meeting Point | Multi-City Flight Search",
  description:
    "Discover destinations with direct flights from multiple airports. FlightAnchor helps you find the perfect meeting point for group trips, business meetings, and family reunions.",
});
</script>

<template>
  <div class="py-20 lg:py-32 space-y-20">
    <!-- Hero Section -->
    <section>
      <UContainer class="px-4">
        <div class="text-center">
          <!-- Headline -->
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            FlightAnchor: Find Your Perfect Meeting Point
          </h1>

          <!-- Description -->
          <p
            class="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed"
          >
            Enter multiple airport codes to discover destinations with direct
            flights from all locations. FlightAnchor anchors your travel plans,
            making it easy to organize group trips, business meetings, and
            family reunions.
          </p>
        </div>

        <div class="max-w-3xl mx-auto">
          <HomepageSearch />
        </div>
      </UContainer>
    </section>

    <UContainer>
      <USeparator label="or" />
    </UContainer>

    <section>
      <PopularCombinations />
    </section>
  </div>
</template>
