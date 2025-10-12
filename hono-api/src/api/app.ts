import type { ContentfulStatusCode } from "hono/utils/http-status";

import { OpenAPIHono } from "@hono/zod-openapi";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { HTTPException } from "hono/http-exception";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { airportRoutes } from "#domains/airport/routes.ts";
import { flightRouteRoutes } from "#domains/flight-route/routes.ts";
import { logger } from "#logger/logger.ts";
import { timing } from "#middleware/timing.ts";
import { handleSQLiteError } from "#utils/errors.ts";
import { SQLiteError } from "bun:sqlite";

const app = new OpenAPIHono()
	.route("/v1/airport", airportRoutes)
	.route("/v1/flight-route", flightRouteRoutes);

app.get("/health", (c) => {
	return c.json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

app.use(timing);
app.use(prettyJSON());
app.use(cors());
app.use(secureHeaders());
app.use(
	bodyLimit({
		maxSize: 1024,
	}),
);
app.use(etag());

app.doc("/openapi.json", {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Travel API",
	},
});

app.onError((err, c) => {
	if (err instanceof HTTPException) {
		logger.error(err.message);
		return err.getResponse();
	} else if (err instanceof SQLiteError) {
		const { message, statusCode } = handleSQLiteError(err);
		return c.json({ message }, statusCode as ContentfulStatusCode);
	}
	logger.error(err.message);
	return c.json({ error: "Internal Server Error" }, 500);
});

export { app };

export type App = typeof app;
