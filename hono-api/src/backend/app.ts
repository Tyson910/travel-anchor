import { OpenAPIHono } from "@hono/zod-openapi";
import {
	DatabaseError,
	handlePostgresError,
	router,
} from "@travel-anchor/data-access-layer";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { HTTPException } from "hono/http-exception";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

import { openImageRoutes } from "#domains/og-image/routes.ts";
import { logger } from "#logger";
import { timing } from "#middleware/timing.ts";

const app = new OpenAPIHono()
	.onError((err, c) => {
		if (err instanceof HTTPException) {
			logger.error(err.message);
			return err.getResponse();
		} else if (err instanceof DatabaseError) {
			const { message, statusCode } = handlePostgresError(err);
			return c.json({ message }, statusCode);
		}
		logger.error(err.message);
		return c.json({ error: "Internal Server Error" }, 500);
	})
	.use(prettyJSON())
	.use(
		cors({
			origin: ["http://localhost:3001"],
		}),
	)
	.use(secureHeaders())
	.use(
		bodyLimit({
			maxSize: 1024,
		}),
	)
	.use(etag())
	.use(timing)
	.route("/og-image", openImageRoutes)
	.mount("*", router.handler, {
		replaceRequest: (req) => {
			return req;
		},
	});

app.get("/health", (c) => {
	return c.json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

// app.doc("/openapi.json", {
// 	openapi: "3.0.0",
// 	info: {
// 		version: "1.0.0",
// 		title: "Travel API",
// 	},
// });

export { app };

export type App = typeof app;
