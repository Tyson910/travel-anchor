import { z } from "@hono/zod-openapi";

export { airlineSchema, airportSchema, routeSchema } from "#domains/airport/types.ts";

export const flightRoutesQuerySchema = z.object({
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
});

export type FlightRoutesQuery = z.infer<typeof flightRoutesQuerySchema>;
