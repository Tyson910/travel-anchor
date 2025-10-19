import { DatabaseError as PostgresError } from "pg";

/**
 * Handles PostgreSQL database errors, logs them, and maps them to appropriate HTTP responses.
 * This function should only be used with instances of `DatabaseError` from `pg-protocol`.
 * It returns an object containing an HTTP status code, a user-friendly message,
 * and a log level for appropriate logging.
 * All PG error codes are available at [the postgres errors appendix](https://www.postgresql.org/docs/current/errcodes-appendix.html)
 * @param {Object} error - The database error object.
 * @param {string} [error.code] - The PostgreSQL error code.
 * @returns {{ statusCode: number; message: string; logLevel: 'warn' | 'error' }} An object containing the HTTP status code, message, and log level.
 *
 */
export function handlePostgresError(err: PostgresError): {
	statusCode: 400 | 403 | 409 | 500 | 503;
	message: string;
	logLevel: "warn" | "error";
} {
	// Handle non PostgresError cases just in case we slip up somewhere
	if (!(err instanceof PostgresError)) {
		console.error(
			"Unknown error instance. Please use instanceof before calling this function DatabaseError",
			err,
		);
		return {
			statusCode: 500,
			message: "An error occurred. Please try again later.",
			logLevel: "error",
		};
	}

	const errorClass = err.code?.substring(0, 2);

	switch (errorClass) {
		case "08": // Connection exceptions
			return {
				statusCode: 503,
				message: "A connection issue occurred. Please try again later.",
				logLevel: "error",
			};

		case "22": // Data exceptions
			return {
				statusCode: 400,
				message: "Invalid data input. Please check your entries and try again.",
				logLevel: "warn",
			};

		case "23": // Integrity constraint violations
			return {
				statusCode: 409,
				message: "The requested action conflicts with existing records.",
				logLevel: "error",
			};

		case "42": // Syntax or access rule violations
			return {
				statusCode: 400,
				message: "An error occurred while processing your request.",
				logLevel: "error",
			};

		case "53": // Insufficient resources
			return {
				statusCode: 503,
				message:
					"The service is temporarily unavailable. Please try again later.",
				logLevel: "error",
			};

		case "54": // Program limit exceeded
			return {
				statusCode: 400,
				message: "The request is too complex. Please simplify and try again.",
				logLevel: "warn",
			};

		case "57": // Operator intervention
			return {
				statusCode: 403,
				message: "The operation was interrupted. Please try again.",
				logLevel: "warn",
			};

		case "44": // WITH CHECK OPTION violation
			return {
				statusCode: 403,
				message: "A security constraint prevents this action.",
				logLevel: "warn",
			};

		case "40": // Transaction rollback
			return {
				statusCode: 409,
				message: "The transaction was rolled back due to a conflict.",
				logLevel: "warn",
			};

		//   case 'XX': // Internal errors
		// 	return { statusCode: 500, message: 'An unexpected error occurred. Our team has been notified.', logLevel: 'error' };
		//   case '58': // System errors
		// 	return { statusCode: 500, message: 'A system error occurred. Please try again later.', logLevel: 'error' };

		//   case 'HV': // Foreign Data Wrapper errors
		// 	return { statusCode: 500, message: 'A foreign data error occurred. Please contact support.', logLevel: 'error' };

		//   case 'F0': // Configuration file errors
		// 	return { statusCode: 500, message: 'A configuration issue was detected. Please contact support.', logLevel: 'error' };

		default:
			return {
				statusCode: 500,
				message:
					"An unexpected error occurred. Our team has been notified Please try again later.",
				logLevel: "error",
			};
	}
}
