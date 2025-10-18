import { Filter as FilterIcon } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	type Filter,
	type FilterFieldConfig,
	Filters,
} from "~/components/ui/filters";

interface SearchFiltersProps {
	filters: Filter[];
	fields: FilterFieldConfig[];
	onFiltersChange: (filters: Filter[]) => void;
	onClearFilters: () => void;
}

export function SearchFilters({
	filters,
	fields,
	onFiltersChange,
	onClearFilters,
}: SearchFiltersProps) {
	return (
		<Card className="mb-8">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<FilterIcon className="size-4" />
						<CardTitle>Filters</CardTitle>
						{filters.length > 0 && (
							<Badge variant="secondary">{filters.length} active</Badge>
						)}
					</div>
					{filters.length > 0 && (
						<Button variant="outline" size="sm" onClick={onClearFilters}>
							Clear All
						</Button>
					)}
				</div>
				<CardDescription>
					Filter destinations by airlines, price, duration, and more
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Filters
					filters={filters}
					fields={fields}
					onChange={onFiltersChange}
					variant="outline"
					size="md"
					className="mb-4"
				/>
			</CardContent>
		</Card>
	);
}
