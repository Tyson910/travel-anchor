import type { MockDestination } from "~/features/airport-search/travel-filters";

import { Plane } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

interface FilteredResultsProps {
	destinations: MockDestination[];
	onClearFilters: () => void;
	renderDestinationCard: (destination: MockDestination) => React.ReactNode;
}

export function FilteredResults({
	destinations,
	onClearFilters,
	renderDestinationCard,
}: FilteredResultsProps) {
	if (destinations.length === 0) {
		return (
			<Card>
				<CardContent className="py-12 text-center">
					<Plane className="size-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-medium mb-2">No destinations found</h3>
					<p className="text-muted-foreground mb-4">
						Try adjusting your filters to see more results
					</p>
					<Button variant="outline" onClick={onClearFilters}>
						Clear Filters
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{destinations.map((destination) => renderDestinationCard(destination))}
		</div>
	);
}
