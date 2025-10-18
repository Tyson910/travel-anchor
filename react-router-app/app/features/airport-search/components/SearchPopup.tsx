import { AlertCircleIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import { useAirportSearchParamsState } from "../hooks/use-airport-search-params";
import {
	type AirportSearchQueryResult,
	useAirportSearchQuery,
} from "../hooks/use-search";

export function AirportSearch() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add Airport</Button>
			</DialogTrigger>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle className="text-center">Search Airports</DialogTitle>
				</DialogHeader>
				<AirportCommandPalette onAirportSelect={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

function AirportCommandPalette({
	onAirportSelect,
}: {
	onAirportSelect: (
		airport: AirportSearchQueryResult["airports"][number],
	) => void;
}) {
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
		setSearchTerm("");
	};

	return (
		<Command shouldFilter={false}>
			<CommandInput value={searchTerm} onValueChange={setSearchTerm} />
			<div className="h-[300px]">
				<SearchResults
					searchTerm={debouncedSearchTerm}
					onAirportSelect={handleAirportSelect}
				/>
			</div>
		</Command>
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
	const { addAirport } = useAirportSearchParamsState();

	if (error) {
		return (
			<Alert variant="destructive" appearance="light" className="mt-5">
				<AlertIcon>
					<AlertCircleIcon />
				</AlertIcon>

				<AlertContent>
					<AlertTitle>Unable to process your search</AlertTitle>
					<AlertDescription>
						<p>{error.message}</p>
					</AlertDescription>
				</AlertContent>
			</Alert>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col py-3 gap-y-3">
				{Array.from({ length: 5 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: dont need one
					<Skeleton key={i} className="h-10" />
				))}
			</div>
		);
	}

	const airports = data?.airports ?? [];

	if (!searchTerm && airports.length == 0) {
		return null;
	}

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
							onSelect={async () => {
								onAirportSelect(airport);
								addAirport(airport.iata_code);
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
