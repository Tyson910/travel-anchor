import * as z from "zod";

export const sortOptionsValidator = z.enum([
	"time-difference",
	"average-time",
	"shortest-longest-flight",
	"distance-difference",
	"average-distance",
	"airport-name",
]);

export type SortOption = z.infer<typeof sortOptionsValidator>;

export interface SortOptionConfig {
	label: string;
	description: string;
}

export const SORT_OPTIONS = {
	"time-difference": {
		label: "By Smallest Time Difference",
		description: "Which destination is most fair for travel time?",
	},
	"average-time": {
		label: "By Lowest Average Time",
		description: "Which destination requires least total time in the air?",
	},
	"shortest-longest-flight": {
		label: "By Shortest 'Longest' Flight",
		description:
			"Which destination avoids anyone having a terribly long flight?",
	},
	"distance-difference": {
		label: "By Smallest Distance Difference",
		description: "Which destination is most fair for distance?",
	},
	"average-distance": {
		label: "By Lowest Average Distance",
		description: "Which destination is closest to us on average?",
	},
	"airport-name": {
		label: "By Airport Name (A-Z)",
		description: "Let me find a specific airport in this list.",
	},
} as const satisfies Record<SortOption, SortOptionConfig>;

// Route type will be defined when we migrate the full components
export interface Route {
	destination_airport: {
		name: string;
	};
	origin_airport_options?: Array<{
		duration_min?: number | null;
		distance_km?: number | null;
	}>;
}

function calculateVariance(values: number[]): number {
	if (values.length === 0) return Infinity;
	if (values.length === 1) return 0;

	const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
	const variance =
		values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length;
	return variance;
}

function calculateAverage(values: number[]): number {
	if (values.length === 0) return Infinity;
	return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function getTimeValues(route: Route): number[] {
	return (
		route.origin_airport_options
			?.filter((origin) => origin.duration_min != null)
			?.map((origin) => origin.duration_min as number) || []
	);
}

function getDistanceValues(route: Route): number[] {
	return (
		route.origin_airport_options
			?.filter((origin) => origin.distance_km != null)
			?.map((origin) => origin.distance_km as number) || []
	);
}

export function sortRoutes(routes: Route[], sortOption: SortOption): Route[] {
	const sortedRoutes = [...routes];

	switch (sortOption) {
		case "time-difference":
			return sortedRoutes.sort((a, b) => {
				const varianceA = calculateVariance(getTimeValues(a));
				const varianceB = calculateVariance(getTimeValues(b));
				return varianceA - varianceB;
			});

		case "average-time":
			return sortedRoutes.sort((a, b) => {
				const avgA = calculateAverage(getTimeValues(a));
				const avgB = calculateAverage(getTimeValues(b));
				return avgA - avgB;
			});

		case "shortest-longest-flight":
			return sortedRoutes.sort((a, b) => {
				const maxA = Math.max(...getTimeValues(a), Infinity);
				const maxB = Math.max(...getTimeValues(b), Infinity);
				return maxA - maxB;
			});

		case "distance-difference":
			return sortedRoutes.sort((a, b) => {
				const varianceA = calculateVariance(getDistanceValues(a));
				const varianceB = calculateVariance(getDistanceValues(b));
				return varianceA - varianceB;
			});

		case "average-distance":
			return sortedRoutes.sort((a, b) => {
				const avgA = calculateAverage(getDistanceValues(a));
				const avgB = calculateAverage(getDistanceValues(b));
				return avgA - avgB;
			});

		case "airport-name":
			return sortedRoutes.sort((a, b) => {
				return a.destination_airport.name.localeCompare(
					b.destination_airport.name,
				);
			});

		default:
			return sortedRoutes;
	}
}
