import { useQuery } from "@tanstack/react-query";

import { forecastValidator } from "@/features/weather/weather.validators";
import { weatherClient } from "@/features/weather/weather-client";

export function useWeatherForecast({
	wfo,
	x,
	y,
}: {
	wfo: string;
	x: number;
	y: number;
}) {
	const forecastQuery = useQuery({
		queryKey: ["weather-forecast", wfo, x, y],
		queryFn: async () => {
			if (!wfo || !x || !y) {
				throw new Error("Missing grid coordinates (wfo, x, y)");
			}

			const { error, data } = await weatherClient.GET(
				"/gridpoints/{wfo}/{x},{y}/forecast/hourly",
				{
					params: {
						path: {
							wfo,
							x,
							y,
						},
					},
				},
			);

			if (error) {
				throw new Error(error.title);
			}

			if (!data) {
				throw new Error("No forecast data returned");
			}

			return forecastValidator.parse(data);
		},
		enabled: !!(wfo && x && y),
		refetchIntervalInBackground: true,
		refetchInterval: 1000 * 60 * 5,
	});

	return {
		forecast: forecastQuery.data,
		isLoading: forecastQuery.isLoading || forecastQuery.isFetching,
		isError: forecastQuery.isError,
		error: forecastQuery.error,
	};
}
