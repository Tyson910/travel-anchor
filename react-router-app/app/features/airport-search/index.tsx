import type { MockDestination } from "~/features/airport-search/travel-filters";

import { MapPin } from "lucide-react";

import { Badge } from "~/components/ui/badge";

interface MutualDestinationsListProps {
	destinations: MockDestination[];
	totalDestinations: number;
}

export { useAirportSearchParamsState } from "./hooks/use-airport-search-params";

export function MutualDestinationsList({
	destinations,
	totalDestinations,
}: MutualDestinationsListProps) {
	return (
		<div className="mb-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold">
					Destinations ({destinations.length})
				</h2>
				{destinations.length < totalDestinations && (
					<p className="text-sm text-muted-foreground">
						Filtered from {totalDestinations} total destinations
					</p>
				)}
			</div>
		</div>
	);
}

interface OriginCitiesDisplayProps {
	originCity1: string;
	originCity2: string;
}

export function OriginCitiesDisplay({
	originCity1,
	originCity2,
}: OriginCitiesDisplayProps) {
	return (
		<div className="flex flex-wrap gap-4 mb-6">
			<div className="flex items-center gap-2">
				<MapPin className="size-4 text-muted-foreground" />
				<span className="font-medium">From:</span>
				<Badge variant="secondary">{originCity1}</Badge>
				<span className="text-muted-foreground">and</span>
				<Badge variant="secondary">{originCity2}</Badge>
			</div>
		</div>
	);
}
