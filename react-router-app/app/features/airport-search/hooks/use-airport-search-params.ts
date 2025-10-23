import { useSearchParams } from "react-router";
import { z } from "zod";

import { type SortOption, sortOptionsValidator } from "../sorting-utils";

const querySchema = z.object({
	codes: z.union([
		z.string().length(3).toUpperCase(),
		z.string().length(3).toUpperCase().array(),
	]),
	view: z.enum(["grid", "map"]).optional().default("map"),
	sort: sortOptionsValidator.optional().default("time-difference"),
});

export function getIATACodesFromSearchParams(searchParams: URLSearchParams) {
	const codesParam = searchParams.getAll("codes");
	const validationResult = querySchema.shape.codes.safeParse(codesParam);

	if (validationResult.error) {
		return [];
	}

	if (typeof validationResult.data === "string") {
		return [validationResult.data];
	}
	return [...new Set(validationResult.data)];
}

function getActiveViewFromSearchParams(searchParams: URLSearchParams) {
	const rawQueryParamsObj = Object.fromEntries(searchParams.entries());
	const validationResult = querySchema.safeParse(rawQueryParamsObj);
	return validationResult.success ? validationResult.data.view : "map";
}

function getActiveSortFromSearchParams(searchParams: URLSearchParams) {
	const rawQueryParamsObj = Object.fromEntries(searchParams.entries());
	const validationResult = querySchema.safeParse(rawQueryParamsObj);
	return validationResult.success
		? validationResult.data.sort
		: "time-difference";
}

export function useAirportSearchParamsState() {
	const [searchParams, setSearchParams] = useSearchParams();

	const iataCodes = getIATACodesFromSearchParams(searchParams);
	const activeView = getActiveViewFromSearchParams(searchParams);
	const activeSort = getActiveSortFromSearchParams(searchParams);

	const addAirport = (code: string) => {
		const upperCode = code.toUpperCase();
		setSearchParams((prevParams) => {
			const newParams = new URLSearchParams(prevParams);
			// Remove existing instance to prevent duplicates
			newParams.delete("codes", upperCode);
			newParams.append("codes", upperCode);
			newParams.set("view", getActiveViewFromSearchParams(searchParams));
			return newParams;
		});
	};

	const removeAirport = (code: string) => {
		setSearchParams((prevParams) => {
			const newParams = new URLSearchParams(prevParams);
			newParams.delete("codes", code);
			return newParams;
		});
	};

	const clearAll = () =>
		setSearchParams((prevParams) => {
			const newParams = new URLSearchParams(prevParams);
			newParams.delete("codes");
			return newParams;
		});

	const setView = (view: "grid" | "map") => {
		setSearchParams((prev) => {
			prev.set("view", view);
			return prev;
		});
	};

	const setSort = (sort: SortOption) => {
		setSearchParams((prev) => {
			prev.set("sort", sort);
			return prev;
		});
	};

	const addListOfAirports = (codes: string[]) => {
		const params = new URLSearchParams();

		[...new Set(codes)].forEach((iata) => {
			const sanitizedIATA = iata.trim().toUpperCase();
			params.append("codes", sanitizedIATA);
		});

		setSearchParams(params);
	};

	return {
		iataCodes,
		activeView,
		activeSort,
		addAirport,
		removeAirport,
		clearAll,
		setView,
		setSort,
		addListOfAirports,
	};
}
