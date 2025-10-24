import { ArrowRight, LoaderCircle } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { useAirportSearchParamsState } from "~/features/airport-search";
import { AirportSearchResults } from "~/features/airport-search/components/SearchBar";
import { useDebounce } from "~/features/airport-search/hooks/use-debounce";
import { useAirportSearchQuery } from "~/features/airport-search/hooks/use-search";
import {
	Combobox,
	ComboboxChip,
	ComboboxChipRemove,
	ComboboxChips,
	ComboboxContent,
	ComboboxInput,
	ComboboxValue,
} from "../ui/base-combobox";

export function AirportComboboxSelector() {
	const navigate = useNavigate();
	const id = useId();

	const { iataCodes } = useAirportSearchParamsState();

	const handleSearch = () => {
		const params = new URLSearchParams();

		[...new Set(iataCodes)].forEach((iata) => {
			const sanitizedIATA = iata.trim().toUpperCase();
			params.append("codes", sanitizedIATA);
		});

		navigate({
			pathname: "/search",
			search: params.toString(),
		});
	};

	return (
		<main className="flex items-center justify-center px-4 py-20">
			<div className="w-full max-w-2xl space-y-8">
				<div className="text-center space-y-6">
					<h1 className="text-2xl font-light tracking-tight">
						Select airports to find mutual destinations
					</h1>

					<div className="space-y-4">
						<label
							htmlFor={id}
							className="text-sm text-muted-foreground sr-only"
						>
							Select airports to search from:
						</label>
						<div className="mt-4">
							<AirportSearchCombobox id={id} />
						</div>

						<p className="text-sm text-muted-foreground">
							{iataCodes.length === 0
								? "Select at least 2 airports to find mutual destinations"
								: `Find destinations that all airports can reach directly`}
						</p>
					</div>
				</div>

				<div className="text-center">
					<Button
						size="lg"
						onClick={handleSearch}
						disabled={iataCodes.length < 2}
						className="w-full sm:w-auto"
					>
						Find Routes
						<ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				</div>
			</div>
		</main>
	);
}

function AirportSearchCombobox({ id }: { id?: string }) {
	const containerRef = useRef<HTMLDivElement | null>(null);

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
			<div className="w-full flex flex-col gap-3">
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
				<AirportSearchResults searchTerm={debouncedSearchTerm} />
			</ComboboxContent>
		</Combobox>
	);
}
