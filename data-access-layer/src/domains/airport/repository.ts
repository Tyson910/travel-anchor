import type { AnyColumnWithTable, Expression, SqlBool } from "kysely";

import { type DB, kyselyDriver } from "#database";
import { logger } from "#logger";

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

export async function getAirportByIATA(IATA: string, db = kyselyDriver) {
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
			ors.push(eb("airport.iata_code", "ilike", `%${query}%`));
			ors.push(eb("airport.city_name", "ilike", `%${query}%`));
			ors.push(eb("airport.name", "ilike", `%${query}%`));
			return eb.or(ors);
		})
		.leftJoin("country", "country.country_code", "airport.country_code")
		.leftJoin("state", "state.state_id", "airport.state_id")
		.select(airportColumns)
		.select(["state.state_name", "country.country_name", "airport.iata_code"])
		.limit(10)
		.execute();
}
