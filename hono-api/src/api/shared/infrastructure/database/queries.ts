import type { DB } from "#database/types.ts";

import {
	type AnyColumnWithTable,
	type Expression,
	type ExpressionBuilder,
	type SqlBool,
	type StringReference,
	sql,
} from "kysely";
import { jsonArrayFrom, jsonBuildObject } from "kysely/helpers/sqlite";

import { logger } from "#logger/logger.ts";
import { kyselyDriver } from "./driver.ts";

function asBoolean(
	eb: ExpressionBuilder<DB, "airline">,
	column: StringReference<DB, "airline">,
) {
	return sql<boolean>`${eb.ref(column)} = 1`;
}

const airportColumns = [
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
		.select(airportColumns)
		.select(["state.state_name", "country.country_name"])
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
									asBoolean(superNestedEb, "airline.is_skyteam").as(
										"is_skyteam",
									),
									asBoolean(superNestedEb, "airline.is_lowcost").as(
										"is_lowcost",
									),
									asBoolean(superNestedEb, "airline.is_staralliance").as(
										"is_staralliance",
									),
									asBoolean(superNestedEb, "airline.is_oneworld").as(
										"is_oneworld",
									),
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
