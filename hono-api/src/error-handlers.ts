import type { SQLiteError } from "bun:sqlite";

import { z } from "zod";

import { logger } from "./logger.ts";

/**
 * Handles SQLite database errors and maps them to appropriate HTTP responses.
 *
 * This function should only be used with instances of SQLite errors.
 * It returns an object containing an HTTP status code, a user-friendly message,
 * and a log level for appropriate logging.
 *
 * @param {Object} error - The database error object.
 * @param {string} [error.message] - The SQLite error message.
 * @returns {{ statusCode: number; message: string; logLevel: 'warning' | 'error' | 'info' }}
 * An object containing the HTTP status code, message, and log level.
 */
export function handleSQLiteError(error: SQLiteError): {
	statusCode: number;
	message: string;
	logLevel: "warning" | "error" | "info";
} {
	type ErrorObj = Record<
		string,
		{
			statusCode: number;
			message: string;
			logLevel: "warning" | "error" | "info";
		}
	>;

	const errorMap = {
		SQLITE_ERROR: {
			statusCode: 400,
			message: "A database error occurred.",
			logLevel: "error",
		},
		SQLITE_INTERNAL: {
			statusCode: 500,
			message: "An internal database error occurred.",
			logLevel: "error",
		},
		SQLITE_PERM: {
			statusCode: 403,
			message: "Permission denied.",
			logLevel: "warning",
		},
		SQLITE_ABORT: {
			statusCode: 409,
			message: "The operation was aborted.",
			logLevel: "warning",
		},
		SQLITE_BUSY: {
			statusCode: 503,
			message: "The database is currently busy. Please try again later.",
			logLevel: "error",
		},
		SQLITE_LOCKED: {
			statusCode: 409,
			message: "A database resource is locked. Try again later.",
			logLevel: "error",
		},
		SQLITE_NOMEM: {
			statusCode: 500,
			message: "Insufficient memory for the operation.",
			logLevel: "error",
		},
		SQLITE_READONLY: {
			statusCode: 403,
			message: "The database is in read-only mode.",
			logLevel: "warning",
		},
		SQLITE_INTERRUPT: {
			statusCode: 408,
			message: "The operation was interrupted.",
			logLevel: "warning",
		},
		SQLITE_IOERR: {
			statusCode: 500,
			message: "An input/output error occurred.",
			logLevel: "error",
		},
		SQLITE_CORRUPT: {
			statusCode: 500,
			message: "The database is not accessible.",
			logLevel: "error",
		},
		SQLITE_NOTFOUND: {
			statusCode: 404,
			message: "Requested database resource not found.",
			logLevel: "warning",
		},
		SQLITE_FULL: {
			statusCode: 507,
			message: "The database has insufficient space.",
			logLevel: "error",
		},
		SQLITE_CANTOPEN: {
			statusCode: 500,
			message: "The database could not be opened.",
			logLevel: "error",
		},
		SQLITE_PROTOCOL: {
			statusCode: 500,
			message: "A database protocol error occurred.",
			logLevel: "error",
		},
		SQLITE_EMPTY: {
			statusCode: 204,
			message: "The database returned no content.",
			logLevel: "info",
		},
		SQLITE_SCHEMA: {
			statusCode: 400,
			message: "The database schema has changed.",
			logLevel: "warning",
		},
		SQLITE_TOOBIG: {
			statusCode: 413,
			message: "The request was too large.",
			logLevel: "warning",
		},
		SQLITE_CONSTRAINT: {
			statusCode: 409,
			message: "A database constraint was violated.",
			logLevel: "warning",
		},
		SQLITE_MISMATCH: {
			statusCode: 400,
			message: "Invalid data format.",
			logLevel: "warning",
		},
		SQLITE_MISUSE: {
			statusCode: 500,
			message: "The database was misused.",
			logLevel: "error",
		},
		SQLITE_NOLFS: {
			statusCode: 500,
			message: "Large file support is unavailable.",
			logLevel: "error",
		},
		SQLITE_AUTH: {
			statusCode: 403,
			message: "Unauthorized access.",
			logLevel: "warning",
		},
		SQLITE_RANGE: {
			statusCode: 400,
			message: "Query parameter out of range.",
			logLevel: "warning",
		},
		SQLITE_NOTADB: {
			statusCode: 400,
			message: "Database error occurred.",
			logLevel: "error",
		},
		SQLITE_WARNING: {
			statusCode: 200,
			message: "A warning was logged.",
			logLevel: "warning",
		},
	} as const satisfies ErrorObj;

	const errorKeyArr = Object.keys(error) as (keyof typeof errorMap)[];

	const errorKey = errorKeyArr.find((key) => error.code?.startsWith(key));

	const response =
		errorKey && errorMap[errorKey]
			? errorMap[errorKey]
			: ({
					statusCode: 500,
					message: "An unexpected database error occurred.",
					logLevel: "error",
				} as const);

	logger[response.logLevel](response.message, { error: error });

	return response;
}

