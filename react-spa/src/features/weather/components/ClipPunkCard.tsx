import type { QuantitativeValueSchema } from "~/features/weather/weather.validators";

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
import {
	type FormattedWeatherValue,
	formatWeatherValue,
} from "~/features/weather/unit-math";
import { WEATHER_BASE_URL } from "~/features/weather/weather-client";

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

function formatCoordinates(latitude: number, longitude: number): string {
	const latDir = latitude >= 0 ? "N" : "S";
	const lonDir = longitude >= 0 ? "E" : "W";
	return `${Math.abs(latitude).toFixed(4)}° ${latDir}, ${Math.abs(longitude).toFixed(4)}° ${lonDir}`;
}

function calculateFeelsLike(
	temperature: QuantitativeValueSchema,
	windChill: QuantitativeValueSchema | null | undefined,
	heatIndex: QuantitativeValueSchema | null | undefined,
): FormattedWeatherValue {
	// Priority: windChill → heatIndex → temperature
	const windChillFormatted = windChill ? formatWeatherValue(windChill) : null;
	if (windChillFormatted) return windChillFormatted;

	const heatIndexFormatted = heatIndex ? formatWeatherValue(heatIndex) : null;
	if (heatIndexFormatted) return heatIndexFormatted;

	return formatWeatherValue(temperature);
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
		<div className="flex flex-col p-4 border-r border-b border-border last:border-r-0 md:border-b-0 hover:bg-muted/50 transition-colors group">
			<div className="flex items-center justify-between mb-2">
				<span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
					{label}
				</span>
				{Icon && (
					<Icon
						size={14}
						className="text-muted-foreground group-hover:text-foreground transition-colors"
					/>
				)}
			</div>
			<div className="flex items-baseline gap-1">
				<span className="text-xl font-semibold text-foreground">{value}</span>
				{unit && (
					<span className="text-xs text-muted-foreground font-mono">
						{unit}
					</span>
				)}
			</div>
			{subtext && (
				<div className="mt-1 text-[10px] text-emerald-600 font-mono flex items-center gap-1">
					<div className="size-1 rounded-full bg-emerald-500"></div>
					{subtext}
				</div>
			)}
		</div>
	);
}

function LocationSpecDetail({
	children,
	Icon,
}: React.PropsWithChildren<{ Icon: typeof MapPin }>) {
	return (
		<div className="inline-flex items-center gap-2 px-2 py-1 bg-muted self-start mt-2 border border-border rounded-sm">
			<Icon size={12} className="text-muted-foreground" />
			<span className="text-[10px] font-mono text-muted-foreground uppercase">
				{children}
			</span>
		</div>
	);
}

// --- Main Application ---

