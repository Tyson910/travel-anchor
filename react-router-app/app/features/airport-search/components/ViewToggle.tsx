import { List, Map as MapIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { useAirportSearchParamsState } from "../hooks/use-airport-search-params";

export function ViewToggle() {
	const { activeView, setView } = useAirportSearchParamsState();
	return (
		<div className="inline-flex rounded-lg border border-input bg-background p-1">
			<Button
				variant={activeView === "grid" ? "primary" : "ghost"}
				size="sm"
				mode="icon"
				onClick={() => setView("grid")}
				className="size-8"
			>
				<List className="size-4" />
			</Button>
			<Button
				variant={activeView === "map" ? "primary" : "ghost"}
				size="sm"
				mode="icon"
				onClick={() => setView("map")}
				className="size-8"
			>
				<MapIcon className="size-4" />
			</Button>
		</div>
	);
}
