export type ErrorType = "network" | "api" | "validation" | "unknown";

export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	if (error && typeof error === "object" && "message" in error) {
		return String(error.message);
	}
	return "An unexpected error occurred while loading flight routes";
}

export function getErrorType(error: unknown): ErrorType {
	if (error instanceof Error) {
		if (error.message.includes("fetch") || error.message.includes("network")) {
			return "network";
		}
		if (error.message.includes("404") || error.message.includes("500")) {
			return "api";
		}
		if (
			error.message.includes("validation") ||
			error.message.includes("schema")
		) {
			return "validation";
		}
	}
	return "unknown";
}

export function getErrorTitle(type: ErrorType): string {
	switch (type) {
		case "network":
			return "Network Connection Error";
		case "api":
			return "Service Unavailable";
		case "validation":
			return "Invalid Data";
		default:
			return "Something went wrong";
	}
}

export function getErrorDescription(type: ErrorType, message: string): string {
	switch (type) {
		case "network":
			return "Unable to connect to the flight data service. Please check your internet connection and try again.";
		case "api":
			return "The flight data service is temporarily unavailable. Please try again in a few moments.";
		case "validation":
			return "The flight data received is invalid. Please try searching again.";
		default:
			return message;
	}
}
