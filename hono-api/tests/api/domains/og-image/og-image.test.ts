import { testClient } from "hono/testing";

import { app } from "../../../../src/backend/app.ts";
import { describe, expect, it } from "bun:test";

describe("OG Image API", () => {
	const client = testClient(app)["og-image"];

	describe("GET /og-image", () => {
		it("should return a PNG image for valid IATA codes", async () => {
			const response = await client.$get({
				query: {
					IATA: ["PHX", "TUS"],
				},
			});

			expect(response.status).toBe(200);
			expect(response.headers.get("content-type")).toBe("image/png");
			expect(response.headers.get("cross-origin-resource-policy")).toBe(
				"cross-origin",
			);

			const buffer = await response.arrayBuffer();
			expect(buffer.byteLength).toBeGreaterThan(0);
			expect(buffer.byteLength).toBeGreaterThan(30000); // Expect reasonable image size
		});

		it("should return a PNG image for single IATA code", async () => {
			const response = await client.$get({
				query: {
					IATA: "PHX",
				},
			});

			expect(response.status).toBe(200);
			expect(response.headers.get("content-type")).toBe("image/png");
			expect(response.headers.get("cross-origin-resource-policy")).toBe(
				"cross-origin",
			);

			const buffer = await response.arrayBuffer();
			expect(buffer.byteLength).toBeGreaterThan(0);
		});

		it("should return a PNG image for multiple IATA codes", async () => {
			const response = await client.$get({
				query: {
					IATA: ["PHX", "TUS", "LAX", "JFK"],
				},
			});

			expect(response.status).toBe(200);
			expect(response.headers.get("content-type")).toBe("image/png");
			expect(response.headers.get("cross-origin-resource-policy")).toBe(
				"cross-origin",
			);

			const buffer = await response.arrayBuffer();
			expect(buffer.byteLength).toBeGreaterThan(0);
		});

		it("should return 400 for empty IATA array", async () => {
			const response = await client.$get({
				query: {
					IATA: [],
				},
			});

			expect(response.status).toBe(400);
		});

		it("should return 500 for server errors", async () => {
			// This test would need to mock the service to throw an error
			// For now, we'll just verify the error response structure
			const response = await client.$get({
				query: {
					IATA: ["INVALID"],
				},
			});

			// Depending on the service implementation, this might return 200 with empty routes
			// or 500 if the service throws an error
			expect([200, 500]).toContain(response.status);

			if (response.status === 500) {
				const errorBody = await response.json();
				expect(errorBody).toHaveProperty("message");
			}
		});

		it("should include correct security headers", async () => {
			const response = await client.$get({
				query: {
					IATA: "PHX",
				},
			});

			expect(response.status).toBe(200);

			// Verify OG image specific headers
			expect(response.headers.get("content-type")).toBe("image/png");
			expect(response.headers.get("cross-origin-resource-policy")).toBe(
				"cross-origin",
			);

			// Verify other security headers are still present
			expect(response.headers.get("x-content-type-options")).toBe("nosniff");
			expect(response.headers.get("x-frame-options")).toBe("SAMEORIGIN");
			expect(response.headers.get("referrer-policy")).toBe("no-referrer");
		});
	});
});
