import type { FilterFieldConfig, FilterOption } from "~/components/ui/filters";

import {
	Building2,
	Calendar,
	Clock,
	DollarSign,
	MapPin,
	Plane,
	Users,
} from "lucide-react";

// Mock airline data
export const AIRLINE_OPTIONS: FilterOption<string>[] = [
	{ value: "AA", label: "American Airlines" },
	{ value: "DL", label: "Delta Air Lines" },
	{ value: "UA", label: "United Airlines" },
	{ value: "SW", label: "Southwest Airlines" },
	{ value: "B6", label: "JetBlue Airways" },
	{ value: "AS", label: "Alaska Airlines" },
	{ value: "NK", label: "Spirit Airlines" },
	{ value: "F9", label: "Frontier Airlines" },
];

// Mock airline alliance data
export const ALLIANCE_OPTIONS: FilterOption<string>[] = [
	{ value: "oneworld", label: "Oneworld" },
	{ value: "star_alliance", label: "Star Alliance" },
	{ value: "skyteam", label: "SkyTeam" },
];

// Mock region data
export const REGION_OPTIONS: FilterOption<string>[] = [
	{ value: "northeast", label: "Northeast" },
	{ value: "southeast", label: "Southeast" },
	{ value: "midwest", label: "Midwest" },
	{ value: "southwest", label: "Southwest" },
	{ value: "west", label: "West" },
	{ value: "pacific", label: "Pacific Northwest" },
];

// Mock airport size data
export const AIRPORT_SIZE_OPTIONS: FilterOption<string>[] = [
	{ value: "large", label: "Large Hub" },
	{ value: "medium", label: "Medium Hub" },
	{ value: "small", label: "Small Hub" },
	{ value: "nonhub", label: "Non-Hub" },
];

// Mock flight frequency data
export const FLIGHT_FREQUENCY_OPTIONS: FilterOption<string>[] = [
	{ value: "hourly", label: "Hourly" },
	{ value: "daily", label: "Daily" },
	{ value: "weekly", label: "Weekly" },
	{ value: "seasonal", label: "Seasonal" },
];

// Travel-specific filter fields configuration
export const TRAVEL_FILTER_FIELDS: FilterFieldConfig[] = [
	{
		key: "airlines",
		label: "Airlines",
		type: "multiselect",
		options: AIRLINE_OPTIONS,
		placeholder: "Select airlines...",
		searchable: true,
		defaultOperator: "is_any_of",
	},
	{
		key: "alliances",
		label: "Alliances",
		type: "multiselect",
		options: ALLIANCE_OPTIONS,
		placeholder: "Select alliances...",
		defaultOperator: "is_any_of",
	},
	{
		key: "regions",
		label: "Regions",
		type: "multiselect",
		options: REGION_OPTIONS,
		placeholder: "Select regions...",
		searchable: true,
		defaultOperator: "is_any_of",
	},
	{
		key: "airport_size",
		label: "Airport Size",
		type: "select",
		options: AIRPORT_SIZE_OPTIONS,
		placeholder: "Select airport size...",
		defaultOperator: "is",
	},
	{
		key: "flight_frequency",
		label: "Flight Frequency",
		type: "select",
		options: FLIGHT_FREQUENCY_OPTIONS,
		placeholder: "Select frequency...",
		defaultOperator: "is",
	},
	{
		key: "price_range",
		label: "Price Range",
		type: "numberrange",
		prefix: "$",
		placeholder: "Enter price range...",
		min: 0,
		max: 2000,
		step: 50,
		defaultOperator: "between",
	},
	{
		key: "flight_duration",
		label: "Flight Duration",
		type: "numberrange",
		suffix: "hrs",
		placeholder: "Enter duration...",
		min: 0.5,
		max: 12,
		step: 0.5,
		defaultOperator: "between",
	},
	{
		key: "direct_only",
		label: "Direct Flights Only",
		type: "boolean",
		onLabel: "Yes",
		offLabel: "No",
		defaultOperator: "is",
	},
	{
		key: "departure_time",
		label: "Departure Time",
		type: "time",
		placeholder: "Select departure time...",
		defaultOperator: "is",
	},
	{
		key: "departure_time_range",
		label: "Departure Time Range",
		type: "time",
		placeholder: "Select time range...",
		defaultOperator: "between",
	},
];

// Mock destination data
export interface MockDestination {
	id: string;
	city: string;
	state: string;
	airport: string;
	airportCode: string;
	region: string;
	airportSize: string;
	airlines: string[];
	alliances: string[];
	flightFrequency: string;
	priceRange: {
		min: number;
		max: number;
	};
	flightDuration: number;
	directFlights: boolean;
	popularTimes: string[];
	description: string;
}

