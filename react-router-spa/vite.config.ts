import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: true,
		port: 3001,
		strictPort: true,
	},
	plugins: [react(), cloudflare(), tailwindcss(), devtoolsJson()],
});
