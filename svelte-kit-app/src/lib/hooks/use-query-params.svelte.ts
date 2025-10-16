import { z } from "zod";

import { goto } from "$app/navigation";
import { page } from "$app/state";

export const querySchema = z.object({
	codes: z.union([
		z.string().length(3).toUpperCase(),
		z.string().length(3).toUpperCase().array(),
	]),
	view: z.enum(["grid", "map"]).optional().default("grid"),
});

export function parseIataCodesParams(searchParams: URLSearchParams): string[] {
	const codesParam = searchParams.getAll("codes");
	const validationResult = querySchema.shape.codes.safeParse(codesParam);

	if (validationResult.error) {
		return [];
	}
	// TODO: prevent dupes
	if (typeof validationResult.data == "string") {
		return [validationResult.data];
	}
	return validationResult.data;
}

class UseSearchQueryParams {
	iataCodes: string[] = $derived(parseIataCodesParams(page.url.searchParams));

	activeView = $derived.by(() => {
		const rawQueryParamsObj = Object.fromEntries(
			page.url.searchParams.entries(),
		);

		const validationResult = querySchema.safeParse(rawQueryParamsObj);
		return validationResult.success ? validationResult.data.view : "map";
	});

	setView(view: z.infer<typeof querySchema>["view"]) {
		const freshURL = page.url;
		freshURL.searchParams.set("view", view);
		return goto(freshURL);
	}
}

export const useSearchQueryParams = () => new UseSearchQueryParams();
