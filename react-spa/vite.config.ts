import { fileURLToPath, URL } from "node:url";

import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools as tanstackDevTools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: true,
		port: 3001,
		strictPort: true,
	},
	preview: {
		host: true,
		port: 3001,
		strictPort: true,
	},
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		viteReact(),
		tailwindcss(),
		cloudflare(),
		devtoolsJson(),
		tanstackDevTools(),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"~": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
