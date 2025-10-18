import { useSearchParams } from "react-router";
import { z } from "zod";

const querySchema = z.object({
	codes: z.union([
		z.string().length(3).toUpperCase(),
		z.string().length(3).toUpperCase().array(),
	]),
	view: z.enum(["grid", "map"]).optional().default("grid"),
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
	return validationResult.success ? validationResult.data.view : "grid";
}

export function useAirportSearchParamsState() {
	const [searchParams, setSearchParams] = useSearchParams();

	const iataCodes = getIATACodesFromSearchParams(searchParams);
	const activeView = getActiveViewFromSearchParams(searchParams);

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
		setSearchParams({ view });
	};

	const getPopularCombinationURL = (codes: string[]) => {
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
		addAirport,
		removeAirport,
		clearAll,
		setView,
		getPopularCombinationURL,
	};
}
