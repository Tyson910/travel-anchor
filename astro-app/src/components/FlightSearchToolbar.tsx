import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFlightRoutesQuery } from "@/hooks/use-queries";

export function FlightSearchToolbar() {
	const [iataCode, setIataCode] = useState("");
	const [searchCode, setSearchCode] = useState("");
	const [hasSearched, setHasSearched] = useState(false);

	const { data, error, isLoading } = useFlightRoutesQuery(searchCode);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
		setIataCode(value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (iataCode.length === 3) {
			setSearchCode(iataCode);
			setHasSearched(true);
		}
	};

	const handleClear = () => {
		setIataCode("");
		setSearchCode("");
		setHasSearched(false);
	};

	const isValidIata = iataCode.length === 3;

	return (
		<div className="w-full max-w-4xl mx-auto p-6 space-y-6">
			{/* Search Form */}
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="flex gap-2">
					<div className="flex-1">
						<Input
							type="text"
							placeholder="Enter airport code (e.g., JFK)"
							value={iataCode}
							onChange={handleInputChange}
							maxLength={3}
							className="text-center text-lg font-mono uppercase"
						/>
						{!isValidIata && iataCode.length > 0 && (
							<p className="text-sm text-destructive mt-1">
								Airport code must be exactly 3 letters
							</p>
						)}
					</div>
					<Button
						type="submit"
						disabled={!isValidIata || isLoading}
						className="px-6"
					>
						{isLoading ? "Searching..." : "Search Routes"}
					</Button>
					{hasSearched && (
						<Button type="button" variant="outline" onClick={handleClear}>
							Clear
						</Button>
					)}
				</div>
			</form>

			{/* Loading State */}
			{isLoading && (
				<div className="space-y-4">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			)}

			{/* Error State */}
			{error && (
				<div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md">
					<h3 className="font-semibold text-destructive">Error</h3>
					<p className="text-sm text-destructive/80">
						{error instanceof Error
							? error.message
							: "Failed to fetch flight routes. Please try again."}
					</p>
				</div>
			)}

			{/* No Results */}
			{hasSearched &&
				!isLoading &&
				!error &&
				(!data?.routes || data.routes.length === 0) && (
					<div className="p-4 border border-muted bg-muted/50 rounded-md text-center">
						<p className="text-muted-foreground">
							No flight routes found for airport code "{searchCode}"
						</p>
					</div>
				)}

			{/* Results */}
			{!isLoading && !error && data?.routes && data.routes.length > 0 && (
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold">
						Flight Routes from {searchCode}
					</h2>
					<div className="space-y-4">
						{data.routes.map((route) => (
							<div
								key={`${route.destination_airport.iata_code}-${route.destination_airport.name}`}
								className="border rounded-lg p-4 space-y-4 bg-card"
							>
								{/* Destination Airport */}
								<div className="border-b pb-2">
									<h3 className="font-semibold text-lg">
										To: {route.destination_airport.iata_code} -{" "}
										{route.destination_airport.name}
									</h3>
									<p className="text-sm text-muted-foreground">
										{route.destination_airport.city_name},{" "}
										{route.destination_airport.country_name}
									</p>
								</div>

								{/* Origin Airport Options */}
								<div className="space-y-2">
									<h4 className="font-medium">Available from:</h4>
									<div className="grid gap-2">
										{route.origin_airport_options.map((origin) => (
											<div
												key={`${origin.iata_code}-${origin.route_id}`}
												className="border rounded p-3 bg-muted/30"
											>
												<div className="flex justify-between items-start">
													<div>
														<p className="font-medium">
															{origin.iata_code} - {origin.name}
														</p>
														<p className="text-sm text-muted-foreground">
															{origin.city_name}, {origin.country_name}
														</p>
													</div>
													<div className="text-right text-sm">
														{origin.distance_km && (
															<p>{origin.distance_km.toLocaleString()} km</p>
														)}
														{origin.duration_min && (
															<p>{origin.duration_min} min</p>
														)}
													</div>
												</div>

												{/* Airline Options */}
												{origin.airline_options &&
													origin.airline_options.length > 0 && (
														<div className="mt-2 pt-2 border-t">
															<p className="text-xs font-medium text-muted-foreground mb-1">
																Airlines:
															</p>
															<div className="flex flex-wrap gap-1">
																{origin.airline_options.map((airline) => (
																	<span
																		key={airline.iata_code}
																		className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded"
																	>
																		{airline.iata_code} - {airline.name}
																	</span>
																))}
															</div>
														</div>
													)}
											</div>
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
