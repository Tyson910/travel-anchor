// @ts-check

import react from "@astrojs/react";
import svelte from "@astrojs/svelte";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 3001,
	},
	site: "https://flight-anchor.com",
	vite: { plugins: [tailwindcss()] },
	integrations: [vue({ devtools: true }), svelte(), react()],
});
