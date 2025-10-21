import { AlertCircleIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
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
				<Button variant="terminal" size="sm">
					ADD AIRPORT
				</Button>
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

function useDebounce(value: string, delay = 300) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	const isDebouncing = debouncedValue != value;

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return {
		debouncedValue,
		isDebouncing,
	};
}

function AirportCommandPalette({
	onAirportSelect,
}: {
	onAirportSelect: (
		airport: AirportSearchQueryResult["airports"][number],
	) => void;
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const { debouncedValue: debouncedSearchTerm, isDebouncing } =
		useDebounce(searchTerm);

	const { isLoading } = useAirportSearchQuery(debouncedSearchTerm);

	const handleAirportSelect = (
		airport: AirportSearchQueryResult["airports"][number],
	) => {
		onAirportSelect(airport);
		setSearchTerm("");
	};

	return (
		<Command shouldFilter={false}>
			<CommandInput
				value={searchTerm}
				onValueChange={setSearchTerm}
				className="grow w-full font-light text-xs tracking-tighter"
				isLoading={isLoading || isDebouncing}
			/>

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
	const { data, error } = useAirportSearchQuery(searchTerm);
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
							<div className="flex items-center justify-between w-full">
								<span className="font-sans font-normal">{airport.name}</span>
								<Badge variant="iata">{airport.iata_code}</Badge>
							</div>
						</CommandItem>
					);
				})}
			</CommandGroup>
		</CommandList>
	);
}
