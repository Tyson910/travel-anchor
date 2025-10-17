import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useAirportSearchQuery } from "@/hooks/use-queries";
import * as Dialog from "./ui/dialog";

interface Airport {
	iata_code: string;
	name: string;
	city_name: string | null;
	country_name: string | null;
}

interface AirportSearchProps {
	onSelect: (airport: Airport) => void;
	children?: React.ReactNode;
}

export function AirportSearch({ onSelect, children }: AirportSearchProps) {
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

	const { data, error, isLoading } = useAirportSearchQuery(debouncedSearchTerm);

	const airports = data?.airports ?? [];

	const handleSelect = (airport: Airport) => {
		onSelect(airport);
		setOpen(false);
		setSearchTerm("");
	};

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			{children || (
				<Button variant="outline" className="w-full justify-start">
					<Search className="mr-2 h-4 w-4" />
					Search for Airport
				</Button>
			)}

			<Dialog.DialogContent className="p-0">
				<Dialog.DialogHeader>
					<Dialog.DialogTitle>Search for an airport</Dialog.DialogTitle>
					<Dialog.DialogDescription>
						Type airport name, city, or IATA code
					</Dialog.DialogDescription>
				</Dialog.DialogHeader>

				<Command>
					<CommandInput
						placeholder="Search airports..."
						value={searchTerm}
						onValueChange={setSearchTerm}
					/>
					<CommandList>
						{isLoading && (
							<div className="p-4 text-center text-sm text-muted-foreground">
								Searching airports...
							</div>
						)}

						{error && (
							<div className="p-4 text-center text-sm text-destructive">
								Error searching airports. Please try again.
							</div>
						)}

						{!isLoading &&
							!error &&
							airports.length === 0 &&
							debouncedSearchTerm && (
								<CommandEmpty>No airports found.</CommandEmpty>
							)}

						{!isLoading && !error && airports.length > 0 && (
							<CommandGroup
								heading={
									debouncedSearchTerm
										? `Airports matching "${debouncedSearchTerm}"`
										: "Airports"
								}
							>
								{airports.map((airport) => (
									<CommandItem
										key={airport.iata_code}
										value={`${airport.iata_code} ${airport.name} ${
											airport.city_name || ""
										}`}
										onSelect={() => handleSelect(airport)}
									>
										<div className="flex items-center justify-between w-full">
											<div className="flex flex-col">
												<span className="font-medium">{airport.name}</span>
												<span className="text-sm text-muted-foreground">
													{airport.city_name && `${airport.city_name}, `}
													{airport.country_name}
												</span>
											</div>
											<span className="text-sm font-mono bg-primary/10 text-primary px-2 py-1 rounded">
												{airport.iata_code}
											</span>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</Dialog.DialogContent>
		</CommandDialog>
	);
}
