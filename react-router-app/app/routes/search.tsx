import type { Filter } from "~/components/ui/filters";

import { useState } from "react";

import {
	MOCK_DESTINATIONS,
	TRAVEL_FILTER_FIELDS,
} from "~/lib/travel-filters";
import {
	MutualDestinationsList,
	OriginCitiesDisplay,
} from "~/features/airport-search";
import {
	DestinationCard,
	FilteredResults,
	SearchFilters,
	useDestinationFilters,
} from "~/features/destination-filters";

export function meta() {
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

	// Use the destination filters hook
	const filteredDestinations = useDestinationFilters(
		MOCK_DESTINATIONS,
		filters,
	);

	const clearFilters = () => {
		setFilters([]);
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

					<OriginCitiesDisplay
						originCity1={originCity1}
						originCity2={originCity2}
					/>
				</div>

				<SearchFilters
					filters={filters}
					fields={TRAVEL_FILTER_FIELDS}
					onFiltersChange={setFilters}
					onClearFilters={clearFilters}
				/>

				<MutualDestinationsList
					destinations={filteredDestinations}
					totalDestinations={MOCK_DESTINATIONS.length}
				/>

				<FilteredResults
					destinations={filteredDestinations}
					onClearFilters={clearFilters}
					renderDestinationCard={(destination) => (
						<DestinationCard
							key={destination.id}
							destination={destination}
							travelFilterFieldsWithIcons={TRAVEL_FILTER_FIELDS}
						/>
					)}
				/>
			</div>
		</div>
	);
}
