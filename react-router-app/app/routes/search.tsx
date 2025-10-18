import {
	MutualDestinationsList,
	OriginCitiesDisplay,
} from "~/features/airport-search";
import { MOCK_DESTINATIONS } from "~/lib/travel-filters";

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

				<MutualDestinationsList
					destinations={MOCK_DESTINATIONS}
					totalDestinations={MOCK_DESTINATIONS.length}
				/>
			</div>
		</div>
	);
}
