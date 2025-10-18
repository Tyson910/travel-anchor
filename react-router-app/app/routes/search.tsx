import type { Filter } from "~/components/ui/filters";

import { useState } from "react";

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
import { MOCK_DESTINATIONS, TRAVEL_FILTER_FIELDS } from "~/lib/travel-filters";

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

					<OriginCitiesDisplay />
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
