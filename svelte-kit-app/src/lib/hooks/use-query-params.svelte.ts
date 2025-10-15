import { z } from "zod";

import { page } from "$app/state";
import { goto } from "$app/navigation";

const querySchema = z.object({
	codes: z.union([
		z.string().length(3).toUpperCase(),
		z.string().length(3).toUpperCase().array(),
	]),
	view: z.enum(["grid", "map"]).optional().default("grid"),
});

export function useSearchQueryParams() {
	const rawQueryParamsObj = $derived(
		Object.fromEntries(page.url.searchParams.entries()),
	);

	const iataCodes = $derived.by(() => {
		const validationResult = querySchema.safeParse(rawQueryParamsObj);
		if (validationResult.error) {
			return [];
		}
		if (typeof validationResult.data.codes == "string") {
			return [validationResult.data.codes];
		}
		return validationResult.data.codes;
	});

	const activeView = $derived.by(() => {
		const validationResult = querySchema.safeParse(rawQueryParamsObj);
		return validationResult.success ? validationResult.data.view : "map";
	});

	function setView(view: z.infer<typeof querySchema>["view"]) {
		const freshURL = page.url;
		freshURL.searchParams.set("view", view);
		return goto(freshURL);
	}

	return {
		activeView,
		iataCodes,
		setView,
	};
}
