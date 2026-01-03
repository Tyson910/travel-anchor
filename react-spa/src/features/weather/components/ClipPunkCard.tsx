import {
	ArrowUpRight,
	Clock,
	Cloud,
	CloudLightning,
	CloudRain,
	CloudSnow,
	Droplets,
	Eye,
	type LucideIcon,
	MapPin,
	Sun,
	Wind,
} from "lucide-react";

import { Skeleton } from "~/components/ui/skeleton";
import { useWeatherConditions } from "~/features/weather/hooks/use-weather-conditions";

// --- Type Definitions ---

interface ForecastItem {
	time: string;
	temp: number;
	icon: string;
}

// --- Static Data ---

const STATIC_FORECAST: ForecastItem[] = [
	{ time: "14:00", temp: 65, icon: "sun" },
	{ time: "15:00", temp: 64, icon: "cloud" },
	{ time: "16:00", temp: 62, icon: "cloud" },
	{ time: "17:00", temp: 59, icon: "rain" },
];

// --- Utility Functions ---

function celsiusToFahrenheit(celsius: number | null): number {
	if (celsius === null) return 0;
	return Math.round((celsius * 9) / 5 + 32);
}

function formatWindDirection(degrees: number | null): string {
	if (degrees === null) return "--";
	const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
	const index = Math.round(degrees / 45) % 8;
	return directions[index];
}

function metersToMiles(meters: number | null): string {
	if (meters === null) return "--";
	const miles = meters / 1609.34;
	return miles >= 10 ? "10+" : miles.toFixed(1);
}

function calculateDewPoint(
	tempC: number | null,
	humidity: number | null,
): number {
	if (tempC === null || humidity === null || humidity === 0) return 0;
	const a = 17.27;
	const b = 237.7;
	const alpha = (a * tempC) / (b + tempC) + Math.log(humidity / 100);
	const dewPointC = (b * alpha) / (a - alpha);
	return celsiusToFahrenheit(dewPointC);
}

function formatCoordinates(latitude: number, longitude: number): string {
	const latDir = latitude >= 0 ? "N" : "S";
	const lonDir = longitude >= 0 ? "E" : "W";
	return `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lonDir}`;
}

// --- Sub-Components ---

interface WeatherIconProps {
	type: string;
	size?: number;
	className?: string;
}

function WeatherIcon({ type, size = 24, className = "" }: WeatherIconProps) {
	switch (type.toLowerCase()) {
		case "sun":
			return <Sun size={size} className={className} />;
		case "cloud":
			return <Cloud size={size} className={className} />;
		case "rain":
			return <CloudRain size={size} className={className} />;
		case "storm":
			return <CloudLightning size={size} className={className} />;
		case "snow":
			return <CloudSnow size={size} className={className} />;
		default:
			return <Sun size={size} className={className} />;
	}
}

interface DataBlockProps {
	label: string;
	value: string | number;
	unit?: string;
	icon?: LucideIcon;
	subtext?: string;
}

function DataBlock({
	label,
	value,
	unit,
	icon: Icon,
	subtext,
}: DataBlockProps) {
	return (
		<div className="flex flex-col p-4 border-r border-b border-black/10 last:border-r-0 md:border-b-0 hover:bg-black/2 transition-colors group">
			<div className="flex items-center justify-between mb-2">
				<span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-mono">
					{label}
				</span>
				{Icon && (
					<Icon
						size={14}
						className="text-gray-400 group-hover:text-black transition-colors"
					/>
				)}
			</div>
			<div className="flex items-baseline gap-1">
				<span className="text-xl font-semibold text-gray-900">{value}</span>
				{unit && (
					<span className="text-xs text-gray-500 font-mono">{unit}</span>
				)}
			</div>
			{subtext && (
				<div className="mt-1 text-[10px] text-emerald-600 font-mono flex items-center gap-1">
					<div className="w-1 h-1 rounded-full bg-emerald-500"></div>
					{subtext}
				</div>
			)}
		</div>
	);
}

// --- Main Application ---

interface ClipPunkViewProps {
	latitude: number;
	longitude: number;
	airportCode: string;
	airportName: string;
	city: string;
	elevation?: number;
}

