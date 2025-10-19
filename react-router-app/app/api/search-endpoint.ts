import type { Route } from "./+types/search-endpoint";

import {
	airportService,
	DatabaseError,
	handlePostgresError,
} from "@travel-anchor/data-access-layer";
import * as z from "zod";

import {
	getErrorByStatusCode,
	HTTP_SERVER_ERROR_CODES,
} from "~/lib/http-error-codes";

const airportSearchQuerySchema = z.object({
	query: z.string(),
});

export async function loader(params: Route.LoaderArgs) {
	if (!URL.canParse(params.request.url)) {
		return Response.json(
			{ message: `Invalid request url: ${params.request.url}` },
			{
				status: 400,
				statusText: "Bad Request",
			},
		);
	}
	const reqSearchParams = new URL(params.request.url).searchParams;

	const searchParamValidationResult =
		airportSearchQuerySchema.safeParse(reqSearchParams);

	if (searchParamValidationResult.error) {
		return Response.json(
			{ message: searchParamValidationResult.error.message },
			{
				status: 400,
				statusText: "Bad Request",
			},
		);
	}

	try {
		const airports = await airportService.searchAirports(
			searchParamValidationResult.data.query,
		);
		return Response.json({ airports }, { status: 200, statusText: "Success" });
	} catch (error) {
		if (error instanceof DatabaseError) {
			const { statusCode, message, logLevel } = handlePostgresError(error);
			console[logLevel](message);
			return Response.json(
				{ message },
				{
					status: statusCode,
					statusText: getErrorByStatusCode(statusCode).statusText,
				},
			);
		}

		const { INTERNAL_SERVER_ERROR } = HTTP_SERVER_ERROR_CODES;
		console.error(error);
		return Response.json(
			{ message: INTERNAL_SERVER_ERROR.message },
			{
				status: INTERNAL_SERVER_ERROR.statusCode,
				statusText: INTERNAL_SERVER_ERROR.statusText,
			},
		);
	}
}
