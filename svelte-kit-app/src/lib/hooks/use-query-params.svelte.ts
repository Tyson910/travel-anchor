import { goto } from "$app/navigation";
import { page } from "$app/state";

import { z } from "zod";

const querySchema = z.object({
	codes: z.union([
		z.string().length(3).toUpperCase(),
		z.string().length(3).toUpperCase().array(),
	]),
	view: z.enum(["grid", "map"]).optional().default("grid"),
});

class UseSearchQueryParams {
	#rawQueryParamsObj = $derived(
		Object.fromEntries(page.url.searchParams.entries()),
	);

	#validationResult = $derived(querySchema.safeParse(this.#rawQueryParamsObj));

	iataCodes = $derived.by(() => {
		if (this.#validationResult.error) {
			return [];
		}
		if (typeof this.#validationResult.data.codes == "string") {
			return [this.#validationResult.data.codes];
		}
		return this.#validationResult.data.codes;
	});

	activeView = $derived(
		this.#validationResult.success ? this.#validationResult.data.view : "map",
	);

	setView(view: z.infer<typeof querySchema>["view"]) {
		const freshURL = page.url;
		freshURL.searchParams.set("view", view);
		return goto(freshURL);
	}
}

export const useSearchQueryParams = () => new UseSearchQueryParams();
