import type { Route } from "./+types/search";

import {
	Building2,
	Clock,
	DollarSign,
	Filter as FilterIcon,
	MapPin,
	Plane,
	Users,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { type Filter, Filters } from "~/components/ui/filters";
import {
	MOCK_DESTINATIONS,
	type MockDestination,
	TRAVEL_FILTER_FIELDS,
} from "~/airport-search/travel-filters";

// Add icons to filter fields
const travelFilterFieldsWithIcons = TRAVEL_FILTER_FIELDS.map((field) => {
	switch (field.key) {
		case "airlines":
			return { ...field, icon: <Plane className="size-4" /> };
		case "alliances":
			return { ...field, icon: <Building2 className="size-4" /> };
		case "regions":
			return { ...field, icon: <MapPin className="size-4" /> };
		case "airport_size":
			return { ...field, icon: <Building2 className="size-4" /> };
		case "flight_frequency":
			return { ...field, icon: <Clock className="size-4" /> };
		case "price_range":
			return { ...field, icon: <DollarSign className="size-4" /> };
		case "flight_duration":
			return { ...field, icon: <Clock className="size-4" /> };
		case "direct_only":
			return { ...field, icon: <Plane className="size-4" /> };
		case "departure_time":
		case "departure_time_range":
			return { ...field, icon: <Clock className="size-4" /> };
		default:
			return field;
	}
});

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Mutual Flight Destinations - Travel Anchor" },
		{
			name: "description",
			content: "Find mutual direct-flight destinations for your group travel",
		},
	];
}

export default function SearchPage() {
	const [filters, setFilters] = useState<Filter[]>([]);
	const [originCity1, _setOriginCity1] = useState("New York");
	const [originCity2, _setOriginCity2] = useState("Los Angeles");

	// Filter destinations based on applied filters
	const filteredDestinations = useMemo(() => {
		return MOCK_DESTINATIONS.filter((destination) => {
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
	}, [filters]);

	const clearFilters = useCallback(() => {
		setFilters([]);
	}, []);

	const _getAirlineNames = (airlineCodes: string[]) => {
		return airlineCodes.map((code) => {
			const airline = TRAVEL_FILTER_FIELDS.find(
				(f) => f.key === "airlines",
			)?.options?.find((opt) => opt.value === code);
			return airline?.label || code;
		});
	};

	const _getAllianceName = (allianceCode: string) => {
		const alliance = TRAVEL_FILTER_FIELDS.find(
			(f) => f.key === "alliances",
		)?.options?.find((opt) => opt.value === allianceCode);
		return alliance?.label || allianceCode;
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Mutual Flight Destinations
					</h1>
					<p className="text-muted-foreground mb-6">
						Find direct-flight destinations that work for both {originCity1} and{" "}
						{originCity2}
					</p>

					{/* Origin Cities */}
					<div className="flex flex-wrap gap-4 mb-6">
						<div className="flex items-center gap-2">
							<MapPin className="size-4 text-muted-foreground" />
							<span className="font-medium">From:</span>
							<Badge variant="secondary">{originCity1}</Badge>
							<span className="text-muted-foreground">and</span>
							<Badge variant="secondary">{originCity2}</Badge>
						</div>
					</div>
				</div>

				{/* Filters Section */}
				<Card className="mb-8">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<FilterIcon className="size-4" />
								<CardTitle>Filters</CardTitle>
								{filters.length > 0 && (
									<Badge variant="secondary">{filters.length} active</Badge>
								)}
							</div>
							{filters.length > 0 && (
								<Button variant="outline" size="sm" onClick={clearFilters}>
									Clear All
								</Button>
							)}
						</div>
						<CardDescription>
							Filter destinations by airlines, price, duration, and more
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Filters
							filters={filters}
							fields={travelFilterFieldsWithIcons}
							onChange={setFilters}
							variant="outline"
							size="md"
							className="mb-4"
						/>
					</CardContent>
				</Card>

				{/* Results Section */}
				<div className="mb-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-semibold">
							Destinations ({filteredDestinations.length})
						</h2>
						{filters.length > 0 && (
							<p className="text-sm text-muted-foreground">
								Filtered from {MOCK_DESTINATIONS.length} total destinations
							</p>
						)}
					</div>

					{filteredDestinations.length === 0 ? (
						<Card>
							<CardContent className="py-12 text-center">
								<Plane className="size-12 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-lg font-medium mb-2">
									No destinations found
								</h3>
								<p className="text-muted-foreground mb-4">
									Try adjusting your filters to see more results
								</p>
								<Button variant="outline" onClick={clearFilters}>
									Clear Filters
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredDestinations.map((destination) => (
								<DestinationCard
									key={destination.id}
									destination={destination}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function DestinationCard({ destination }: { destination: MockDestination }) {
	const getAirlineNames = (airlineCodes: string[]) => {
		const airlines =
			travelFilterFieldsWithIcons.find((f) => f.key === "airlines")?.options ||
			[];
		return airlineCodes.map((code) => {
			const airline = airlines.find((opt) => opt.value === code);
			return airline?.label || code;
		});
	};

	const _getAllianceName = (allianceCode: string) => {
		const alliances =
			travelFilterFieldsWithIcons.find((f) => f.key === "alliances")?.options ||
			[];
		const alliance = alliances.find((opt) => opt.value === allianceCode);
		return alliance?.label || allianceCode;
	};

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div>
						<CardTitle className="text-lg">{destination.city}</CardTitle>
						<CardDescription className="flex items-center gap-1">
							<MapPin className="size-3" />
							{destination.airportCode} • {destination.state}
						</CardDescription>
					</div>
					{destination.directFlights && (
						<Badge variant="default" className="text-xs">
							Direct
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground mb-4">
					{destination.description}
				</p>

				<div className="space-y-3">
					{/* Price Range */}
					<div className="flex items-center gap-2">
						<DollarSign className="size-4 text-muted-foreground" />
						<span className="text-sm">
							${destination.priceRange.min} - ${destination.priceRange.max}
						</span>
					</div>

					{/* Flight Duration */}
					<div className="flex items-center gap-2">
						<Clock className="size-4 text-muted-foreground" />
						<span className="text-sm">{destination.flightDuration} hours</span>
					</div>

					{/* Airlines */}
					<div className="flex items-center gap-2">
						<Plane className="size-4 text-muted-foreground" />
						<div className="flex flex-wrap gap-1">
							{getAirlineNames(destination.airlines)
								.slice(0, 3)
								.map((airline) => (
									<Badge key={airline} variant="outline" className="text-xs">
										{airline.split(" ")[0]}
									</Badge>
								))}
							{destination.airlines.length > 3 && (
								<Badge variant="outline" className="text-xs">
									+{destination.airlines.length - 3}
								</Badge>
							)}
						</div>
					</div>

					{/* Flight Frequency */}
					<div className="flex items-center gap-2">
						<Users className="size-4 text-muted-foreground" />
						<span className="text-sm capitalize">
							{destination.flightFrequency}
						</span>
					</div>
				</div>

				<Button className="w-full mt-4" variant="outline">
					View Details
				</Button>
			</CardContent>
		</Card>
	);
}
