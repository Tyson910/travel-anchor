import type {
	QuantitativeValueSchema,
	UnitNotation,
} from "./weather.validators";

export type FormattedWeatherValue = {
	formattedString: string;
	userFriendlyUnit: string;
	value: number;
} | null;

/**
 * Converts a degree value to cardinal direction
 * @param degrees - Wind direction in degrees (0-360)
 * @returns Cardinal direction (N, NE, E, SE, S, SW, W, NW)
 */
function degreesToCardinal(degrees: number) {
	const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
	const index = Math.floor((((degrees % 360) + 360) % 360) / 45) % 8;
	return directions[index];
}

/**
 * Formats weather values from metric/SI units to imperial/US customary units
 * @param value - Numeric value to convert
 * @param unitCode - WMO unit code (e.g., "wmoUnit:degC")
 * @returns Formatted weather value with string representation, user-friendly unit, and numeric value
 */
export function formatWeatherValue({
	value,
	unitCode,
}: QuantitativeValueSchema): FormattedWeatherValue {
	if (!unitCode) return null;
	if (value == null) return null;

	const unitNotation = unitCode?.replace("wmoUnit:", "") as UnitNotation;

	switch (unitNotation) {
		// Temperature conversions (whole numbers)
		case "degC":
		case "Cel": {
			const fahrenheit = Math.round((value * 9) / 5 + 32);
			return {
				formattedString: `${fahrenheit}°F`,
				userFriendlyUnit: "°F",
				value: fahrenheit,
			};
		}

		// Wind speed conversions (tenths)
		case "km_h-1": {
			const mph = value * 0.621371;
			const rounded = Number.parseFloat(mph.toFixed(1));
			return {
				formattedString: `${rounded} mph`,
				userFriendlyUnit: "mph",
				value: rounded,
			};
		}

		case "m_s-1": {
			const mph = value * 2.23694;
			const rounded = Number.parseFloat(mph.toFixed(1));
			return {
				formattedString: `${rounded} mph`,
				userFriendlyUnit: "mph",
				value: rounded,
			};
		}

		// Visibility conversions (tenths for > 0.1 mi, feet for < 0.1 mi)
		case "m": {
			const miles = value * 0.000621371;
			if (miles < 0.1) {
				const feet = value * 3.28084;
				const rounded = Math.round(feet);
				return {
					formattedString: `${rounded} ft`,
					userFriendlyUnit: "ft",
					value: rounded,
				};
			}
			const rounded = Number.parseFloat(miles.toFixed(1));
			return {
				formattedString: `${rounded} mi`,
				userFriendlyUnit: "mi",
				value: rounded,
			};
		}

		case "km": {
			const miles = value * 0.621371;
			if (miles < 0.1) {
				const feet = value * 3280.84;
				const rounded = Math.round(feet);
				return {
					formattedString: `${rounded} ft`,
					userFriendlyUnit: "ft",
					value: rounded,
				};
			}
			const rounded = Number.parseFloat(miles.toFixed(1));
			return {
				formattedString: `${rounded} mi`,
				userFriendlyUnit: "mi",
				value: rounded,
			};
		}

		// Barometric pressure conversions (tenths)
		case "Pa": {
			const inHg = value * 0.0002953;
			const rounded = Number.parseFloat(inHg.toFixed(1));
			return {
				formattedString: `${rounded} inHg`,
				userFriendlyUnit: "inHg",
				value: rounded,
			};
		}

		case "hPa": {
			const inHg = value * 0.02953;
			const rounded = Number.parseFloat(inHg.toFixed(1));
			return {
				formattedString: `${rounded} inHg`,
				userFriendlyUnit: "inHg",
				value: rounded,
			};
		}

		// Pass-through units (no conversion needed)
		case "percent": {
			const rounded = Math.round(value);
			return {
				formattedString: `${rounded}%`,
				userFriendlyUnit: "%",
				value: rounded,
			};
		}

		case "degree_(angle)":
		case "degrees_true": {
			const rounded = Math.round(value);
			const cardinal = degreesToCardinal(rounded);
			if (!cardinal) return null;
			return {
				formattedString: `${rounded}° ${cardinal}`,
				userFriendlyUnit: "°",
				value: rounded,
			};
		}

		// TODO: Add knot conversions for wind (kt → mph)
		// TODO: Add precipitation conversions (mm → inches)
		// TODO: Add snow depth conversions (cm → inches)
		// TODO: Add distance conversions for station proximity (nautical_mile → miles)
		// TODO: Add Kelvin temperature conversion (K → °F)

		default:
			return null;
	}
}
