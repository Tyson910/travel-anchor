import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

const querySchema = z.object({
	codes: z.union([
		z.string().length(3).toUpperCase(),
		z.string().length(3).toUpperCase().array(),
	]),
	view: z.enum(["grid", "map"]).optional().default("grid"),
});

export function useSearchParamsState() {
	const [urlParams, setUrlParams] = useState(
		() => new URLSearchParams(window.location.search),
	);

	const iataCodes = useCallback(() => {
		const codesParam = urlParams.getAll("codes");
		const validationResult = querySchema.shape.codes.safeParse(codesParam);

		if (validationResult.error) {
			return [];
		}

		if (typeof validationResult.data === "string") {
			return [validationResult.data];
		}
		return validationResult.data;
	}, [urlParams]);

	const activeView = useCallback(() => {
		const rawQueryParamsObj = Object.fromEntries(urlParams.entries());
		const validationResult = querySchema.safeParse(rawQueryParamsObj);
		return validationResult.success ? validationResult.data.view : "grid";
	}, [urlParams]);

	const updateURL = useCallback((newParams: URLSearchParams) => {
		const newURL = `${window.location.pathname}?${newParams.toString()}`;
		window.history.pushState({}, "", newURL);
		setUrlParams(newParams);
	}, []);

	const addAirport = useCallback(
		(code: string) => {
			const params = new URLSearchParams(urlParams);
			const upperCode = code.toUpperCase();

			// Remove existing instance to prevent duplicates
			params.delete("codes", upperCode);
			params.append("codes", upperCode);

			updateURL(params);
		},
		[urlParams, updateURL],
	);

	const removeAirport = useCallback(
		(code: string) => {
			const params = new URLSearchParams(urlParams);
			params.delete("codes", code);
			updateURL(params);
		},
		[urlParams, updateURL],
	);

	const clearAll = useCallback(() => {
		const params = new URLSearchParams(urlParams);
		params.delete("codes");
		updateURL(params);
	}, [urlParams, updateURL]);

	const setView = useCallback(
		(view: "grid" | "map") => {
			const params = new URLSearchParams(urlParams);
			params.set("view", view);
			updateURL(params);
		},
		[urlParams, updateURL],
	);

	const getPopularCombinationURL = useCallback((codes: string[]) => {
		const params = new URLSearchParams();

		[...new Set(codes)].forEach((iata) => {
			const sanitizedIATA = iata.trim().toUpperCase();
			params.append("codes", sanitizedIATA);
		});

		return `${window.location.pathname}?${params.toString()}`;
	}, []);

	// Sync with browser back/forward buttons
	useEffect(() => {
		const handlePopState = () => {
			setUrlParams(new URLSearchParams(window.location.search));
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	return {
		iataCodes: iataCodes(),
		activeView: activeView(),
		addAirport,
		removeAirport,
		clearAll,
		setView,
		getPopularCombinationURL,
	};
}
