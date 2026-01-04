import * as z from "zod";

import { nonEmptyStringValidator } from "@/lib/validators";

// --- Shared Types ---

export const unitNotationSchema = z.union([
	z.literal("'").describe("minute (angle)"),
	z.literal("''").describe("second (angle)"),
	z.literal("(Y)_pref").describe("(yotta)"),
	z.literal("(y)_pref").describe("(yocto)"),
	z.literal("(Z)_pref").describe("(zetta)"),
	z.literal("(z)_pref").describe("(zepto)"),
	z.literal("0.001").describe("parts per thousand"),
	z.literal("1").describe("Dimensionless"),
	z.literal("A").describe("ampere"),
	z.literal("a").describe("year"),
	z.literal("a_pref").describe("atto"),
	z.literal("AU").describe("astronomic unit"),
	z.literal("Bq").describe("becquerel"),
	z.literal("Bq_l-1").describe("becquerels per litre"),
	z.literal("Bq_m-2").describe("becquerels per square metre"),
	z.literal("Bq_m-3").describe("becquerels per cubic metre"),
	z.literal("Bq_s_m-3").describe("becquerel seconds per cubic metre"),
	z.literal("C").describe("coulomb"),
	z.literal("C_-1").describe("degrees Celsius per 100 metres"),
	z.literal("C_m-1").describe("degrees Celsius per metre"),
	z.literal("c_pref").describe("centi"),
	z.literal("cb_-1").describe("centibars per 12 hours"),
	z.literal("cb_s-1").describe("centibars per second"),
	z.literal("cd").describe("candela"),
	z.literal("Cel").describe("degree Celsius"),
	z.literal("cm").describe("centimetre"),
	z.literal("cm_h-1").describe("centimetres per hour"),
	z.literal("cm_s-1").describe("centimetres per second"),
	z.literal("d").describe("day"),
	z.literal("d_pref").describe("deci"),
	z.literal("da_pref").describe("deca"),
	z.literal("daPa").describe("dekapascal"),
	z.literal("dB").describe("decibel (6)"),
	z.literal("dB_deg-1").describe("decibels per degree"),
	z.literal("dB_m-1").describe("decibels per metre"),
	z.literal("deg2").describe("square degrees"),
	z.literal("deg_s-1").describe("degrees per second"),
	z.literal("degC").describe("degrees Celsius (8)"),
	z.literal("degree_(angle)").describe("degree (angle)"),
	z.literal("degrees_true").describe("degrees true"),
	z.literal("dm").describe("decimetre"),
	z.literal("dPa_s-1").describe("decipascals per second (microbar per second)"),
	z.literal("DU").describe("Dobson Unit (9)"),
	z.literal("E_pref").describe("exa"),
	z.literal("eV").describe("electron volt"),
	z.literal("F").describe("farad"),
	z.literal("f_pref").describe("femto"),
	z.literal("ft").describe("foot"),
	z.literal("g").describe("acceleration due to gravity"),
	z.literal("g_kg-1").describe("grams per kilogram"),
	z.literal("g_kg-1_s-1").describe("grams per kilogram per second"),
	z.literal("G_pref").describe("giga"),
	z.literal("gpm").describe("geopotential metre"),
	z.literal("Gy").describe("gray"),
	z.literal("H").describe("henry"),
	z.literal("h").describe("hour"),
	z.literal("h_pref").describe("hecto"),
	z.literal("ha").describe("hectare"),
	z.literal("hPa").describe("hectopascal"),
	z.literal("hPa_-1").describe("hectopascals per 3 hours"),
	z.literal("hPa_h-1").describe("hectopascals per hour"),
	z.literal("hPa_s-1").describe("hectopascals per second"),
	z.literal("Hz").describe("hertz"),
	z.literal("J").describe("joule"),
	z.literal("J_kg-1").describe("joules per kilogram"),
	z.literal("J_m-2").describe("joules per square metre"),
	z.literal("K").describe("kelvin"),
	z.literal("K_m-1").describe("kelvins per metre"),
	z
		.literal("K_m2_kg-1_s-1")
		.describe("kelvin square metres per kilogram per second"),
	z.literal("K_m_s-1").describe("kelvin metres per second"),
	z.literal("k_pref").describe("kilo"),
	z.literal("kg").describe("kilogram"),
	z.literal("kg-2_s-1").describe("per square kilogram per second"),
	z.literal("kg_kg-1").describe("kilograms per kilogram"),
	z.literal("kg_kg-1_s-1").describe("kilograms per kilogram per second"),
	z.literal("kg_m-1").describe("kilograms per metre"),
	z.literal("kg_m-2").describe("kilograms per square metre"),
	z.literal("kg_m-2_s-1").describe("kilograms per square metre per second"),
	z.literal("kg_m-3").describe("kilograms per cubic metre"),
	z.literal("km").describe("kilometre"),
	z.literal("km_d-1").describe("kilometres per day"),
	z.literal("km_h-1").describe("kilometres per hour"),
	z.literal("kPa").describe("kilopascal"),
	z.literal("kt").describe("knot"),
	z.literal("kt_km-1").describe("knots per 1000 metres"),
	z.literal("l").describe("litre"),
	z.literal("lm").describe("lumen"),
	z.literal("log_(m-1)").describe("logarithm per metre"),
	z.literal("log_(m-2)").describe("logarithm per square metre"),
	z.literal("lx").describe("lux"),
	z.literal("m").describe("metre"),
	z.literal("m-1").describe("per metre"),
	z.literal("m2").describe("square metres"),
	z.literal("m2_-1").describe("metres to the two thirds power per second"),
	z.literal("m2_Hz-1").describe("square metres per hertz"),
	z.literal("m2_rad-1_s").describe("square metres per radian squared"),
	z.literal("m2_s").describe("square metres second"),
	z.literal("m2_s-1").describe("square metres per second"),
	z.literal("m2_s-2").describe("square metres per second squared"),
	z.literal("m3").describe("cubic metres"),
	z.literal("m3_m-3").describe("cubic metres per cubic metre"),
	z.literal("m3_s-1").describe("cubic metres per second"),
	z.literal("m4").describe("metres to the fourth power"),
	z.literal("M_pref").describe("mega"),
	z.literal("m_pref").describe("milli"),
	z.literal("m_s-1").describe("metres per second"),
	z.literal("m_s-1_km-1").describe("metres per second per 1000 metres"),
	z.literal("m_s-1_m-1").describe("metres per second per metre"),
	z.literal("m_s-2").describe("metres per second squared"),
	z.literal("min").describe("minute (time)"),
	z.literal("mm").describe("millimetre"),
	z
		.literal("mm6_m-3")
		.describe("millimetres per the sixth power per cubic metre"),
	z.literal("mm_h-1").describe("millimetres per hour"),
	z.literal("mm_s-1").describe("millimetres per seconds"),
	z.literal("mol").describe("mole"),
	z.literal("mol_mol-1").describe("moles per mole"),
	z.literal("mon").describe("month"),
	z.literal("mSv").describe("millisievert"),
	z.literal("N").describe("newton"),
	z.literal("N_m-2").describe("newtons per square metre"),
	z.literal("n_pref").describe("nano"),
	z.literal("N_units").describe("N units"),
	z.literal("nautical_mile").describe("nautical mile"),
	z.literal("nbar").describe("nanobar = hPa 10^-6"),
	z.literal("Ohm").describe("ohm"),
	z.literal("okta").describe("eighths of cloud"),
	z.literal("P_pref").describe("peta"),
	z.literal("p_pref").describe("pico"),
	z.literal("Pa").describe("pascal"),
	z.literal("Pa_s-1").describe("pascals per second"),
	z.literal("pc").describe("parsec"),
	z.literal("percent").describe("per cent"),
	z.literal("pH_unit").describe("pH unit"),
	z.literal("rad").describe("radian"),
	z.literal("rad_m-1").describe("radians per metre"),
	z.literal("S").describe("siemens"),
	z.literal("s").describe("second"),
	z.literal("s-1").describe("per second (same as hertz)"),
	z.literal("s-2").describe("per second squared"),
	z.literal("S_m-1").describe("siemens per metre"),
	z.literal("s_m-1").describe("seconds per metre"),
	z.literal("sr").describe("steradian"),
	z.literal("Sv").describe("sievert"),
	z.literal("T").describe("tesla"),
	z.literal("t").describe("tonne"),
	z.literal("T_pref").describe("tera"),
	z.literal("u").describe("atomic mass unit"),
	z.literal("u_pref").describe("micro"),
	z.literal("V").describe("volt"),
	z.literal("W").describe("watt"),
	z.literal("W_m-1_sr-1").describe("watts per metre per steradian"),
	z.literal("W_m-2").describe("watts per square metre"),
	z.literal("W_m-2_sr-1").describe("watts per square metre per steradian"),
	z
		.literal("W_m-2_sr-1_cm")
		.describe("watts per square metre per steradian centimetre"),
	z
		.literal("W_m-2_sr-1_m")
		.describe("watts per square metre per steradian metre"),
	z.literal("W_m-3_sr-1").describe("watts per cubic metre per steradian"),
	z.literal("Wb").describe("weber"),
	z.literal("week").describe("week"),
]);

