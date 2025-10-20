import { MapPin, X } from "lucide-react";

import { Badge, BadgeButton } from "~/components/ui/badge";
import { AirportSearch } from "./components/SearchPopup";
import { useAirportSearchParamsState } from "./hooks/use-airport-search-params";

export { DestinationListView } from "./components/DestinationListView";
export { ViewToggle } from "./components/ViewToggle";
export {
	getIATACodesFromSearchParams,
	useAirportSearchParamsState,
} from "./hooks/use-airport-search-params";

export function OriginCitiesFilter() {
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
