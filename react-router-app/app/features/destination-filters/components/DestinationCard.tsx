import type { FilterFieldConfig, FilterOption } from "~/components/ui/filters";
import type { MockDestination } from "~/lib/travel-filters";

import { Clock, DollarSign, MapPin, Plane, Users } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

interface DestinationCardProps {
	destination: MockDestination;
	travelFilterFieldsWithIcons: FilterFieldConfig[];
}

export function DestinationCard({
	destination,
	travelFilterFieldsWithIcons,
}: DestinationCardProps) {
	const getAirlineNames = (airlineCodes: string[]) => {
		const airlines =
			travelFilterFieldsWithIcons.find((f) => f.key === "airlines")?.options ||
			[];
		return airlineCodes.map((code) => {
			const airline = airlines.find(
				(opt) => (opt as FilterOption<string>).value === code,
			);
			return (airline as FilterOption<string>)?.label || code;
		});
	};

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div>
						<CardTitle className="text-lg">{destination.city}</CardTitle>
						<CardDescription className="flex items-center gap-1">
							<MapPin className="size-3" />
							{destination.airportCode} • {destination.state}
						</CardDescription>
					</div>
					{destination.directFlights && (
						<Badge variant="default" className="text-xs">
							Direct
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground mb-4">
					{destination.description}
				</p>

				<div className="space-y-3">
					{/* Price Range */}
					<div className="flex items-center gap-2">
						<DollarSign className="size-4 text-muted-foreground" />
						<span className="text-sm">
							${destination.priceRange.min} - ${destination.priceRange.max}
						</span>
					</div>

					{/* Flight Duration */}
					<div className="flex items-center gap-2">
						<Clock className="size-4 text-muted-foreground" />
						<span className="text-sm">{destination.flightDuration} hours</span>
					</div>

					{/* Airlines */}
					<div className="flex items-center gap-2">
						<Plane className="size-4 text-muted-foreground" />
						<div className="flex flex-wrap gap-1">
							{getAirlineNames(destination.airlines)
								.slice(0, 3)
								.map((airline) => (
									<Badge key={airline} variant="outline" className="text-xs">
										{airline.split(" ")[0]}
									</Badge>
								))}
							{destination.airlines.length > 3 && (
								<Badge variant="outline" className="text-xs">
									+{destination.airlines.length - 3}
								</Badge>
							)}
						</div>
					</div>

					{/* Flight Frequency */}
					<div className="flex items-center gap-2">
						<Users className="size-4 text-muted-foreground" />
						<span className="text-sm capitalize">
							{destination.flightFrequency}
						</span>
					</div>
				</div>

				<Button className="w-full mt-4" variant="outline">
					View Details
				</Button>
			</CardContent>
		</Card>
	);
}
