import { useQuery } from "@tanstack/react-query";

import {
	observationResponseSchema,
	pointsResponseSchema,
	stationsResponseSchema,
} from "@/features/weather/weather.validators";
import { weatherClient } from "@/features/weather/weather-client";

export function useWeatherConditions({
	latitude,
	longitude,
}: {
	latitude: number;
	longitude: number;
}) {
	const pointQuery = useQuery({
		queryKey: ["weather-point", latitude, longitude],
		queryFn: async () => {
			const { error, data } = await weatherClient.GET(
				"/points/{latitude},{longitude}",
				{
					params: {
						path: {
							latitude,
							longitude,
						},
					},
				},
			);

			if (error) {
				throw new Error(error.title);
			}

			if (!data) {
				throw new Error("No data returned from point endpoint");
			}

			return pointsResponseSchema.parse(data);
		},
		staleTime: 1000 * 60 * 60,
	});

	const stationsQuery = useQuery({
		queryKey: ["weather-stations", latitude, longitude],
		queryFn: async () => {
			const pointData = pointQuery.data;

			if (
				!pointData?.properties?.gridId ||
				!pointData?.properties?.gridX ||
				!pointData?.properties?.gridY
			) {
				throw new Error("Invalid point data: missing grid coordinates");
			}

			const { error, data } = await weatherClient.GET(
				"/gridpoints/{wfo}/{x},{y}/stations",
				{
					params: {
						path: {
							wfo: pointData.properties.gridId,
							x: pointData.properties.gridX,
							y: pointData.properties.gridY,
						},
					},
				},
			);

			if (error) {
				throw new Error(error.title);
			}

			const stationsData = stationsResponseSchema.parse(data);
			const features = stationsData?.features ?? [];

			// The spec implies logic to "Pick first station (closest)"
			// The NWS API typically orders stations by proximity for spatial queries,
			// so the first element is usually the closest.

			const firstFeature = features[0];

			if (!firstFeature?.properties?.stationIdentifier) {
				throw new Error("No observation stations available");
			}

			return firstFeature.properties.stationIdentifier;
		},
		enabled: pointQuery.data !== undefined,
		staleTime: 1000 * 60 * 60,
	});

	const observationQuery = useQuery({
		queryKey: ["weather-observation", stationsQuery.data],
		queryFn: async () => {
			const stationId = stationsQuery.data;

			if (!stationId) {
				throw new Error("No station ID available");
			}

			const { error, data } = await weatherClient.GET(
				"/stations/{stationId}/observations/latest",
				{
					params: {
						path: {
							stationId,
						},
					},
				},
			);

			if (error) {
				throw new Error(error.title);
			}

			if (!data) {
				throw new Error("No observation data returned");
			}

			return observationResponseSchema.parse(data);
		},
		enabled: stationsQuery.data !== undefined,
		refetchIntervalInBackground: true,
		refetchInterval: 1000 * 60,
	});

	const isLoading =
		pointQuery.isLoading ||
		stationsQuery.isLoading ||
		observationQuery.isLoading;

	const isLoadingInitial = pointQuery.isLoading || pointQuery.isFetching;

	const isLoadingStations = stationsQuery.isLoading || stationsQuery.isFetching;

	const isLoadingObservation =
		observationQuery.isLoading || observationQuery.isFetching;

	const isError =
		pointQuery.isError || stationsQuery.isError || observationQuery.isError;

	const error =
		pointQuery.error ?? stationsQuery.error ?? observationQuery.error;

	return {
		observation: observationQuery.data,
		pointData: pointQuery.data,
		stationId: stationsQuery.data,
		isLoadingInitial,
		isLoadingStations,
		isLoadingObservation,
		isLoading,
		isError,
		error,
		refetch: () => {
			pointQuery.refetch();
			stationsQuery.refetch();
			observationQuery.refetch();
		},
	};
}
