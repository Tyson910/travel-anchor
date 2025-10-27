import { type ExpressionBuilder, sql } from "kysely";
import { jsonArrayFrom, jsonBuildObject } from "kysely/helpers/postgres";

import { type DB, kyselyDriver } from "#database";
import { airportColumns } from "#domains/airport/repository.ts";
import { logger } from "#utils/logger.ts";

const originAirportWhereClause = (
	eb: ExpressionBuilder<DB, "route">,
	IATA: string | string[],
) => {
	if (typeof IATA == "string") {
		return eb("route.origin_iata", "=", IATA.toUpperCase());
	}
	return eb("route.origin_iata", "in", IATA);
};

/**
 * Finds destination airports that are common to a given list of origin airports.
 * @param originIATAs An array of IATA codes for the origin airports.
 * @param db The Kysely database instance.
 * @returns A promise that resolves to an array of common destination IATA codes.
 */
export async function getAirportRoutesByIATA(
	IATA: string[],
	db = kyselyDriver,
) {
	logger.debug("Finding airport routes: %s", IATA);

	const originCount = IATA.length;

	const results = await db
		.with("mutual_destinations", (cteDB) =>
			cteDB
				.selectFrom("route")
				.select(["route.destination_iata"])
				.where((whereBuilder) => originAirportWhereClause(whereBuilder, IATA))
				.groupBy("route.destination_iata")
				.having(sql`COUNT(DISTINCT origin_iata)`, "=", originCount),
		)
		.selectFrom("mutual_destinations")
		.innerJoin(
			"airport",
			"airport.iata_code",
			"mutual_destinations.destination_iata",
		)
		.leftJoin("state", "state.state_id", "airport.state_id")
		.leftJoin("country", "country.country_code", "airport.country_code")
		.select((eb) =>
			jsonBuildObject({
				city_name: eb.ref("airport.city_name"),
				country_code: eb.ref("airport.country_code"),
				latitude: eb.ref("airport.latitude"),
				longitude: eb.ref("airport.longitude"),
				timezone: eb.ref("airport.timezone"),
				name: eb.ref("airport.name"),
				elevation_ft: eb.ref("airport.elevation_ft"),
				iata_code: eb.ref("airport.iata_code"),
				state_name: eb.ref("state.state_name"),
				country_name: eb.ref("country.country_name"),
			}).as("destination_airport"),
		)
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom("airport")
					.innerJoin("route", "route.origin_iata", "airport.iata_code")
					.leftJoin("state", "state.state_id", "airport.state_id")
					.leftJoin("country", "country.country_code", "airport.country_code")
					.where((whereBuilder) => originAirportWhereClause(whereBuilder, IATA))
					.whereRef(
						"mutual_destinations.destination_iata",
						"=",
						"route.destination_iata",
					)
					.select(airportColumns)
					.select([
						"state.state_name",
						"country.country_name",
						"route.id as route_id",
						"route.distance_km",
						"route.duration_min",
					])
					.select((nestedEb) => [
						jsonArrayFrom(
							nestedEb
								.selectFrom("airline")
								.innerJoin(
									"route_airline",
									"route_airline.route_id",
									"route.id",
								)
								.whereRef("route.id", "=", "route_airline.route_id")
								.whereRef(
									"airline.iata_code",
									"=",
									"route_airline.airline_iata",
								)
								.select((superNestedEb) => [
									"airline.name",
									"airline.iata_code",
									"airline.url",
									"airline.is_skyteam",
									superNestedEb.fn
										.coalesce("airline.is_lowcost", sql.lit(false))
										.as("is_lowcost"),
									"airline.is_staralliance",
									"airline.is_oneworld",
								]),
						).as("airline_options"),
					]),
			).as("origin_airport_options"),
		])
		.orderBy("mutual_destinations.destination_iata", "asc")
		.orderBy("country.country_name", "asc")
		.orderBy("state.state_name", "asc")
		.execute();

	return results;
}
