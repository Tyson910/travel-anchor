import type {
	AnyColumnWithTable,
	Expression,
	Selectable,
	SqlBool,
} from "kysely";

import {
	type DB,
	kyselyDriver,
	type Airport as RawAirportTable,
} from "#database";
import { logger } from "#logger";

type Airport = Selectable<RawAirportTable>;

export const airportColumns = [
	"airport.city_name",
	"airport.country_code",
	"airport.latitude",
	"airport.longitude",
	"airport.timezone",
	"airport.name",
	"airport.elevation_ft",
	"airport.iata_code",
] as const satisfies AnyColumnWithTable<DB, "airport">[];

export async function getAirportByIATA(
	IATA: string,
	db = kyselyDriver,
): Promise<Omit<Airport, "viator_url" | "icao_code" | "state_id">> {
	logger.debug("Finding airport: %s", IATA);
	return await db
		.selectFrom("airport")
		.leftJoin("state", "state.state_id", "airport.state_id")
		.leftJoin("country", "country.country_code", "airport.country_code")
		.where("airport.iata_code", "=", IATA)
		.select(airportColumns)
		.select(["state.state_name", "country.country_name", "airport.iata_code"])
		.executeTakeFirstOrThrow();
}

export async function searchAirport(query: string, db = kyselyDriver) {
	logger.debug("Finding airport: %s", query);
	return await db
		.selectFrom("airport")
		.where((eb) => {
			const ors: Expression<SqlBool>[] = [];
			if (query.length == 3) {
				ors.push(eb("airport.iata_code", "=", query.toUpperCase()));
			}
			ors.push(eb("airport.city_name", "like", `%${query.toLowerCase()}%`));
			ors.push(eb("airport.name", "like", `%${query.toLowerCase()}%`));
			return eb.or(ors);
		})
		.leftJoin("country", "country.country_code", "airport.country_code")
		.leftJoin("state", "state.state_id", "airport.state_id")
		.select(airportColumns)
		.select(["state.state_name", "country.country_name", "airport.iata_code"])
		.limit(10)
		.execute();
}
