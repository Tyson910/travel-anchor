import { useQuery } from "@tanstack/react-query";

import { observationResponseSchema } from "@/features/weather/weather.validators";
import { weatherClient } from "@/features/weather/weather-client";

export function useWeatherConditions({ stationId }: { stationId: string }) {
	const observationQuery = useQuery({
		queryKey: ["weather-observation", stationId],
		queryFn: async () => {
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
		enabled: !!stationId,
		refetchIntervalInBackground: true,
		refetchInterval: 1000 * 60,
	});

	return {
		observation: observationQuery.data,
		isLoading: observationQuery.isLoading || observationQuery.isFetching,
		isError: observationQuery.isError,
		error: observationQuery.error,
	};
}
