import type { ReactNode } from "react";

import { CloudSun } from "lucide-react";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "~/components/ui/empty";
import { useWeatherConditions } from "~/features/weather/hooks/use-weather-conditions";

export function WeatherCard({ stationId }: { stationId: string }) {
	const { observation, isLoading, isError, error } = useWeatherConditions({
		stationId,
	});

	if (isError) {
		return (
			<WeatherCardSkeleton title="Weather Unavailable">
				{error?.message ?? "Failed to load weather data"}
			</WeatherCardSkeleton>
		);
	}

	if (!stationId) {
		return (
			<WeatherCardSkeleton title="Weather Unavailable">
				Unable to locate nearby weather station
			</WeatherCardSkeleton>
		);
	}

	if (isLoading) {
		return (
			<WeatherCardSkeleton>Loading current conditions...</WeatherCardSkeleton>
		);
	}

	if (observation) {
		return (
			<WeatherCardSkeleton>
				{observation?.properties?.textDescription ?? "No description available"}
			</WeatherCardSkeleton>
		);
	}

	return (
		<WeatherCardSkeleton>
			Real-time weather conditions and forecasts for this airport.
		</WeatherCardSkeleton>
	);
}

function WeatherCardSkeleton({
	icon = "sun",
	title = "Weather",
	children,
}: React.PropsWithChildren<{ icon?: "sun" | "cloud"; title?: ReactNode }>) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<CloudSun />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{children}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
