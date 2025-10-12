import { testClient } from "hono/testing";

import { app } from "./index.ts";
import { describe, expect, it } from "bun:test";

describe("Airport API", () => {
	const client = testClient(app).v1.airport;
	describe("GET /airport/:IATA", () => {
		it("should return airport details for a valid IATA code", async () => {
			const response = await client[":IATA"].$get({
				param: {
					IATA: "PHX",
				},
			});
			expect(response.status).toBe(200);
			const responseBody = await response.json();
			expect(responseBody).toHaveProperty("airport.iata_code", "PHX");
		});

		it("should return a 404 error for an invalid IATA code", async () => {
			const response = await client[":IATA"].$get({
				param: {
					IATA: "XXX",
				},
			});
			expect(response.status).toBe(404);
		});
	});

	describe("GET /airport/:IATA/route", () => {
		it("should return the routes for a given airport", async () => {
			const response = await client[":IATA"].route.$get({
				param: {
					IATA: "PHX",
				},
			});
			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);
			if (response.ok) {
				const responseBody = await response.json();
				expect(Array.isArray(responseBody.routes)).toBe(true);
			}
		});

		it("should return an empty array if the airport has no routes", async () => {
			const response = await client[":IATA"].route.$get({
				param: {
					IATA: "OLH", // Assuming OLH has no routes in test data
				},
			});
			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);
			if (response.ok) {
				const responseBody = await response.json();
				expect(responseBody.routes).toBeArray();
				expect(responseBody.routes).toHaveLength(0);
			}
		});
	});

	describe("GET /airport", () => {
		it("should return a list of airports based on the search query", async () => {
			const response = await client.$get({
				query: {
					query: "Phoenix",
				},
			});
			expect(response.status).toBe(200);
			const { airports } = await response.json();
			expect(Array.isArray(airports)).toBe(true);
			expect(airports.length).toBeGreaterThan(0);
		});

		it("should return an empty array if no airports match the query", async () => {
			const response = await client.$get({
				query: {
					query: "NonExistentPlace",
				},
			});
			expect(response.status).toBe(200);
			const responseBody = await response.json();
			expect(responseBody).toEqual({
				airports: [],
			});
		});
	});
});
