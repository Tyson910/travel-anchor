<script setup lang="ts">
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
</script>

<template>
  <Body
    class="scroll-smooth bg-default font-sans selection:bg-primary selection:text-white"
  >
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <UApp>
      <UMain>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UMain>
      <!-- <UFooter /> -->
    </UApp>
    <DevOnly>
      <VueQueryDevtools button-position="bottom-left" />
    </DevOnly>
  </Body>
</template>
