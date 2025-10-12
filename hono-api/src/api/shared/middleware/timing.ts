import type { MiddlewareHandler } from "hono";

import { logger } from "#logger/logger.ts";

export const startTime: MiddlewareHandler = async (c, next) => {
	c.set("startTime", performance.now());
	await next();
};

export const endTime: MiddlewareHandler = async (c, next) => {
	const start = c.get("startTime");
	await next();
	const end = performance.now();
	const duration = end - start;
	logger.info(`Request to ${c.req.path} took ${duration.toFixed(2)}ms`);
};

export const timing: MiddlewareHandler = async (c, next) => {
	c.set("startTime", performance.now());
	await next();
	const end = performance.now();
	const duration = end - c.get("startTime");
	logger.info(`Request to ${c.req.path} took ${duration.toFixed(2)}ms`);
};
