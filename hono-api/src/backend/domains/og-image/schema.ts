import { createRoute, z } from "@hono/zod-openapi";

export const getOgImageRoute = createRoute({
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
				"image/png": {
					schema: z.file(),
				},
			},
			description: "Og image",
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
	tags: ["Og image"],
});