export const MOCK_DESTINATIONS: MockDestination[] = [
	{
		id: "1",
		city: "Denver",
		state: "CO",
		airport: "Denver International Airport",
		airportCode: "DEN",
		region: "west",
		airportSize: "large",
		airlines: ["AA", "DL", "UA", "SW", "B6", "AS"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "hourly",
		priceRange: { min: 200, max: 600 },
		flightDuration: 2.5,
		directFlights: true,
		popularTimes: ["08:00", "12:00", "18:00"],
		description: "Mile-high city with mountain access and outdoor activities",
	},
	{
		id: "2",
		city: "Chicago",
		state: "IL",
		airport: "O'Hare International Airport",
		airportCode: "ORD",
		region: "midwest",
		airportSize: "large",
		airlines: ["AA", "DL", "UA", "SW", "B6", "AS"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "hourly",
		priceRange: { min: 150, max: 500 },
		flightDuration: 2.0,
		directFlights: true,
		popularTimes: ["07:00", "11:00", "17:00"],
		description: "Windy city with architecture, food, and lakefront activities",
	},
	{
		id: "3",
		city: "Atlanta",
		state: "GA",
		airport: "Hartsfield-Jackson Atlanta International Airport",
		airportCode: "ATL",
		region: "southeast",
		airportSize: "large",
		airlines: ["AA", "DL", "UA", "SW"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "hourly",
		priceRange: { min: 180, max: 450 },
		flightDuration: 2.0,
		directFlights: true,
		popularTimes: ["06:00", "14:00", "20:00"],
		description:
			"Southern capital with history, culture, and modern attractions",
	},
	{
		id: "4",
		city: "Phoenix",
		state: "AZ",
		airport: "Phoenix Sky Harbor International Airport",
		airportCode: "PHX",
		region: "southwest",
		airportSize: "large",
		airlines: ["AA", "DL", "UA", "SW", "B6"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "hourly",
		priceRange: { min: 220, max: 550 },
		flightDuration: 3.0,
		directFlights: true,
		popularTimes: ["09:00", "13:00", "19:00"],
		description: "Valley of the Sun with desert landscapes and golf resorts",
	},
	{
		id: "5",
		city: "Seattle",
		state: "WA",
		airport: "Seattle-Tacoma International Airport",
		airportCode: "SEA",
		region: "pacific",
		airportSize: "large",
		airlines: ["AA", "DL", "UA", "AS", "B6"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "hourly",
		priceRange: { min: 250, max: 650 },
		flightDuration: 4.0,
		directFlights: true,
		popularTimes: ["08:00", "12:00", "18:00"],
		description: "Emerald city with coffee culture, tech, and natural beauty",
	},
	{
		id: "6",
		city: "Miami",
		state: "FL",
		airport: "Miami International Airport",
		airportCode: "MIA",
		region: "southeast",
		airportSize: "large",
		airlines: ["AA", "DL", "UA", "B6"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "daily",
		priceRange: { min: 280, max: 700 },
		flightDuration: 3.5,
		directFlights: true,
		popularTimes: ["07:00", "15:00", "21:00"],
		description: "Magic city with beaches, nightlife, and Latin culture",
	},
	{
		id: "7",
		city: "Boston",
		state: "MA",
		airport: "Logan International Airport",
		airportCode: "BOS",
		region: "northeast",
		airportSize: "large",
		airlines: ["AA", "DL", "UA", "B6", "AS"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "hourly",
		priceRange: { min: 200, max: 600 },
		flightDuration: 2.5,
		directFlights: true,
		popularTimes: ["06:00", "12:00", "18:00"],
		description: "Historic city with universities, culture, and seafood",
	},
	{
		id: "8",
		city: "Las Vegas",
		state: "NV",
		airport: "Harry Reid International Airport",
		airportCode: "LAS",
		region: "west",
		airportSize: "large",
		airlines: ["AA", "DL", "UA", "SW", "B6", "NK", "F9"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "hourly",
		priceRange: { min: 180, max: 500 },
		flightDuration: 3.0,
		directFlights: true,
		popularTimes: ["10:00", "14:00", "22:00"],
		description: "Entertainment capital with casinos, shows, and dining",
	},
	{
		id: "9",
		city: "Minneapolis",
		state: "MN",
		airport: "Minneapolis-Saint Paul International Airport",
		airportCode: "MSP",
		region: "midwest",
		airportSize: "large",
		airlines: ["AA", "DL", "UA", "B6"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "daily",
		priceRange: { min: 220, max: 550 },
		flightDuration: 2.5,
		directFlights: true,
		popularTimes: ["07:00", "13:00", "19:00"],
		description: "Twin cities with lakes, culture, and outdoor activities",
	},
	{
		id: "10",
		city: "Portland",
		state: "OR",
		airport: "Portland International Airport",
		airportCode: "PDX",
		region: "pacific",
		airportSize: "medium",
		airlines: ["AA", "DL", "UA", "AS", "B6"],
		alliances: ["oneworld", "star_alliance", "skyteam"],
		flightFrequency: "daily",
		priceRange: { min: 280, max: 650 },
		flightDuration: 4.5,
		directFlights: true,
		popularTimes: ["08:00", "14:00", "20:00"],
		description: "City of roses with food trucks, breweries, and nature",
	},
];
