import type { Filter } from "~/components/ui/filters";
import type { MockDestination } from "~/lib/travel-filters";

import { useMemo } from "react";

export function useDestinationFilters(
	destinations: MockDestination[],
	filters: Filter[],
) {
	const filteredDestinations = useMemo(() => {
		return destinations.filter((destination) => {
			return filters.every((filter) => {
				const { field, operator, values } = filter;

				switch (field) {
					case "airlines":
						if (operator === "is_any_of") {
							return values.some((airline) =>
								destination.airlines.includes(airline as string),
							);
						}
						if (operator === "is_not_any_of") {
							return !values.some((airline) =>
								destination.airlines.includes(airline as string),
							);
						}
						return true;

					case "alliances":
						if (operator === "is_any_of") {
							return values.some((alliance) =>
								destination.alliances.includes(alliance as string),
							);
						}
						if (operator === "is_not_any_of") {
							return !values.some((alliance) =>
								destination.alliances.includes(alliance as string),
							);
						}
						return true;

					case "regions":
						if (operator === "is_any_of") {
							return values.includes(destination.region as string);
						}
						if (operator === "is_not_any_of") {
							return !values.includes(destination.region as string);
						}
						return true;

					case "airport_size":
						if (operator === "is") {
							return destination.airportSize === values[0];
						}
						if (operator === "is_not") {
							return destination.airportSize !== values[0];
						}
						return true;

					case "flight_frequency":
						if (operator === "is") {
							return destination.flightFrequency === values[0];
						}
						if (operator === "is_not") {
							return destination.flightFrequency !== values[0];
						}
						return true;

					case "price_range":
						if (operator === "between" && values.length === 2) {
							const min = Number(values[0]);
							const max = Number(values[1]);
							return (
								destination.priceRange.min >= min &&
								destination.priceRange.max <= max
							);
						}
						return true;

					case "flight_duration":
						if (operator === "between" && values.length === 2) {
							const min = Number(values[0]);
							const max = Number(values[1]);
							return (
								destination.flightDuration >= min &&
								destination.flightDuration <= max
							);
						}
						if (operator === "equals") {
							return destination.flightDuration === Number(values[0]);
						}
						if (operator === "greater_than") {
							return destination.flightDuration > Number(values[0]);
						}
						if (operator === "less_than") {
							return destination.flightDuration < Number(values[0]);
						}
						return true;

					case "direct_only":
						if (operator === "is") {
							return destination.directFlights === values[0];
						}
						if (operator === "is_not") {
							return destination.directFlights !== values[0];
						}
						return true;

					case "departure_time":
						if (operator === "is") {
							return destination.popularTimes.includes(values[0] as string);
						}
						return true;

					default:
						return true;
				}
			});
		});
	}, [destinations, filters]);

	return filteredDestinations;
}
