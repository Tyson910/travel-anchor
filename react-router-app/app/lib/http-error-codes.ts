export const HTTP_SERVER_ERROR_CODES = {
	BAD_REQUEST: {
		statusCode: 400,
		statusText: "Bad Request",
		message:
			"The request could not be understood by the server. Please check your input.",
	},
	UNAUTHORIZED: {
		statusCode: 401,
		statusText: "Unauthorized",
		message:
			"You need to log in or provide valid credentials to access this resource.",
	},
	PAYMENT_REQUIRED: {
		statusCode: 402,
		statusText: "Payment Required",
		message: "Payment is required to access this resource.",
	},
	FORBIDDEN: {
		statusCode: 403,
		statusText: "Forbidden",
		message: "You do not have permission to access this resource.",
	},
	NOT_FOUND: {
		statusCode: 404,
		statusText: "Not Found",
		message: "The requested resource could not be found.",
	},
	METHOD_NOT_ALLOWED: {
		statusCode: 405,
		statusText: "Method Not Allowed",
		message: "The request method is not allowed for this resource.",
	},
	NOT_ACCEPTABLE: {
		statusCode: 406,
		statusText: "Not Acceptable",
		message:
			"The server cannot produce a response matching the request's criteria.",
	},
	PROXY_AUTHENTICATION_REQUIRED: {
		statusCode: 407,
		statusText: "Proxy Authentication Required",
		message:
			"You need to authenticate with a proxy server before accessing this resource.",
	},
	REQUEST_TIMEOUT: {
		statusCode: 408,
		statusText: "Request Timeout",
		message: "The server took too long to respond. Please try again later.",
	},
	CONFLICT: {
		statusCode: 409,
		statusText: "Conflict",
		message: "There was a conflict with the current state of the resource.",
	},
	GONE: {
		statusCode: 410,
		statusText: "Gone",
		message: "The resource you are looking for is no longer available.",
	},
	LENGTH_REQUIRED: {
		statusCode: 411,
		statusText: "Length Required",
		message: "The request must include a valid Content-Length header.",
	},
	PRECONDITION_FAILED: {
		statusCode: 412,
		statusText: "Precondition Failed",
		message: "A precondition in the request was not met.",
	},
	PAYLOAD_TOO_LARGE: {
		statusCode: 413,
		statusText: "Payload Too Large",
		message: "The request payload is too large for the server to process.",
	},
	URI_TOO_LONG: {
		statusCode: 414,
		statusText: "URI Too Long",
		message: "The requested URL is too long for the server to handle.",
	},
	UNSUPPORTED_MEDIA_TYPE: {
		statusCode: 415,
		statusText: "Unsupported Media Type",
		message:
			"The server does not support the media format of the requested data.",
	},
	RANGE_NOT_SATISFIABLE: {
		statusCode: 416,
		statusText: "Range Not Satisfiable",
		message: "The requested range is not available for this resource.",
	},
	EXPECTATION_FAILED: {
		statusCode: 417,
		statusText: "Expectation Failed",
		message:
			"The server cannot meet the expectations given in the request headers.",
	},
	IM_A_TEAPOT: {
		statusCode: 418,
		statusText: "I'm a teapot",
		message: "This is a joke response. The server refuses to brew coffee.",
	},
	MISDIRECTED_REQUEST: {
		statusCode: 421,
		statusText: "Misdirected Request",
		message: "The request was sent to the wrong server.",
	},
	UNPROCESSABLE_ENTITY: {
		statusCode: 422,
		statusText: "Unprocessable Entity",
		message:
			"The request was well-formed but could not be processed due to semantic errors.",
	},
	LOCKED: {
		statusCode: 423,
		statusText: "Locked",
		message: "The requested resource is locked and cannot be accessed.",
	},
	FAILED_DEPENDENCY: {
		statusCode: 424,
		statusText: "Failed Dependency",
		message:
			"A dependency for the request failed, so the request could not be completed.",
	},
	TOO_EARLY: {
		statusCode: 425,
		statusText: "Too Early",
		message: "The server is unwilling to process the request at this time.",
	},
	UPGRADE_REQUIRED: {
		statusCode: 426,
		statusText: "Upgrade Required",
		message: "The client must upgrade to a newer protocol version.",
	},
	PRECONDITION_REQUIRED: {
		statusCode: 428,
		statusText: "Precondition Required",
		message:
			"The request requires certain conditions to be met before proceeding.",
	},
	TOO_MANY_REQUESTS: {
		statusCode: 429,
		statusText: "Too Many Requests",
		message:
			"You have made too many requests in a short period. Please slow down.",
	},
	REQUEST_HEADER_FIELDS_TOO_LARGE: {
		statusCode: 431,
		statusText: "Request Header Fields Too Large",
		message: "The request headers are too large for the server to process.",
	},
	UNAVAILABLE_FOR_LEGAL_REASONS: {
		statusCode: 451,
		statusText: "Unavailable For Legal Reasons",
		message: "Access to this resource has been restricted for legal reasons.",
	},
	INTERNAL_SERVER_ERROR: {
		statusCode: 500,
		statusText: "Internal Server Error",
		message: "Something went wrong on our end. Please try again later.",
	},
	NOT_IMPLEMENTED: {
		statusCode: 501,
		statusText: "Not Implemented",
		message: "This request method is not supported by the server.",
	},
	BAD_GATEWAY: {
		statusCode: 502,
		statusText: "Bad Gateway",
		message: "The server received an invalid response from an upstream server.",
	},
	SERVICE_UNAVAILABLE: {
		statusCode: 503,
		statusText: "Service Unavailable",
		message: "The server is temporarily unavailable. Please try again later.",
	},
	GATEWAY_TIMEOUT: {
		statusCode: 504,
		statusText: "Gateway Timeout",
		message: "The server took too long to respond. Please try again later.",
	},
	HTTP_VERSION_NOT_SUPPORTED: {
		statusCode: 505,
		statusText: "HTTP Version Not Supported",
		message:
			"The server does not support the HTTP version used in the request.",
	},
	VARIANT_ALSO_NEGOTIATES: {
		statusCode: 506,
		statusText: "Variant Also Negotiates",
		message:
			"There was an internal configuration error while processing your request.",
	},
	INSUFFICIENT_STORAGE: {
		statusCode: 507,
		statusText: "Insufficient Storage",
		message: "The server has run out of storage space to complete the request.",
	},
	LOOP_DETECTED: {
		statusCode: 508,
		statusText: "Loop Detected",
		message:
			"The server detected an infinite loop while processing your request.",
	},
	NOT_EXTENDED: {
		statusCode: 510,
		statusText: "Not Extended",
		message:
			"Further extensions to the request are required for it to be processed.",
	},
	NETWORK_AUTHENTICATION_REQUIRED: {
		statusCode: 511,
		statusText: "Network Authentication Required",
		message: "You need to authenticate to access the network.",
	},
} as const satisfies Record<
	string,
	{
		statusCode: number;
		statusText: string;
		message: string;
	}
>;

type HttpCodes = typeof HTTP_SERVER_ERROR_CODES;

export function getErrorByStatusCode<
	T extends HttpCodes[keyof HttpCodes]["statusCode"],
>(statusCode: T): HttpCodes[keyof HttpCodes] {
	const errorEntry = Object.values(HTTP_SERVER_ERROR_CODES).find(
		(error) => error.statusCode === statusCode,
	);

	if (!errorEntry) {
		throw new Error(`No error found for status code: ${statusCode}`);
	}
	return errorEntry;
}