interface ClipPunkViewProps {
	latitude: number;
	longitude: number;
	stationId: string;
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
	stationId,
	city,
	elevation,
}: ClipPunkViewProps) {
	const { observation, isLoading, isError, error } = useWeatherConditions({
		stationId: stationId,
	});

	const getConditionIcon = (condition: string) => {
		if (condition.toLowerCase().includes("rain")) return "rain";
		if (condition.toLowerCase().includes("cloud")) return "cloud";
		return "sun";
	};

	// Extract weather data with fallbacks
	const properties = observation?.properties;
	const temp = formatWeatherValue(properties?.temperature ?? { value: null });
	const condition = properties?.textDescription ?? "Unknown";
	const windSpeed = formatWeatherValue(
		properties?.windSpeed ?? { value: null },
	);
	const windDirection = formatWeatherValue(
		properties?.windDirection ?? { value: null },
	);
	const humidity = formatWeatherValue(
		properties?.relativeHumidity ?? { value: null },
	);
	const visibility = formatWeatherValue(
		properties?.visibility ?? { value: null },
	);
	const dewPoint = formatWeatherValue(properties?.dewpoint ?? { value: null });

	const feelsLike = calculateFeelsLike(
		properties?.temperature ?? { value: null },
		properties?.windChill,
		properties?.heatIndex,
	);

	if (isError) {
		return (
			<div className="bg-card shadow-[8px_8px_0px_0px_hsl(var(--foreground))] border-2 border-foreground">
				<header className="border-b-2 border-border p-6 bg-card">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="size-2.5 bg-destructive rounded-full"></span>
								<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
									Connection Error
								</span>
							</div>
						</div>
					</div>
				</header>
				<main className="p-6">
					<p className="text-muted-foreground">
						{error?.message ?? "Failed to load weather data"}
					</p>
				</main>
			</div>
		);
	}

	if (isLoading && !observation) {
		return (
			<div className="bg-card shadow-[8px_8px_0px_0px_hsl(var(--foreground))] border-2 border-foreground">
				<header className="border-b-2 border-border p-6 bg-card">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="size-2.5 bg-primary rounded-full animate-pulse"></span>
								<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
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
			<div className="bg-card shadow-[8px_8px_0px_0px_hsl(var(--foreground))] border-2 border-foreground">
				{/* Header Section */}
				<header className="border-b-2 border-border p-6 bg-card">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="size-2.5 bg-success-foreground rounded-full animate-pulse"></span>
								<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
									Live Feed
								</span>
							</div>
						</div>
					</div>
				</header>

				{/* Main Content Area */}
				<main
					className={`transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}
				>
					{/* Primary Status Display */}
					<div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-foreground">
						{/* Left: Location Identity */}
						<div className="p-6 md:col-span-2 border-b md:border-b-0 md:border-r border-border flex flex-col justify-center">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-6xl font-black tracking-tighter">
									{airportCode}
								</h2>
								<div className="flex flex-col">
									<span className="text-lg font-medium leading-none">
										{city}
									</span>
									<span className="text-xs text-muted-foreground font-mono mt-1">
										{airportName}
									</span>
								</div>
							</div>
							{/* Location Details */}
							<div className="flex flex-row gap-x-3">
								<LocationSpecDetail Icon={MapPin}>
									{formatCoordinates(latitude, longitude)}
								</LocationSpecDetail>
							</div>
						</div>

						{/* Right: Primary Weather */}
						<div className="p-6 bg-primary text-primary-foreground flex flex-col justify-between relative overflow-hidden group">
							{/* Abstract Background Decoration */}
							<div className="absolute -right-4 -top-4 text-primary-foreground/10 group-hover:text-primary-foreground/20 transition-colors">
								<WeatherIcon type={getConditionIcon(condition)} size={120} />
							</div>

							<div className="relative z-10">
								<div className="flex justify-between items-start">
									<span className="text-[10px] font-mono uppercase border border-primary-foreground/30 px-2 py-0.5 rounded-full">
										Current Conditions
									</span>
									<WeatherIcon type={getConditionIcon(condition)} size={24} />
								</div>
								<div className="mt-4">
									{/* Primary Metric: Feels Like */}
									<div className="flex flex-col">
										<span className="text-[10px] text-primary-foreground/80 font-mono uppercase mb-1">
											Feels Like
										</span>
										<span className="text-6xl font-mono font-bold leading-none tracking-tighter">
											{feelsLike?.formattedString ?? "--"}
										</span>
									</div>

									{/* Secondary Metric: Actual */}
									<div className="flex items-center gap-3 mt-4 pt-4 border-t border-primary-foreground/20">
										<div className="flex flex-col">
											<span className="text-[10px] text-primary-foreground/60 font-mono uppercase">
												Actual
											</span>
											<span className="text-xl font-bold">
												{temp?.formattedString ?? "--"}
											</span>
										</div>
										<div className="h-8 w-px bg-primary-foreground/20"></div>
										<div className="flex flex-col">
											<span className="text-[10px] text-primary-foreground/60 font-mono uppercase">
												Sky
											</span>
											<span className="text-sm font-medium whitespace-nowrap">
												{condition}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Telemetry Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 bg-card">
						<DataBlock
							label="Wind Velocity"
							value={windSpeed?.value ?? "--"}
							unit={windSpeed?.userFriendlyUnit}
							icon={Wind}
							subtext={
								windDirection
									? `Dir: ${windDirection.formattedString}`
									: undefined
							}
						/>
						<DataBlock
							label="Visibility"
							value={visibility?.value ?? "--"}
							unit={visibility?.userFriendlyUnit}
							icon={Eye}
							subtext="Clear"
						/>
						<DataBlock
							label="Humidity"
							value={humidity?.value ?? "--"}
							unit={humidity?.userFriendlyUnit}
							icon={Droplets}
							subtext={
								dewPoint ? `Dew: ${dewPoint.formattedString}` : undefined
							}
						/>
						<DataBlock
							label="Elevation"
							value={elevation ?? "--"}
							unit={elevation ? "ft" : ""}
							icon={ArrowUpRight}
						/>
					</div>

					{/* Forecast Strip - "The Tape" */}
					<div className="border-t-2 border-foreground bg-muted p-4">
						<div className="flex items-center gap-2 mb-3">
							<Clock size={14} className="text-muted-foreground" />
							<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
								Short-Range Forecast
							</span>
						</div>

						<div className="grid grid-cols-4 gap-4">
							{STATIC_FORECAST.map((item, idx) => (
								<div
									key={`${item.time}-${item.temp}-${item.icon}-${idx}`}
									className="flex flex-col items-center justify-center p-3 bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
								>
									<span className="text-xs font-mono text-muted-foreground mb-2">
										{item.time}
									</span>
									<WeatherIcon
										type={item.icon}
										size={20}
										className="text-foreground mb-2"
									/>
									<span className="font-bold text-sm">{item.temp}°</span>
								</div>
							))}
						</div>
					</div>

					{/* Footer / System Line */}
					<div className="bg-foreground text-background text-[10px] font-mono p-2 flex justify-between items-center">
						<span>DATA SOURCE: {WEATHER_BASE_URL}</span>
						<span className="flex items-center gap-2">
							<span className="size-1.5 bg-success-foreground rounded-full"></span>
							SYSTEM ONLINE
						</span>
					</div>
				</main>
			</div>
		</>
	);
}