// Base error schema
const baseErrorSchema = z.object({
	code: z.string(),
	message: z.string(),
	details: z.unknown().optional(),
	errorId: z.string().optional(),
	documentationUrl: z.url().optional(),
});

// HTTP Error Codes
const HTTPErrorCodeSchema = z.union([
	z.literal("NOT_FOUND"),
	z.literal("RESOURCE_NOT_FOUND"),
	z.literal("ENDPOINT_NOT_FOUND"),
	z.literal("ENTITY_NOT_FOUND"),
	z.literal("USER_NOT_FOUND"),
	z.literal("PRODUCT_NOT_FOUND"),
]);

// const userNotFoundDetailsSchema = resourceNotFoundDetailsSchema.extend({
//   resource: z.literal('user'),
//   userId: z.string(),
//   availableUsers: z.array(z.string()).optional(),
// });

// const productNotFoundDetailsSchema = resourceNotFoundDetailsSchema.extend({
//   resource: z.literal('product'),
//   productId: z.string(),
//   category: z.string().optional(),
//   similarProducts: z.array(z.string()).optional(),
// });

// Suggestions schema
const suggestionsSchema = z.object({
	similarResources: z.array(z.string()).optional(),
	availableEndpoints: z.array(z.string()).optional(),
	searchQuery: z.string().optional(),
});

// Main 404 Response Schema
export const notFoundResponseSchema = z.object({
	success: z.literal(false),
	status: z.literal(404),
	error: baseErrorSchema.extend({
		code: HTTPErrorCodeSchema,
	}),
	timestamp: z.iso.datetime(),
	path: z.string(),
	method: z.string(),
	requestId: z.string().optional(),
	suggestions: suggestionsSchema.optional(),
});

// Type inference from Zod schemas
type NotFoundResponse = z.infer<typeof notFoundResponseSchema>;
type HTTPErrorCode = z.infer<typeof HTTPErrorCodeSchema>;
// type UserNotFoundDetails = z.infer<typeof userNotFoundDetailsSchema>;
// type ProductNotFoundDetails = z.infer<typeof productNotFoundDetailsSchema>;

// Factory function with Zod validation
function APIResponseFactory() {
	function createNotFoundResponse(options: {
		code: HTTPErrorCode;
		message: string;
		details?: unknown;
		path: string;
		method: string;
		requestId?: string;
	}): NotFoundResponse {
		const response = {
			success: false as const,
			status: 404 as const,
			error: {
				code: options.code,
				message: options.message,
				details: options.details,
				errorId: generateErrorId(),
				documentationUrl: "https://api.example.com/docs/errors/not-found",
			},
			timestamp: new Date().toISOString(),
			path: options.path,
			method: options.method,
			requestId: options.requestId,
		};

		// Validate the response against the schema
		return notFoundResponseSchema.parse(response);
	}

	function validateNotFoundResponse(response: unknown): NotFoundResponse {
		return notFoundResponseSchema.parse(response);
	}

	function safeValidateNotFoundResponse(
		response: unknown,
	): z.ZodSafeParseResult<unknown> {
		return notFoundResponseSchema.safeParse(response);
	}

	function generateErrorId(): string {
		return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	return {
		generateErrorId,
		safeValidateNotFoundResponse,
		validateNotFoundResponse,
		createNotFoundResponse,
	};
}

// Utility functions for common 404 scenarios
export const notFoundUtils = {
	// Generic not found
	generic: (path: string, method: string) =>
		APIResponseFactory().createNotFoundResponse({
			code: "NOT_FOUND",
			message: "The requested resource was not found",
			path,
			method,
		}),

	// Resource not found with specific ID
	resource: (
		resource: string,
		id: string | number,
		path: string,
		method: string,
	) =>
		APIResponseFactory().createNotFoundResponse({
			code: "RESOURCE_NOT_FOUND",
			message: `${resource} with ID ${id} not found`,
			details: { resource, id },
			path,
			method,
		}),

	// User not found
	// user: (
	// 	userId: string,
	// 	path: string,
	// 	method: string,
	// 	availableUsers?: string[],
	// ) =>
	// 	APIResponseFactory().createNotFoundResponse({
	// 		code: "USER_NOT_FOUND",
	// 		message: `User with ID ${userId} not found`,
	// 		details: userNotFoundDetailsSchema.parse({
	// 			resource: "user",
	// 			userId,
	// 			availableUsers,
	// 		}),
	// 		path,
	// 		method,
	// 	}),

	// Endpoint not found
	endpoint: (path: string, method: string) =>
		APIResponseFactory().createNotFoundResponse({
			code: "ENDPOINT_NOT_FOUND",
			message: `Endpoint ${method} ${path} not found`,
			path,
			method,
		}),
} as const;
