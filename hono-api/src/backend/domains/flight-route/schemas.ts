import { createRoute, z } from "@hono/zod-openapi";

import { notFoundResponseSchema } from "#utils/errors.ts";
import { airlineSchema, airportSchema, routeSchema } from "./types.ts";

export const getAirportsRoutesRoute = createRoute({
	method: "get",
	path: "/",
	request: {
		query: z.object({
			IATA: z
				.union([z.string(), z.string().array()])
				.transform((val) =>
					Array.isArray(val)
						? val.map((lowerCaseVal) => lowerCaseVal.toUpperCase())
						: [val.toUpperCase()],
				)
				.openapi({
					description:
						"International Air Transport Association (IATA) airport code(s)",
				}),
		}),
	},
	responses: {
		200: {
			content: {
				"application/json": {
					schema: z.object({
						routes: z
							.object({
								destination_airport: airportSchema,
								origin_airport_options: z
									.object({
										...airportSchema.shape,
										...routeSchema.pick({
											distance_km: true,
											duration_min: true,
										}).shape,
										route_id: routeSchema.shape.id,
										airline_options: airlineSchema.array(),
									})
									.array(),
							})
							.array(),
					}),
				},
			},
			description: "Retrieve all routes for a given airport",
		},
		404: {
			description: "Airport not found",
			content: {
				"application/json": {
					schema: notFoundResponseSchema,
				},
			},
		},
		500: {
			content: {
				"application/json": {
					schema: z.object({ message: z.string().nonempty() }),
				},
			},
			description: "Internal error",
		},
	},
	tags: ["Flight Routes"],
});