/**
 * NWS QuantitativeValue Schema
 * Common structure for values with units (e.g., Temperature, Distance, Wind Speed)
 */
const quantitativeValueSchema = z.object({
	value: z.number().nullable(), // NWS often returns null for missing sensor data
	unitCode: z.templateLiteral(["wmoUnit:", unitNotationSchema]).optional(),
	qualityControl: z
		.enum(["Z", "C", "S", "V", "X", "Q", "G", "B", "T"])
		.optional()
		.describe(
			"For values in observation records, the quality control flag from the MADIS system. The definitions of these flags can be found at https://madis.ncep.noaa.gov/madis_sfc_qc_notes.shtml",
		),
});

// --- Route 1: GET /points/{latitude},{longitude} ---

/**
 * Schema for the /points endpoint response.
 * Extracts gridId, gridX, and gridY to be used in subsequent calls.
 */
export const pointsResponseSchema = z.object({
	properties: z.object({
		gridId: nonEmptyStringValidator,
		gridX: z.number().int(),
		gridY: z.number().int(),
		// Useful context but not strictly requested:
		relativeLocation: z
			.object({
				properties: z
					.object({
						city: nonEmptyStringValidator.nonempty(),
						state: nonEmptyStringValidator.nonempty(),
					})
					.partial()
					.optional(),
			})
			.optional(),
	}),
});

