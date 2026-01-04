import type {
	QuantitativeValueSchema,
	UnitNotation,
} from "./weather.validators";

function convertUnitToString({
	value,
	unitCode,
	qualityControl,
}: QuantitativeValueSchema) {
	if (!unitCode) return null;
	if (value == null) return null;

	const unitNotation = unitCode?.replace("wmoUnit:", "") as UnitNotation;

	switch (unitNotation) {
		case "degC":
			return Math.round((value * 9) / 5 + 32).toString();
		default:
			return null;
	}
}
