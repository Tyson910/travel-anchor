import { z } from "zod";

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
		return `err_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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

	// Endpoint not found
	endpoint: (path: string, method: string) =>
		APIResponseFactory().createNotFoundResponse({
			code: "ENDPOINT_NOT_FOUND",
			message: `Endpoint ${method} ${path} not found`,
			path,
			method,
		}),
} as const;
