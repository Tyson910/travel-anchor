import type { QuantitativeValueSchema } from "./weather.validators";

import { describe, expect, it } from "vitest";

import { formatWeatherValue } from "./unit-math";

describe("formatWeatherValue", () => {
	describe("Temperature conversions", () => {
		it("converts degC to Fahrenheit (whole numbers)", () => {
			const input: QuantitativeValueSchema = {
				value: 20,
				unitCode: "wmoUnit:degC",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "68°F",
				userFriendlyUnit: "°F",
				value: 68,
			});
		});

		it("converts Cel to Fahrenheit (whole numbers)", () => {
			const input: QuantitativeValueSchema = {
				value: 0,
				unitCode: "wmoUnit:Cel",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "32°F",
				userFriendlyUnit: "°F",
				value: 32,
			});
		});

		it("converts negative Celsius to Fahrenheit", () => {
			const input: QuantitativeValueSchema = {
				value: -40,
				unitCode: "wmoUnit:degC",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "-40°F",
				userFriendlyUnit: "°F",
				value: -40,
			});
		});

		it("converts high temperature correctly", () => {
			const input: QuantitativeValueSchema = {
				value: 100,
				unitCode: "wmoUnit:degC",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "212°F",
				userFriendlyUnit: "°F",
				value: 212,
			});
		});
	});

	describe("Wind speed conversions", () => {
		it("converts km/h to mph (tenths)", () => {
			const input: QuantitativeValueSchema = {
				value: 25,
				unitCode: "wmoUnit:km_h-1",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "15.5 mph",
				userFriendlyUnit: "mph",
				value: 15.5,
			});
		});

		it("converts m/s to mph (tenths)", () => {
			const input: QuantitativeValueSchema = {
				value: 10,
				unitCode: "wmoUnit:m_s-1",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "22.4 mph",
				userFriendlyUnit: "mph",
				value: 22.4,
			});
		});

		it("converts zero wind speed", () => {
			const input: QuantitativeValueSchema = {
				value: 0,
				unitCode: "wmoUnit:km_h-1",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "0 mph",
				userFriendlyUnit: "mph",
				value: 0,
			});
		});
	});

	describe("Visibility conversions", () => {
		it("converts meters to miles when > 0.1 mi (tenths)", () => {
			const input: QuantitativeValueSchema = {
				value: 1609,
				unitCode: "wmoUnit:m",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "1 mi",
				userFriendlyUnit: "mi",
				value: 1,
			});
		});

		it("converts meters to feet when < 0.1 mi", () => {
			const input: QuantitativeValueSchema = {
				value: 100,
				unitCode: "wmoUnit:m",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "328 ft",
				userFriendlyUnit: "ft",
				value: 328,
			});
		});

		it("converts kilometers to miles when > 0.1 mi (tenths)", () => {
			const input: QuantitativeValueSchema = {
				value: 10,
				unitCode: "wmoUnit:km",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "6.2 mi",
				userFriendlyUnit: "mi",
				value: 6.2,
			});
		});

		it("converts kilometers to feet when < 0.1 mi", () => {
			const input: QuantitativeValueSchema = {
				value: 0.05,
				unitCode: "wmoUnit:km",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "164 ft",
				userFriendlyUnit: "ft",
				value: 164,
			});
		});
	});

	describe("Pressure conversions", () => {
		it("converts Pascals to inHg (tenths)", () => {
			const input: QuantitativeValueSchema = {
				value: 101325,
				unitCode: "wmoUnit:Pa",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "29.9 inHg",
				userFriendlyUnit: "inHg",
				value: 29.9,
			});
		});

		it("converts hectopascals to inHg (tenths)", () => {
			const input: QuantitativeValueSchema = {
				value: 1013.25,
				unitCode: "wmoUnit:hPa",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "29.9 inHg",
				userFriendlyUnit: "inHg",
				value: 29.9,
			});
		});
	});

	describe("Pass-through formatting", () => {
		it("formats percentages", () => {
			const input: QuantitativeValueSchema = {
				value: 85.7,
				unitCode: "wmoUnit:percent",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "86%",
				userFriendlyUnit: "%",
				value: 86,
			});
		});

		it("formats degree_(angle) with cardinal direction", () => {
			const input: QuantitativeValueSchema = {
				value: 180,
				unitCode: "wmoUnit:degree_(angle)",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "180° S",
				userFriendlyUnit: "°",
				value: 180,
			});
		});

		it("formats degrees_true with cardinal direction", () => {
			const input: QuantitativeValueSchema = {
				value: 270,
				unitCode: "wmoUnit:degrees_true",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "270° W",
				userFriendlyUnit: "°",
				value: 270,
			});
		});

		it("formats north wind direction", () => {
			const input: QuantitativeValueSchema = {
				value: 0,
				unitCode: "wmoUnit:degree_(angle)",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "0° N",
				userFriendlyUnit: "°",
				value: 0,
			});
		});

		it("formats northeast wind direction", () => {
			const input: QuantitativeValueSchema = {
				value: 45,
				unitCode: "wmoUnit:degree_(angle)",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "45° NE",
				userFriendlyUnit: "°",
				value: 45,
			});
		});
	});

	describe("Edge cases", () => {
		it("handles zero Celsius correctly (32°F)", () => {
			const input: QuantitativeValueSchema = {
				value: 0,
				unitCode: "wmoUnit:degC",
			};
			const result = formatWeatherValue(input);
			expect(result).toEqual({
				formattedString: "32°F",
				userFriendlyUnit: "°F",
				value: 32,
			});
		});

		it("returns null for null values", () => {
			const input: QuantitativeValueSchema = {
				value: null,
				unitCode: "wmoUnit:degC",
			};
			const result = formatWeatherValue(input);
			expect(result).toBeNull();
		});

		it("returns null for missing unitCode", () => {
			const input: QuantitativeValueSchema = {
				value: 20,
				unitCode: undefined,
			};
			const result = formatWeatherValue(input);
			expect(result).toBeNull();
		});

		it("returns null for unknown units", () => {
			const input = {
				value: 20,
				// biome-ignore lint/suspicious/noExplicitAny: testing unknown unit type
				unitCode: "wmoUnit:unknownUnit" as any,
			};
			const result = formatWeatherValue(input);
			expect(result).toBeNull();
		});
	});
});
