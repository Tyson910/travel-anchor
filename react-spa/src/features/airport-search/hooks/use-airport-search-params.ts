import type { SortOption } from "../sorting-utils";

import { useNavigate, useSearch } from "@tanstack/react-router";

export function useAirportSearchParamsState(routeId: "/search") {
	const navigate = useNavigate({ from: routeId });
	const {
		codes: iataCodes,
		view: activeView,
		sort: activeSort,
	} = useSearch({ from: routeId });

	const setView = (view: "grid" | "map") => {
		return navigate({
			search: (prev) => ({
				...prev,
				view: view,
			}),
		});
	};

	const setSort = (sort: SortOption) => {
		return navigate({
			search: (prev) => ({
				...prev,
				sort: sort,
			}),
		});
	};

	const addListOfAirports = (codes: string[]) => {
		return navigate({
			search: {
				sort: activeSort,
				codes: codes,
				view: activeView,
			},
		});
	};

	return {
		iataCodes: iataCodes,
		activeView: activeView,
		activeSort: activeSort,
		setView,
		setSort,
		addListOfAirports,
	};
}
