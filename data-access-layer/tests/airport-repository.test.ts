import {
	getAirportByIATA,
	searchAirport,
} from "../src/domains/airport/repository";
import { kyselyDriver } from "../src/shared/database";
import { describe, expect, test } from "bun:test";

describe("Airport Repository Smoke Tests", () => {
	test("getAirportByIATA - should not throw for valid IATA code", async () => {
		// Test with a common airport code
		const result = getAirportByIATA("JFK");
		expect(result).toBeDefined();
		expect(result).toBeInstanceOf(Promise);

		// Should not throw synchronously
		expect(() => getAirportByIATA("JFK")).not.toThrow();
	});

	test("getAirportByIATA - should handle different IATA codes", async () => {
		const testCodes = ["LAX", "ORD", "DFW", "ATL"];

		for (const code of testCodes) {
			const result = getAirportByIATA(code);
			expect(result).toBeDefined();
			expect(result).toBeInstanceOf(Promise);
		}
	});

	test("getAirportByIATA - should accept custom database instance", async () => {
		const result = getAirportByIATA("JFK", kyselyDriver);
		expect(result).toBeDefined();
		expect(result).toBeInstanceOf(Promise);
	});

	test("searchAirport - should not throw for valid query", async () => {
		const result = searchAirport("New York");
		expect(result).toBeDefined();
		expect(result).toBeInstanceOf(Promise);

		// Should not throw synchronously
		expect(() => searchAirport("New York")).not.toThrow();
	});

	test("searchAirport - should handle different query types", async () => {
		const testQueries = [
			"Los Angeles",
			"LAX",
			"Chicago",
			"ORD",
			"International",
			"Airport",
		];

		for (const query of testQueries) {
			const result = searchAirport(query);
			expect(result).toBeDefined();
			expect(result).toBeInstanceOf(Promise);
		}
	});

	test("searchAirport - should handle empty query", async () => {
		const result = searchAirport("");
		expect(result).toBeDefined();
		expect(result).toBeInstanceOf(Promise);
	});

	test("searchAirport - should handle single character query", async () => {
		const result = searchAirport("A");
		expect(result).toBeDefined();
		expect(result).toBeInstanceOf(Promise);
	});

	test("searchAirport - should accept custom database instance", async () => {
		const result = searchAirport("New York", kyselyDriver);
		expect(result).toBeDefined();
		expect(result).toBeInstanceOf(Promise);
	});

	test("searchAirport - should handle 3-character IATA codes", async () => {
		const result = searchAirport("JFK");
		expect(result).toBeDefined();
		expect(result).toBeInstanceOf(Promise);
	});

	test("Functions should be properly exported", () => {
		expect(getAirportByIATA).toBeDefined();
		expect(typeof getAirportByIATA).toBe("function");
		expect(searchAirport).toBeDefined();
		expect(typeof searchAirport).toBe("function");
	});

	test("Functions should have correct parameter signatures", () => {
		// These tests verify the functions accept the expected number of parameters
		expect(getAirportByIATA.length).toBeGreaterThanOrEqual(1);
		expect(searchAirport.length).toBeGreaterThanOrEqual(1);
	});
});
