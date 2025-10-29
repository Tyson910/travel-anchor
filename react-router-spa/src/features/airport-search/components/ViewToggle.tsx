import { List, Map as MapIcon } from "lucide-react";

import { Button } from "#components/ui/button.tsx";
import { useAirportSearchParamsState } from "../hooks/use-airport-search-params";

export function ViewToggle() {
	const { activeView, setView } = useAirportSearchParamsState();
	return (
		<div className="inline-flex rounded-lg border border-input bg-background p-1">
			<Button
				variant={activeView === "grid" ? "primary" : "ghost"}
				size="sm"
				selected={activeView === "grid"}
				onClick={() => setView("grid")}
				className="gap-2"
			>
				<List className="size-4" />
				<span>List</span>
			</Button>
			<Button
				variant={activeView === "map" ? "primary" : "ghost"}
				size="sm"
				selected={activeView === "map"}
				onClick={() => setView("map")}
				className="gap-2"
			>
				<MapIcon className="size-4" />
				<span>Map</span>
			</Button>
		</div>
	);
}
