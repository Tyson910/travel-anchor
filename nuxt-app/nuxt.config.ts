// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	css: ["~/assets/css/global.css", "leaflet/dist/leaflet.css"],
	devServer: {
		port: 3001,
	},
	runtimeConfig: {
		API_ENDPOINT_URL: import.meta.env.API_ENDPOINT_URL,
	},
	modules: [
		"@nuxt/eslint",
		"@nuxt/image",
		"@nuxt/ui",
		"@nuxt/test-utils",
		"@vueuse/nuxt",
	],
	routeRules: {
		"/backend/**": {
			proxy: {
				to: `${import.meta.env.API_ENDPOINT_URL}/**`,
				headers: {
					// "Content-Security-Policy":
					// 	"default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';",
					"Referrer-Policy": "strict-origin-when-cross-origin",
					"Strict-Transport-Security":
						"max-age=31536000; includeSubDomains; preload",
					"X-Content-Type-Options": "nosniff",
					"X-Frame-Options": "DENY",
				},
			},
		},
	},
	$development: {
		runtimeConfig: {
			public: {
				SITE_URL: "http://localhost:3001",
			},
		},
	},
	$production: {
		runtimeConfig: {
			public: {
				SITE_URL: "https://flightanchor.com",
			},
		},
	},
});
