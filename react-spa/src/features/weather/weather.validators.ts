import * as z from "zod";

import { nonEmptyStringValidator } from "@/lib/validators";

// --- Shared Types ---

/**
 * NWS QuantitativeValue Schema
 * Common structure for values with units (e.g., Temperature, Distance, Wind Speed)
 */
const quantitativeValueSchema = z.object({
	value: z.number().nullable(), // NWS often returns null for missing sensor data
	unitCode: nonEmptyStringValidator.optional(),
	qualityControl: nonEmptyStringValidator.optional(),
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
		// Distance and bearing are often returned as QuantitativeValues in NWS API
		// Note: If these fields are missing in the specific gridpoints/stations endpoint,
		// .nullish() prevents parsing errors for null or undefined.
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

// --- Export Types ---
export type PointsResponse = z.infer<typeof pointsResponseSchema>;
export type StationsResponse = z.infer<typeof stationsResponseSchema>;
export type ObservationResponse = z.infer<typeof observationResponseSchema>;
