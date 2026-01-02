import type React from "react";

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
	Search,
	Sun,
	Wind,
} from "lucide-react";
import { useState } from "react";

// --- Type Definitions ---

interface ForecastItem {
	time: string;
	temp: number;
	icon: string;
}

interface AirportData {
	code: string;
	name: string;
	city: string;
	temp: number;
	condition: string;
	windSpeed: number;
	windDir: string;
	humidity: number;
	visibility: string;
	ceiling: string;
	dewPoint: number;
	forecast: ForecastItem[];
}

interface AirportDataMap {
	[key: string]: AirportData;
}

// --- Mock Data ---

const AIRPORT_DATA: AirportDataMap = {
	SFO: {
		code: "SFO",
		name: "San Francisco Int.",
		city: "San Francisco, CA",
		temp: 64,
		condition: "Partly Cloudy",
		windSpeed: 12,
		windDir: "NW",
		humidity: 68,
		visibility: "10+",
		ceiling: "Unlimited",
		dewPoint: 52,
		forecast: [
			{ time: "14:00", temp: 65, icon: "sun" },
			{ time: "15:00", temp: 64, icon: "cloud" },
			{ time: "16:00", temp: 62, icon: "cloud" },
			{ time: "17:00", temp: 59, icon: "rain" },
		],
	},
	LHR: {
		code: "LHR",
		name: "Heathrow Airport",
		city: "London, UK",
		temp: 52,
		condition: "Light Rain",
		windSpeed: 8,
		windDir: "SW",
		humidity: 82,
		visibility: "4.5",
		ceiling: "1200 ft",
		dewPoint: 48,
		forecast: [
			{ time: "20:00", temp: 51, icon: "rain" },
			{ time: "21:00", temp: 50, icon: "rain" },
			{ time: "22:00", temp: 49, icon: "cloud" },
			{ time: "23:00", temp: 48, icon: "cloud" },
		],
	},
	HND: {
		code: "HND",
		name: "Haneda Airport",
		city: "Tokyo, JP",
		temp: 72,
		condition: "Sunny",
		windSpeed: 5,
		windDir: "E",
		humidity: 45,
		visibility: "10+",
		ceiling: "Unlimited",
		dewPoint: 55,
		forecast: [
			{ time: "09:00", temp: 74, icon: "sun" },
			{ time: "10:00", temp: 76, icon: "sun" },
			{ time: "11:00", temp: 77, icon: "sun" },
			{ time: "12:00", temp: 78, icon: "sun" },
		],
	},
};

// --- Sub-Components ---

interface WeatherIconProps {
	type: string;
	size?: number;
	className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
	type,
	size = 24,
	className = "",
}) => {
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
};

interface DataBlockProps {
	label: string;
	value: string | number;
	unit?: string;
	icon?: LucideIcon;
	subtext?: string;
}

const DataBlock: React.FC<DataBlockProps> = ({
	label,
	value,
	unit,
	icon: Icon,
	subtext,
}) => (
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
			{unit && <span className="text-xs text-gray-500 font-mono">{unit}</span>}
		</div>
		{subtext && (
			<div className="mt-1 text-[10px] text-emerald-600 font-mono flex items-center gap-1">
				<div className="w-1 h-1 rounded-full bg-emerald-500"></div>
				{subtext}
			</div>
		)}
	</div>
);

// --- Main Application ---

export function ClipPunkView() {
	const [selectedAirport, setSelectedAirport] = useState<string>("SFO");
	const [loading, setLoading] = useState<boolean>(false);
	const data = AIRPORT_DATA[selectedAirport];

	const getConditionIcon = (condition: string) => {
		if (condition.toLowerCase().includes("rain")) return "rain";
		if (condition.toLowerCase().includes("cloud")) return "cloud";
		return "sun";
	};

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
					className={`transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}
				>
					{/* Primary Status Display */}
					<div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-black">
						{/* Left: Location Identity */}
						<div className="p-6 md:col-span-2 border-b md:border-b-0 md:border-r border-black/10 flex flex-col justify-center">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-6xl font-black tracking-tighter">
									{data.code}
								</h2>
								<div className="flex flex-col">
									<span className="text-lg font-medium leading-none">
										{data.city}
									</span>
									<span className="text-xs text-gray-500 font-mono mt-1">
										{data.name}
									</span>
								</div>
							</div>
							<div className="inline-flex items-center gap-2 px-2 py-1 bg-gray-100 self-start mt-2 border border-gray-200 rounded-sm">
								<MapPin size={12} className="text-gray-500" />
								<span className="text-[10px] font-mono text-gray-600 uppercase">
									37.6213° N, 122.3790° W
								</span>
							</div>
						</div>

						{/* Right: Primary Weather */}
						<div className="p-6 bg-black text-white flex flex-col justify-between relative overflow-hidden group">
							{/* Abstract Background Decoration */}
							<div className="absolute -right-4 -top-4 text-white/10 group-hover:text-white/20 transition-colors">
								<WeatherIcon
									type={getConditionIcon(data.condition)}
									size={120}
								/>
							</div>

							<div className="relative z-10">
								<div className="flex justify-between items-start">
									<span className="text-[10px] font-mono uppercase border border-white/30 px-2 py-0.5 rounded-full">
										Current
									</span>
									<WeatherIcon
										type={getConditionIcon(data.condition)}
										size={24}
									/>
								</div>
								<div className="mt-4">
									<span className="text-5xl font-mono font-bold">
										{data.temp}°
									</span>
									<p className="text-sm text-gray-400 mt-1">{data.condition}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Telemetry Grid */}
					<div className="grid grid-cols-2 md:grid-cols-4 bg-white">
						<DataBlock
							label="Wind Velocity"
							value={data.windSpeed}
							unit="KTS"
							icon={Wind}
							subtext={`Dir: ${data.windDir}`}
						/>
						<DataBlock
							label="Visibility"
							value={data.visibility}
							unit="MI"
							icon={Eye}
							subtext="Clear"
						/>
						<DataBlock
							label="Humidity"
							value={`${data.humidity}`}
							unit="%"
							icon={Droplets}
							subtext={`Dew: ${data.dewPoint}°`}
						/>
						<DataBlock
							label="Ceiling"
							value={data.ceiling}
							unit=""
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
							{data.forecast.map((item, idx) => (
								<div
									key={item.time + item.temp + item.icon + idx}
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
