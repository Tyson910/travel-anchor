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

export function WeatherCard({
	latitude,
	longitude,
}: {
	latitude: number;
	longitude: number;
}) {
	const {
		observation,
		isLoadingInitial,
		isLoadingStations,
		isLoadingObservation,
		isError,
		error,
	} = useWeatherConditions({ latitude, longitude });

	if (isError) {
		return (
			<WeatherCardSkeleton title="Weather Unavailable">
				{error?.message ?? "Failed to load weather data"}
			</WeatherCardSkeleton>
		);
	}

	if (!observation && isLoadingInitial) {
		return (
			<WeatherCardSkeleton>
				{isLoadingStations
					? "Finding nearby weather stations..."
					: isLoadingObservation
						? "Loading current conditions..."
						: "Real-time weather conditions and forecasts for this airport."}
			</WeatherCardSkeleton>
		);
	}

	if (observation) {
		return (
			<WeatherCardSkeleton>
				{observation?.properties?.textDescription ?? "Loading..."}
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
