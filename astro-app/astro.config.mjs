// @ts-check

import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	integrations: [vue({ devtools: true }), svelte(), react()],
});
