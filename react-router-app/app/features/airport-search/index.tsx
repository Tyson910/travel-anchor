import type { loader as SearchPageLoader } from "~/routes/search";

import { MapPin, X } from "lucide-react";
import { useLoaderData } from "react-router";

import { Badge, BadgeButton } from "~/components/ui/badge";
import { FilteredResults } from "../destination-filters";
import { AirportSearch } from "./components/SearchPopup";
import { useAirportSearchParamsState } from "./hooks/use-airport-search-params";

export { useAirportSearchParamsState } from "./hooks/use-airport-search-params";

export function MutualDestinationsList() {
	const { routes } = useLoaderData<typeof SearchPageLoader>();

	const destinations = routes.map(
		({ destination_airport }) => destination_airport,
	);

	return <FilteredResults destinations={destinations} />;
}

export function OriginCitiesDisplay() {
	const { iataCodes, removeAirport } = useAirportSearchParamsState();
	return (
		<div className="flex flex-wrap gap-4 mb-6">
			<div className="flex items-center gap-2">
				<MapPin className="size-4 text-muted-foreground" />
				<span className="font-medium">From:</span>
				{iataCodes.map((code) => {
					return (
						<Badge key={code} variant="secondary" appearance="outline">
							{code}
							<BadgeButton
								onClick={() => {
									removeAirport(code);
								}}
							>
								<X />
							</BadgeButton>
						</Badge>
					);
				})}
			</div>
			<AirportSearch />
		</div>
	);
}
