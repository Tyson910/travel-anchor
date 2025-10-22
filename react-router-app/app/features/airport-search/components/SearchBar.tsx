import { AlertCircleIcon, LoaderCircle, SearchIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import {
	Combobox,
	ComboboxChip,
	ComboboxChipRemove,
	ComboboxChips,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxItemIndicator,
	ComboboxList,
	ComboboxValue,
} from "~/components/ui/base-combobox";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "~/components/ui/empty";
import { Label } from "~/components/ui/label";
import { useAirportSearchParamsState } from "../hooks/use-airport-search-params";
import { useAirportSearchQuery } from "../hooks/use-search";

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

export function AirportSearchCombobox() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const id = useId();

	const { iataCodes, addListOfAirports } = useAirportSearchParamsState();

	const [searchTerm, setSearchTerm] = useState("");
	const { debouncedValue: debouncedSearchTerm, isDebouncing } =
		useDebounce(searchTerm);

	const { data, isLoading } = useAirportSearchQuery(debouncedSearchTerm);

	const airports = data?.airports ?? [];

	return (
		<Combobox
			filter={null}
			inputValue={searchTerm}
			onInputValueChange={setSearchTerm}
			items={airports}
			value={iataCodes}
			onValueChange={async (value) => {
				addListOfAirports(value as string[]);
			}}
			multiple
		>
			<div className="w-128 flex flex-row items-center gap-3">
				<Label htmlFor={id}>Airports: </Label>

				<ComboboxChips ref={containerRef}>
					<ComboboxValue>
						{iataCodes.map((iataCode) => (
							<ComboboxChip key={iataCode} aria-label={iataCode}>
								{iataCode}
								<ComboboxChipRemove />
							</ComboboxChip>
						))}
						<ComboboxInput id={id} />
					</ComboboxValue>
					{isLoading || isDebouncing ? (
						<LoaderCircle className="size-4 shrink-0 opacity-50 animate-spin" />
					) : null}
				</ComboboxChips>
			</div>

			<ComboboxContent anchor={containerRef}>
				<SearchResults searchTerm={debouncedSearchTerm} />
			</ComboboxContent>
		</Combobox>
	);
}

function SearchResults({ searchTerm }: { searchTerm: string }) {
	const { data, error } = useAirportSearchQuery(searchTerm);

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
		<ComboboxList>
			<ComboboxEmpty>
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
			</ComboboxEmpty>

			{airports.map((airport) => {
				return (
					<ComboboxItem key={airport.iata_code} value={airport.iata_code}>
						<ComboboxItemIndicator />
						<div className="flex items-center justify-between w-full">
							<span className="font-sans font-normal">{airport.name}</span>
							<Badge variant="iata">{airport.iata_code}</Badge>
						</div>
					</ComboboxItem>
				);
			})}
		</ComboboxList>
	);
}
