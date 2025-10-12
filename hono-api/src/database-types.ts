import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type AirlineTable = {
	/**
	 * The IATA code for the airline, serving as the primary key (e.g., 'DL').
	 */
	iata_code: string;
	/**
	 * The official name of the airline.
	 */
	name: string;
	/**
	 * The customer service phone number for the airline.
	 */
	phone: string | null;
	/**
	 * The official website URL for the airline.
	 */
	url: string | null;
	/**
	 * A flag (0 or 1) indicating if the airline is a low-cost carrier.
	 */
	is_lowcost: number | null;
	/**
	 * A flag (0 or 1) indicating if the airline is part of the Oneworld alliance.
	 */
	is_oneworld: Generated<number>;
	/**
	 * A flag (0 or 1) indicating if the airline is part of the Star Alliance.
	 */
	is_staralliance: Generated<number>;
	/**
	 * A flag (0 or 1) indicating if the airline is part of the SkyTeam alliance.
	 */
	is_skyteam: Generated<number>;
};
export type Airline = Selectable<AirlineTable>;
export type NewAirline = Insertable<AirlineTable>;
export type AirlineUpdate = Updateable<AirlineTable>;
export type AirportTable = {
	/**
	 * The IATA code for the airport, serving as the primary key (e.g., 'ATL').
	 */
	iata_code: string;
	/**
	 * The ICAO code for the airport (e.g., 'KATL').
	 */
	icao_code: string | null;
	/**
	 * The official name of the airport.
	 */
	name: string;
	/**
	 * The name of the city the airport serves.
	 */
	city_name: string | null;
	/**
	 * A foreign key referencing the state's ID.
	 */
	state_id: number | null;
	/**
	 * A foreign key referencing the country's code.
	 */
	country_code: string;
	/**
	 * The geographic latitude of the airport.
	 */
	latitude: number;
	/**
	 * The geographic longitude of the airport.
	 */
	longitude: number;
	/**
	 * The timezone in the "Area/City" format (e.g., "America/New_York").
	 */
	timezone: string | null;
	/**
	 * The airport's elevation in feet.
	 */
	elevation_ft: number | null;
	/**
	 * An affiliate URL to Viator for the airport's city. Supports monetization.
	 */
	viator_url: string | null;
};
export type Airport = Selectable<AirportTable>;
export type NewAirport = Insertable<AirportTable>;
export type AirportUpdate = Updateable<AirportTable>;
export type AirportRawTable = {
	/**
	 * The name of the city.
	 */
	city_name: string;
	/**
	 * The full name of the country.
	 */
	country: string;
	/**
	 * The two-letter code for the country.
	 */
	country_code: string;
	/**
	 * The IATA code for the airport, serving as the primary key.
	 */
	IATA: string;
	/**
	 * The geographic latitude of the airport.
	 */
	latitude: number;
	/**
	 * The geographic longitude of the airport. Stored as TEXT as per the original DDL.
	 */
	longitude: string;
	/**
	 * The number of direct routes from this airport.
	 */
	no_routes: number;
	/**
	 * The official name of the airport.
	 */
	name: string;
};
export type AirportRaw = Selectable<AirportRawTable>;
export type NewAirportRaw = Insertable<AirportRawTable>;
export type AirportRawUpdate = Updateable<AirportRawTable>;
export type ContinentTable = {
	/**
	 * The auto-incrementing primary key for the continent.
	 */
	id: Generated<number>;
	/**
	 * The full name of the continent (e.g., "North America"). Must be unique.
	 */
	continent_name: string;
};
export type Continent = Selectable<ContinentTable>;
export type NewContinent = Insertable<ContinentTable>;
export type ContinentUpdate = Updateable<ContinentTable>;
export type CountryTable = {
	/**
	 * The two-letter ISO 3166-1 alpha-2 country code, serving as the primary key.
	 */
	country_code: string;
	/**
	 * The full name of the country (e.g., "United States").
	 */
	country_name: string;
	/**
	 * A foreign key referencing the continent's ID.
	 */
	continent_id: number | null;
	/**
	 * A flag (0 or 1) indicating if the country is part of the Schengen Area.
	 */
	is_schengen: Generated<number>;
};
export type Country = Selectable<CountryTable>;
export type NewCountry = Insertable<CountryTable>;
export type CountryUpdate = Updateable<CountryTable>;
export type RouteTable = {
	/**
	 * The auto-incrementing primary key for the route.
	 */
	id: Generated<number>;
	/**
	 * The IATA code of the origin airport.
	 */
	origin_iata: string;
	/**
	 * The IATA code of the destination airport.
	 */
	destination_iata: string;
	/**
	 * The distance of the route in kilometers.
	 */
	distance_km: number | null;
	/**
	 * The estimated duration of the flight in minutes.
	 */
	duration_min: number | null;
};
export type Route = Selectable<RouteTable>;
export type NewRoute = Insertable<RouteTable>;
export type RouteUpdate = Updateable<RouteTable>;
export type RouteAirlineTable = {
	/**
	 * A foreign key referencing the route's ID.
	 */
	route_id: number;
	/**
	 * A foreign key referencing the airline's IATA code.
	 */
	airline_iata: string;
};
export type RouteAirline = Selectable<RouteAirlineTable>;
export type NewRouteAirline = Insertable<RouteAirlineTable>;
export type RouteAirlineUpdate = Updateable<RouteAirlineTable>;
export type StateTable = {
	/**
	 * The auto-incrementing primary key for the state.
	 */
	state_id: Generated<number>;
	/**
	 * The abbreviated code for the state (e.g., "CA" for California).
	 */
	state_code: string;
	/**
	 * The full name of the state (e.g., "California").
	 */
	state_name: string;
	/**
	 * A foreign key referencing the country's code this state belongs to.
	 */
	country_code: string;
};
export type State = Selectable<StateTable>;
export type NewState = Insertable<StateTable>;
export type StateUpdate = Updateable<StateTable>;
export type DB = {
	airline: AirlineTable;
	airport: AirportTable;
	airport_raw: AirportRawTable;
	continent: ContinentTable;
	country: CountryTable;
	route: RouteTable;
	route_airline: RouteAirlineTable;
	state: StateTable;
};
