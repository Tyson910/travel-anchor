import { AlertCircleIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import {
	type AirportSearchQueryResult,
	useAirportSearchQuery,
} from "../hooks/use-search";

export function AirportSearch({
	onAirportSelect,
}: {
	onAirportSelect: (
		airport: AirportSearchQueryResult["airports"][number],
	) => void;
}) {
	const [open, setOpen] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	// Debounce search term
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 200);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	const handleAirportSelect = (
		airport: AirportSearchQueryResult["airports"][number],
	) => {
		onAirportSelect(airport);
		setOpen(false);
		setSearchTerm("");
	};

	return (
		<>
			<Button onClick={() => setOpen(true)}>Add</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder="Type a command or search..."
					value={searchTerm}
					onValueChange={setSearchTerm}
				/>
				<div className="h-[300px]">
					<SearchResults
						searchTerm={debouncedSearchTerm}
						onAirportSelect={handleAirportSelect}
					/>
				</div>
			</CommandDialog>
		</>
	);
}

function SearchResults({
	searchTerm,
	onAirportSelect,
}: {
	searchTerm: string;
	onAirportSelect: (
		airport: AirportSearchQueryResult["airports"][number],
	) => void;
}) {
	const { data, error, isLoading } = useAirportSearchQuery(searchTerm);

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircleIcon />
				<AlertTitle>Unable to process your search</AlertTitle>
				<AlertDescription>
					<p>{error.message}</p>
				</AlertDescription>
			</Alert>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col py-3 gap-y-3">
				{Array.from({ length: 5 }).map(() => (
					<Skeleton className="h-10" />
				))}
			</div>
		);
	}

	const airports = data?.airports ?? [];

	return (
		<CommandList>
			<CommandEmpty>
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SearchIcon />
						</EmptyMedia>
						<EmptyTitle>No airports found</EmptyTitle>
						<EmptyDescription>
							Try adjusting your search terms or browse all airports
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</CommandEmpty>

			<CommandGroup>
				{airports.map((airport) => {
					return (
						<CommandItem
							key={airport.iata_code}
							value={airport.iata_code}
							onSelect={() => {
								onAirportSelect(airport);
							}}
						>
							<span>{airport.name}</span>
						</CommandItem>
					);
				})}
			</CommandGroup>
		</CommandList>
	);
}
