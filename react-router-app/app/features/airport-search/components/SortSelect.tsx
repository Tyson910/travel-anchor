import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { useAirportSearchParamsState } from "../hooks/use-airport-search-params";
import { SORT_OPTIONS, type SortOption } from "../sorting-utils";

export function SortSelect() {
	const { activeSort, setSort } = useAirportSearchParamsState();

	return (
		<div className="flex flex-col gap-y-3 w-64">
			<Label>Sort By:</Label>
			<Select
				value={activeSort}
				onValueChange={(value: SortOption) => setSort(value)}
			>
				<SelectTrigger size="sm">
					<SelectValue>{SORT_OPTIONS[activeSort].label}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					{Object.entries(SORT_OPTIONS).map(([value, config]) => (
						<SelectItem key={value} value={value}>
							<div className="flex flex-col">
								<span className="font-medium">{config.label}</span>
								<span className="text-xs text-muted-foreground">
									{config.description}
								</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
