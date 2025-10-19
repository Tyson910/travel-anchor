import type { SQLiteError } from "bun:sqlite";

import { logger } from "#logger";

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
