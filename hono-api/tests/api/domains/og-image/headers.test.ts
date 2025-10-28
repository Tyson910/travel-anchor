import { testClient } from "hono/testing";

import { app } from "../../../../src/backend/app.ts";
import { describe, expect, it } from "bun:test";

describe("OG Image Headers", () => {
	const client = testClient(app)["og-image"];

	describe("Cross-Origin Resource Policy", () => {
		it("should set cross-origin CORP header for OG images", async () => {
			const response = await client.$get({
				query: {
					IATA: "PHX",
				},
			});

			expect(response.status).toBe(200);
			expect(response.headers.get("cross-origin-resource-policy")).toBe(
				"cross-origin",
			);
		});

		it("should maintain other security headers", async () => {
			const response = await client.$get({
				query: {
					IATA: ["PHX", "TUS"],
				},
			});

			expect(response.status).toBe(200);

			// Verify OG image specific headers
			expect(response.headers.get("content-type")).toBe("image/png");
			expect(response.headers.get("cross-origin-resource-policy")).toBe(
				"cross-origin",
			);

			// Verify other security headers are still present from secureHeaders()
			expect(response.headers.get("x-content-type-options")).toBe("nosniff");
			expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
			expect(response.headers.get("referrer-policy")).toBe("no-referrer");
			expect(response.headers.get("strict-transport-security")).toBeTruthy();
			expect(response.headers.get("x-xss-protection")).toBe("0");
		});

		it("should include CORS headers for frontend access", async () => {
			const response = await client.$get({
				query: {
					IATA: "PHX",
				},
			});

			expect(response.status).toBe(200);
			// CORS headers should be present from the main app middleware
			expect(response.headers.get("vary")).toBe("Origin");
		});

		it("should include cache-related headers", async () => {
			const response = await client.$get({
				query: {
					IATA: "PHX",
				},
			});

			expect(response.status).toBe(200);
			// ETag should be present for caching
			expect(response.headers.get("etag")).toBeTruthy();
			expect(typeof response.headers.get("etag")).toBe("string");
		});
	});

	describe("Content Headers", () => {
		it("should return correct content type", async () => {
			const response = await client.$get({
				query: {
					IATA: "PHX",
				},
			});

			expect(response.status).toBe(200);
			expect(response.headers.get("content-type")).toBe("image/png");
		});

		it("should return consistent image sizes for same inputs", async () => {
			const query = { IATA: "PHX" };

			const response1 = await client.$get({ query });
			const response2 = await client.$get({ query });

			expect(response1.status).toBe(200);
			expect(response2.status).toBe(200);

			// Compare actual buffer sizes instead of content-length header
			const buffer1 = await response1.arrayBuffer();
			const buffer2 = await response2.arrayBuffer();

			expect(buffer1.byteLength).toBe(buffer2.byteLength);
			expect(buffer1.byteLength).toBeGreaterThan(0);
		});
	});
});
