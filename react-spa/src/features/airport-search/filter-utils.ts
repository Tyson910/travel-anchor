import type { SearchPageLoaderResponse } from "../../routes/search";

import { Clock, Plane } from "lucide-react";
import * as z from "zod";

import { IATAValidator } from "~/lib/validators";

export const airportSearchFiltersSchema = z.discriminatedUnion("field_name", [
	z.object({
		id: z.uuid(),
		field_name: z.literal("airline").describe("Airline"),
		value: z.array(z.string().nonempty()).min(1),
		codes: z.array(IATAValidator).min(1),
	}),
	// z.object({
	// 		id: z.uuid(),
	// 	field_name: z.literal("duration").describe("Max Duration"),
	// 	value: z.number().nonnegative().describe("Travel Time Delta"),
	// 	codes: z.array(IATAValidator).min(1),
	// }),
	// z.object({
	// 		id: z.uuid(),
	// 	field_name: z.literal("travelTimeDelta"),
	// 	value: z.number().nonnegative(),
	// 	codes: z.array(IATAValidator).min(1),
	// }),
]);

export type FilterSchema = z.infer<typeof airportSearchFiltersSchema>;

export const filterOptions = airportSearchFiltersSchema.options.map(
	(option) => ({
		label: option.shape.field_name.description || option.shape.field_name.value,
		value: option.shape.field_name.value,
	}),
);

export function getFilterIcon(fieldName: FilterSchema["field_name"]) {
	switch (fieldName) {
		case "airline":
			return Plane;
		// case "duration":
		// 	return Clock;
		// case "travelTimeDelta":
		// 	return CalendarClock;
		default:
			return Clock;
	}
}

export function getFilterLabel(fieldName: FilterSchema["field_name"]) {
	const matchedFilter = airportSearchFiltersSchema.options.find(
		(option) => option.shape.field_name.value == fieldName,
	);
	if (matchedFilter?.shape?.field_name?.description) {
		return matchedFilter.shape.field_name.description;
	}
	return fieldName;
}

export function applyFiltersToRoutes(
	routes: SearchPageLoaderResponse,
	filters: FilterSchema[],
): SearchPageLoaderResponse {
	if (filters.length === 0) {
		return routes;
	}
	return routes.filter((route) => {
		return filters.every((filter) => {
			if (filter.field_name === "airline") {
				return route.origin_airport_options.some((originOption) => {
					const isApplicableOrigin = filter.codes.includes(
						originOption.iata_code,
					);

					if (!isApplicableOrigin) return true;

					return originOption.airline_options.some((airline) =>
						filter.value.includes(airline.iata_code),
					);
				});
			}

			// For future filter types, add additional conditions here
			return true;
		});
	});
}