export function ClipPunkView({
	latitude,
	longitude,
	airportCode,
	airportName,
	city,
	elevation,
}: ClipPunkViewProps) {
	const { observation, isLoadingInitial, isError, error } =
		useWeatherConditions({ latitude, longitude });

	const getConditionIcon = (condition: string) => {
		if (condition.toLowerCase().includes("rain")) return "rain";
		if (condition.toLowerCase().includes("cloud")) return "cloud";
		return "sun";
	};

	// Extract weather data with fallbacks
	const properties = observation?.properties;
	const temp = properties?.temperature?.value ?? null;
	const condition = properties?.textDescription ?? "Unknown";
	const windSpeed = properties?.windSpeed?.value ?? null;
	const windDirection = properties?.windDirection?.value ?? null;
	const humidity = properties?.relativeHumidity?.value ?? null;
	const visibility = properties?.visibility?.value ?? null;
	const dewPoint = calculateDewPoint(temp, humidity);

	if (isError) {
		return (
			<div className="bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
				<header className="border-b-2 border-black p-6 bg-white">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="size-2.5 bg-red-500 rounded-full"></span>
								<span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
									Connection Error
								</span>
							</div>
						</div>
					</div>
				</header>
				<main className="p-6">
					<p className="text-gray-600">
						{error?.message ?? "Failed to load weather data"}
					</p>
				</main>
			</div>
		);
	}

	if (isLoadingInitial && !observation) {
		return (
			<div className="bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
				<header className="border-b-2 border-black p-6 bg-white">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="size-2.5 bg-blue-500 rounded-full animate-pulse"></span>
								<span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
									Loading Feed
								</span>
							</div>
						</div>
					</div>
				</header>
				<main className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="md:col-span-2 space-y-3">
							<Skeleton className="h-12 w-48" />
							<Skeleton className="h-4 w-64" />
						</div>
						<Skeleton className="h-24 w-full" />
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
						<Skeleton className="h-20 w-full" />
					</div>
				</main>
			</div>
		);
	}

	return (
		<>
			{/* Main Container - The "Clip-Board" */}
			<div className="bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
				{/* Header Section */}
				<header className="border-b-2 border-black p-6 bg-white">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="size-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
								<span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
									Live Feed
								</span>
							</div>
						</div>
					</div>
				</header>

				{/* Main Content Area */}
				<main
					className={`transition-opacity duration-300 ${isLoadingInitial ? "opacity-50" : "opacity-100"}`}
				>
					{/* Primary Status Display */}
					<div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-black">
						{/* Left: Location Identity */}
						<div className="p-6 md:col-span-2 border-b md:border-b-0 md:border-r border-black/10 flex flex-col justify-center">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-6xl font-black tracking-tighter">
									{airportCode}
								</h2>
								<div className="flex flex-col">
									<span className="text-lg font-medium leading-none">
										{city}
									</span>
									<span className="text-xs text-gray-500 font-mono mt-1">
										{airportName}
									</span>
								</div>
							</div>
							<div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 self-start mt-2 border border-gray-200 rounded-sm">
								<MapPin size={12} className="text-gray-500" />
								<span className="text-[10px] font-mono text-gray-600 uppercase">
									{formatCoordinates(latitude, longitude)}
								</span>
							</div>
						</div>

						{/* Right: Primary Weather */}
						<div className="p-6 bg-black text-white flex flex-col justify-between relative overflow-hidden group">
							{/* Abstract Background Decoration */}
							<div className="absolute -right-4 -top-4 text-white/10 group-hover:text-white/20 transition-colors">
								<WeatherIcon type={getConditionIcon(condition)} size={120} />
							</div>

							<div className="relative z-10">
								<div className="flex justify-between items-start">
									<span className="text-[10px] font-mono uppercase border border-white/30 px-2 py-0.5 rounded-full">
										Current
									</span>
									<WeatherIcon type={getConditionIcon(condition)} size={24} />
								</div>
								<div className="mt-4">
									<span className="text-5xl font-mono font-bold">
										{celsiusToFahrenheit(temp)}°
									</span>
									<p className="text-sm text-gray-400 mt-1">{condition}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Telemetry Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 bg-white">
						<DataBlock
							label="Wind Velocity"
							value={windSpeed !== null ? Math.round(windSpeed) : "--"}
							unit="MPH"
							icon={Wind}
							subtext={`Dir: ${formatWindDirection(windDirection)}`}
						/>
						<DataBlock
							label="Visibility"
							value={metersToMiles(visibility)}
							unit="MI"
							icon={Eye}
							subtext="Clear"
						/>
						<DataBlock
							label="Humidity"
							value={humidity !== null ? Math.round(humidity) : "--"}
							unit="%"
							icon={Droplets}
							subtext={`Dew: ${dewPoint}°`}
						/>
						<DataBlock
							label="Elevation"
							value={elevation ?? "--"}
							unit={elevation ? "ft" : ""}
							icon={ArrowUpRight}
						/>
					</div>

					{/* Forecast Strip - "The Tape" */}
					<div className="border-t-2 border-black bg-[#F9FAFB] p-4">
						<div className="flex items-center gap-2 mb-3">
							<Clock size={14} className="text-gray-400" />
							<span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
								Short-Range Forecast
							</span>
						</div>

						<div className="grid grid-cols-4 gap-4">
							{STATIC_FORECAST.map((item, idx) => (
								<div
									key={`${item.time}-${item.temp}-${item.icon}-${idx}`}
									className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
								>
									<span className="text-xs font-mono text-gray-400 mb-2">
										{item.time}
									</span>
									<WeatherIcon
										type={item.icon}
										size={20}
										className="text-gray-800 mb-2"
									/>
									<span className="font-bold text-sm">{item.temp}°</span>
								</div>
							))}
						</div>
					</div>

					{/* Footer / System Line */}
					<div className="bg-black text-gray-500 text-[10px] font-mono p-2 flex justify-between items-center">
						<span>DATA SOURCE: https://api.weather.gov</span>
						<span className="flex items-center gap-2">
							<span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
							SYSTEM ONLINE
						</span>
					</div>
				</main>
			</div>
		</>
	);
}
