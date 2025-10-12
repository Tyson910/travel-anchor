import type { ContentfulStatusCode } from "hono/utils/http-status";

// import { serve } from "@hono/node-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { bodyLimit } from "hono/body-limit";
// import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { HTTPException } from "hono/http-exception";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { handleSQLiteError } from "./error-handlers.ts";
import { airport, flightRoutes } from "./handlers.ts";
import { logger } from "./logger.ts";
import { endTime, startTime } from "./middleware/timing.ts";
import { SQLiteError } from "bun:sqlite";

const app = new OpenAPIHono()
	.route("/v1/airport", airport)
	.route("/v1/flight-route", flightRoutes);

app.get("/health", (c) => {
	return c.json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

app.use(startTime);
// app.use(compress());
app.use(prettyJSON());
app.use(cors());
app.use(secureHeaders());
app.use(
	bodyLimit({
		maxSize: 1024,
	}),
);
app.use(etag());
app.use(endTime);

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

export default {
	fetch: app.fetch,
	port: 3000,
};
