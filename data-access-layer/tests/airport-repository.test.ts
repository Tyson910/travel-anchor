import {
	getAirportByIATA,
	searchAirport,
} from "../src/domains/airport/repository";
import { kyselyDriver } from "../src/shared/database";
import { describe, expect, test } from "bun:test";

describe("Airport Repository Smoke Tests", () => {
	test("getAirportByIATA - should resolve with airport data for valid IATA", async () => {
		const result = await getAirportByIATA("JFK");

		expect(result).toBeDefined();
		expect(result).toHaveProperty("iata_code", "JFK");
		expect(result).toHaveProperty("name");
		expect(result).toHaveProperty("city_name");
		expect(result).toHaveProperty("country_name");
	});

	test("getAirportByIATA - should throw for non-existent IATA", async () => {
		expect(getAirportByIATA("XXX")).rejects.toThrow();
	});

	test("getAirportByIATA - should accept custom database instance", async () => {
		const result = await getAirportByIATA("LAX", kyselyDriver);
		expect(result).toBeDefined();
		expect(result).toHaveProperty("iata_code", "LAX");
	});

	test("searchAirport - should resolve with array of results", async () => {
		const result = await searchAirport("New York");
		expect(result).toBeArray();
	});

	test("searchAirport - should handle empty query", async () => {
		const result = await searchAirport("");
		expect(Array.isArray(result)).toBe(true);
	});

	test("searchAirport - should accept custom database instance", async () => {
		const result = await searchAirport("Los Angeles", kyselyDriver);
		expect(Array.isArray(result)).toBe(true);
	});

		test("searchAirport - should find a city by name", async () => {
		const result = await searchAirport("phoenix");
		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(2)
	});
});
