import type { FilterFieldConfig, FilterOption } from "~/components/ui/filters";
import type { Destination } from "../types";

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
	destination: Destination;
	travelFilterFieldsWithIcons?: FilterFieldConfig[];
}

export function DestinationCard({
	destination,
	travelFilterFieldsWithIcons,
}: DestinationCardProps) {
	const getAirlineNames = (airlineCodes: string[]) => {
		const airlines =
			travelFilterFieldsWithIcons?.find((f) => f.key === "airlines")?.options ||
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
						<CardTitle className="text-lg">{destination.city_name}</CardTitle>
						<CardDescription className="flex items-center gap-1">
							<MapPin className="size-3" />
							{destination.iata_code} • {destination.state_name}
						</CardDescription>
					</div>
					<Badge variant="primary" className="text-xs">
						Direct
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground mb-4">
					{destination.timezone}
				</p>

				<div className="space-y-3">
					{/* Flight Duration */}
					{/* <div className="flex items-center gap-2">
						<Clock className="size-4 text-muted-foreground" />
						<span className="text-sm">{destination.flightDuration} hours</span>
					</div> */}

					{/* Airlines */}
					{/* <div className="flex items-center gap-2">
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
					</div> */}
				</div>

				<Button className="w-full mt-4" variant="outline">
					View Details
				</Button>
			</CardContent>
		</Card>
	);
}