// --- Route 2: GET /gridpoints/{gridId}/{gridX},{gridY}/stations ---

/**
 * Schema for a single Station feature.
 */
const stationFeatureSchema = z.object({
	properties: z.object({
		stationIdentifier: nonEmptyStringValidator,
		name: nonEmptyStringValidator,
		// Distance, forecast and bearing are often returned as QuantitativeValues in NWS API
		// Note: If these fields are missing in the specific gridpoints/stations endpoint,
		// .nullish() prevents parsing errors for null or undefined.
		forecast: z.url().nullish(),
		distance: quantitativeValueSchema.nullish(),
		bearing: quantitativeValueSchema.nullish(),
	}),
});

/**
 * Schema for the /gridpoints/.../stations endpoint response.
 * Returns an array of observation stations.
 */
export const stationsResponseSchema = z.object({
	features: z.array(stationFeatureSchema),
});

// --- Route 3: GET /stations/{stationId}/observations/latest ---

/**
 * Schema for the /stations/.../observations/latest endpoint response.
 * Extracts current weather conditions.
 */
export const observationResponseSchema = z.object({
	properties: z.object({
		// Weather Conditions
		temperature: quantitativeValueSchema,
		textDescription: nonEmptyStringValidator.nullish(),
		windChill: quantitativeValueSchema.nullish(),
		heatIndex: quantitativeValueSchema.nullish(),
		dewpoint: quantitativeValueSchema.nullish(),

		// Wind
		windSpeed: quantitativeValueSchema.nullish(),
		windDirection: quantitativeValueSchema.nullish(), // Degrees
		windGust: quantitativeValueSchema.nullish(),

		// Atmosphere
		relativeHumidity: quantitativeValueSchema.nullish(),
		visibility: quantitativeValueSchema.nullish(),
		barometricPressure: quantitativeValueSchema.nullish(),

		// Metadata
		timestamp: z.iso.datetime({ offset: true }), // ISO 8601
		// Note: 'station' in properties is usually the URL (ID), not the display name.
		// 'stationName' implies a display name which might need to be fetched from the Station endpoint
		// or inferred if the API provides a specific description field.
		// I've included strictly what was requested.
		station: nonEmptyStringValidator.optional(), // The URL ID, often used as reference
	}),
});

// --- Route 4: GET /gridpoints/{gridId}/{gridX},{gridY}/forecast ---

/**
 * Schema for a single forecast period from the NWS API.
 */
export const forecastPeriodSchema = z.object({
	number: z.number(),
	// name: z.string(),
	startTime: nonEmptyStringValidator,
	endTime: nonEmptyStringValidator,
	isDaytime: z.boolean(),
	temperature: z.number(),
	temperatureUnit: z.enum(["F", "C"]),
	temperatureTrend: z
		.union([
			z.literal("rising"),
			z.literal("falling"),
			z.literal("steady"),
			z.null(),
		])
		.optional(),
	probabilityOfPrecipitation: quantitativeValueSchema,
	dewpoint: quantitativeValueSchema.nullish(),
	relativeHumidity: quantitativeValueSchema.nullish(),
	windSpeed: nonEmptyStringValidator,
	windDirection: nonEmptyStringValidator,
	shortForecast: nonEmptyStringValidator,
	// icon: z.url(),
	// detailedForecast: nonEmptyStringValidator,
});

/**
 * Schema for the /gridpoints/.../forecast endpoint response.
 * Returns an array of forecast periods.
 */
export const forecastValidator = z.object({
	properties: z.object({
		periods: z.array(forecastPeriodSchema),
	}),
});

// --- Export Types ---
export type UnitNotation = z.infer<typeof unitNotationSchema>;
export type QuantitativeValueSchema = z.infer<typeof quantitativeValueSchema>;
export type PointsResponse = z.infer<typeof pointsResponseSchema>;
export type StationsResponse = z.infer<typeof stationsResponseSchema>;
export type ObservationResponse = z.infer<typeof observationResponseSchema>;
export type ForecastPeriod = z.infer<typeof forecastPeriodSchema>;
export type ForecastResponse = z.infer<typeof forecastValidator>;
