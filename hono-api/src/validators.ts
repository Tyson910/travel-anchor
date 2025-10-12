import { z } from "@hono/zod-openapi";

export const airlineSchema = z.object({
	iata_code: z.string().openapi({
		example: "DL",
	}),
	name: z.string().openapi({
		example: "Delta Airlines",
	}),
	is_skyteam: z.boolean().openapi({
		description: "Is this airline a member of the sky team alliance",
	}),
	is_lowcost: z.boolean(),
	is_staralliance: z.boolean().openapi({
		description: "Is this airline a member of the star alliance",
	}),
});

export const airportSchema = z.object({
	iata_code: z.string().openapi({
		example: "JFK",
	}),
	name: z.string().openapi({
		example: "John F. Kennedy International Airport",
	}),
	city_name: z.string().nullable().openapi({
		example: "New York",
	}),
	state_name: z.string().nullable().openapi({
		example: "Arizona",
	}),
	country_name: z.string().nullable().openapi({
		example: "United States of America",
	}),
	country_code: z.string().openapi({
		example: "US",
	}),
	latitude: z.number().openapi({
		example: 40.6413,
	}),
	longitude: z.number().openapi({
		example: -73.7781,
	}),
	timezone: z.string().nullable().openapi({
		example: "America/New_York",
	}),
});

export const routeSchema = z.object({
	id: z.number().int(),
	origin_iata: z.string(),
	destination_iata: z.string(),
	distance_km: z.number().int().nullable(),
	duration_min: z.number().int().nullable(),
});

export const airportSearchQuerySchema = z.object({
	query: z.string().openapi({
		description: "The search query for airports.",
		example: "New York",
	}),
});

export const iataParamSchema = z.object({
	IATA: z
		.string()
		.length(3)
		.openapi({
			param: {
				name: "IATA",
				in: "path",
			},
			example: "JFK",
		}),
});
